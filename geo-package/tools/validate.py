"""Validate the GEO package and write validation/results.json + validation/validation-report.md.

Run from the repo root:
  python3 geo-package/tools/validate.py --vocab <schemaorg-current-https.jsonld> --xsd <sitemap.xsd>

The schema.org vocabulary file (v29.3) is at
https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/29.3/schemaorg-current-https.jsonld
and sitemap.xsd ships in the `sitemap` npm package (schema/sitemap.xsd).
"""
import argparse
import datetime
import json
import pathlib
import re
import subprocess
import urllib.robotparser

import rdflib
from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parents[2]
PKG = ROOT / "geo-package"
SITE = "https://eliavatravel.com"
S = "https://schema.org/"

results = []


def check(group, name, ok, detail=""):
    results.append({"group": group, "check": name, "status": "PASS" if ok else "FAIL", "detail": detail})
    return ok


def warn(group, name, detail):
    results.append({"group": group, "check": name, "status": "WARN", "detail": detail})


# ---------------------------------------------------------------- crawl inputs
crawl = json.loads((PKG / "crawl" / "crawl.json").read_text())
by_path = {c["path"]: c for c in crawl}
INDEXABLE = {p for p, c in by_path.items()
             if c["status"] == 200 and "noindex" not in c["robots"]
             and c["finalUrl"] == p and c["canonical"] == SITE + p}
SERVED_FILES = {"/assets/eliava-logo.png", "/assets/share.png", "/llms-full.txt"}


def page_text(rel):
    html = (ROOT / rel / "index.html").read_text() if rel else (ROOT / "index.html").read_text()
    soup = BeautifulSoup(html, "lxml")
    for t in soup(["script", "style", "svg"]):
        t.decompose()
    return re.sub(r"\s+", " ", soup.get_text(" ")).replace(" .", ".").replace(" ,", ",")


SITE_TEXT = {p: page_text(p.strip("/")) for p in by_path if p != "/samples/"}


def norm(s):
    return re.sub(r"\s+", " ", s.replace("’", "'")).strip()


# ---------------------------------------------------------------- vocabulary
def load_vocab(path):
    g = json.loads(pathlib.Path(path).read_text())["@graph"]
    classes, props, parents = set(), {}, {}
    for n in g:
        t = n.get("@type")
        t = t if isinstance(t, list) else [t]
        nid = n["@id"].replace("schema:", S)
        if "rdfs:Class" in t:
            classes.add(nid)
            sc = n.get("rdfs:subClassOf", [])
            sc = sc if isinstance(sc, list) else [sc]
            parents[nid] = {x["@id"].replace("schema:", S) for x in sc}
        if "rdf:Property" in t:
            d = n.get("schema:domainIncludes", [])
            d = d if isinstance(d, list) else [d]
            props[nid] = {x["@id"].replace("schema:", S) for x in d}
    return classes, props, parents


def ancestors(cls, parents):
    seen, stack = set(), [cls]
    while stack:
        c = stack.pop()
        if c in seen:
            continue
        seen.add(c)
        stack.extend(parents.get(c, ()))
    return seen


def walk(node, fn, path="$"):
    if isinstance(node, dict):
        fn(node, path)
        for k, v in node.items():
            walk(v, fn, f"{path}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, fn, f"{path}[{i}]")


def validate_schema(vocab):
    classes, props, parents = vocab
    all_ids, refs, docs = set(), [], {}
    for f in sorted((PKG / "schema").glob("*.jsonld")):
        g = f"schema/{f.name}"
        raw = f.read_text()
        try:
            doc = json.loads(raw)
            check(g, "JSON syntax", True)
        except json.JSONDecodeError as e:
            check(g, "JSON syntax", False, str(e))
            continue
        docs[f.name] = doc
        # JSON-LD -> RDF with a local @vocab (schema.org context is not fetched).
        local = dict(doc)
        local["@context"] = {"@vocab": S}
        try:
            graph = rdflib.Graph().parse(data=json.dumps(local), format="json-ld")
            check(g, "JSON-LD parses to RDF (rdflib)", len(graph) > 0, f"{len(graph)} triples")
        except Exception as e:  # noqa: BLE001
            check(g, "JSON-LD parses to RDF (rdflib)", False, repr(e))
        check(g, "@context is https://schema.org", doc.get("@context") == "https://schema.org")

        problems = []

        def visit(n, p):
            if "@id" in n and len(n) > 1:
                all_ids.add(n["@id"])
            if set(n) == {"@id"}:
                refs.append((g, n["@id"]))
            types = n.get("@type")
            if types is None:
                return
            types = types if isinstance(types, list) else [types]
            anc = set()
            for t in types:
                if S + t not in classes:
                    problems.append(f"{p}: unknown type {t}")
                anc |= ancestors(S + t, parents)
            for k in n:
                if k.startswith("@"):
                    continue
                if S + k not in props:
                    problems.append(f"{p}: unknown property {k}")
                elif not (props[S + k] & anc):
                    problems.append(f"{p}: {k} not expected on {'/'.join(types)}")

        walk(doc, visit)
        check(g, "schema.org v29.3 types and properties valid", not problems, "; ".join(problems))

        # Rich-result requirements (Google Search Central).
        for n in doc["@graph"]:
            if n.get("@type") == "FAQPage":
                ok = all(q.get("@type") == "Question" and q.get("name")
                         and q.get("acceptedAnswer", {}).get("@type") == "Answer"
                         and q["acceptedAnswer"].get("text") for q in n["mainEntity"])
                check(g, "FAQPage required fields (Question.name, acceptedAnswer.text)", ok,
                      f"{len(n['mainEntity'])} questions")
                path = n["url"].replace(SITE, "")
                text = norm(SITE_TEXT[path])
                missing = [q["name"] for q in n["mainEntity"]
                           if norm(q["name"]) not in text or norm(q["acceptedAnswer"]["text"]) not in text]
                check(g, f"FAQ text matches visible page text on {path}", not missing,
                      "; ".join(missing) or "all Q&A found verbatim")
            if n.get("@type") == "Organization":
                check(g, "Organization has name, url, logo", all(n.get(k) for k in ("name", "url", "logo")))
            if n.get("@type") == "Service":
                check(g, f"Service '{n['name']}' has name, provider, description",
                      all(n.get(k) for k in ("name", "provider", "description")))

    unresolved = [f"{g}: {r}" for g, r in refs if r not in all_ids]
    check("schema/*", "Every @id reference resolves to a node in the package", not unresolved,
          "; ".join(unresolved))
    return docs


# ---------------------------------------------------------------- URLs
URL_RE = re.compile(r"https://eliavatravel\.com(/[^\s\"'<>)\]]*)?")


def validate_urls():
    files = list((PKG / "schema").glob("*.jsonld")) + list((PKG / "discovery").glob("*"))
    for f in files:
        bad = []
        for m in URL_RE.finditer(f.read_text()):
            path = (m.group(1) or "/").split("#")[0].rstrip(".,")
            if f.name == "robots.txt" and path == "/sitemap.xml":
                continue  # the proposed sitemap itself
            if path in INDEXABLE or path in SERVED_FILES:
                continue
            if path == "/" and f.suffix == ".jsonld":
                continue  # Organization/WebSite url = site root (exists, 200)
            bad.append(path)
        check(f"{f.parent.name}/{f.name}", "Every eliavatravel.com URL is a confirmed indexable path",
              not bad, "unconfirmed: " + ", ".join(sorted(set(bad))) if bad else "")
    for asset in ("assets/eliava-logo.png", "assets/share.png"):
        check("assets", f"/{asset} exists in deployed source", (ROOT / asset).exists())


def validate_sitemap(xsd):
    sm = PKG / "discovery" / "sitemap.xml"
    r = subprocess.run(["xmllint", "--noout", "--schema", xsd, str(sm)], capture_output=True, text=True)
    check("discovery/sitemap.xml", "XSD valid (sitemaps.org 0.9, xmllint)", r.returncode == 0,
          (r.stderr or r.stdout).strip())
    locs = re.findall(r"<loc>https://eliavatravel\.com(/[^<]*)</loc>", sm.read_text())
    check("discovery/sitemap.xml", "Lists exactly the confirmed indexable paths",
          set(locs) == INDEXABLE, f"{len(locs)} URLs; missing={sorted(INDEXABLE - set(locs))} extra={sorted(set(locs) - INDEXABLE)}")
    excluded = sorted(set(by_path) - INDEXABLE)
    warn("discovery/sitemap.xml", "Excluded crawled paths", ", ".join(
        f"{p} ({'noindex' if 'noindex' in by_path[p]['robots'] else 'redirects to ' + by_path[p]['finalUrl']})"
        for p in excluded))


def validate_robots():
    f = PKG / "discovery" / "robots.txt"
    rp = urllib.robotparser.RobotFileParser()
    rp.parse(f.read_text().splitlines())
    ok = all(rp.can_fetch(ua, SITE + p) for ua in ("*", "Googlebot", "GPTBot", "ClaudeBot", "PerplexityBot")
             for p in INDEXABLE)
    check("discovery/robots.txt", "Parses; all indexable paths allowed for search and AI crawlers", ok)
    check("discovery/robots.txt", "Declares sitemap", rp.site_maps() == [SITE + "/sitemap.xml"], str(rp.site_maps()))


def validate_llms():
    for name in ("llms.txt", "llms-full.txt"):
        lines = (PKG / "discovery" / name).read_text().splitlines()
        check(f"discovery/{name}", "llmstxt.org shape: H1 first, then blockquote summary",
              lines[0].startswith("# ") and any(l.startswith("> ") for l in lines[:4]))
        check(f"discovery/{name}", "Has H2 sections", any(l.startswith("## ") for l in lines))
    lt = (PKG / "discovery" / "llms.txt").read_text()
    links = re.findall(r"^- \[[^\]]+\]\((https://[^)]+)\)", lt, re.M)
    check("discovery/llms.txt", "Section entries are markdown link lists", len(links) >= 8, f"{len(links)} links")


# ---------------------------------------------------------------- evidence
CLAIMS = [
    # (claim used in the package, page path, exact phrase on that page)
    ("Legal name Eliava Consulting, LLC", "/terms/", "Eliava Consulting, LLC is a Georgia limited liability company"),
    ("DBA Eliava Travel Ops", "/terms/", "does business as Eliava Travel Ops"),
    ("Does not sell travel", "/terms/", "We do not sell travel."),
    ("Never takes or holds client payments", "/terms/", "We never take or hold your clients' payments."),
    ("No marketing, websites or travel sales", "/get-started/", "We also don't do marketing, websites or travel sales."),
    ("Serves travel advisors and travel agencies", "/privacy/", "behind-the-scenes help for travel advisors and travel agencies"),
    ("Footer description", "/services/", "Client emails, payment reminders, documents and deadlines, done on time inside your tools."),
    ("Based in Georgia, US business hours", "/services/", "Based in Georgia, on US business hours."),
    ("15+ years ops, 4+ years luxury agencies", "/services/", "15+ years in operations and 4+ years inside luxury agencies."),
    ("Certifications", "/services/", "Travefy Advanced Certified and Tern Workflows & Automations Certified."),
    ("NDA + E&O insurance", "/services/", "Eliava signs your NDA and carries E&O insurance."),
    ("Contact email hello@", "/services/", "hello@eliavatravel.com"),
    ("Legal email legal@", "/privacy/", "legal@eliavatravel.com"),
    ("Free 25-minute call on Zoom", "/services/", "It's free and takes 25 minutes on Zoom."),
    ("No hourly billing", "/services/", "No hourly billing."),
    ("Nothing reaches a client without OK", "/working-agreement/", "Nothing reaches a client without your OK."),
    ("Host login never needed", "/working-agreement/", "Your host login is never needed."),
    ("Automation plan $295", "/services/automation-plan/", "$295 · 2 weeks to your plan"),
    ("Setup from $1,175, 3 weeks", "/services/setup/", "From $1,175 for one kind of trip · 3 weeks to live"),
    ("Setup 14 days of questions", "/services/setup/", "14 days of questions answered"),
    ("Backlog from $495, 2 weeks", "/services/backlog-catch-up/", "From $495 · 2 weeks start to done"),
    ("Hand-off kit from $495", "/services/hand-off-kit/", "From $495 for one kind of trip · 2 weeks to hand-off"),
    ("Weekly help $990 / $1,100", "/services/weekly-help/", "$990 a month, quarter plan · $1,100 month to month · Month 1 no commitment"),
    ("Weekly: routine tasks in 2 business days", "/services/weekly-help/", "Routine tasks are done within 2 business days."),
    ("Embedded $1,980 / $2,200", "/services/weekly-help/", "It's $1,980 a month on the quarter plan, or $2,200 month to month."),
    ("One Embedded client at a time", "/services/weekly-help/", "We take one Embedded client at a time."),
    ("$110 off month 2", "/services/", "$110 comes off month 2"),
    ("Private library from $1,495", "/services/", "From $1,495"),
    ("Untangle one thing $95", "/services/", "Untangle one thing, together"),
    ("AI setup with Claude", "/services/", "We set up Claude with your voice, your steps and your templates."),
    ("Team training 4+ people", "/services/", "4 or more people"),
    ("$295 credited toward setup within 30 days", "/services/automation-plan/", "Book a setup within 30 days and the $295 comes off the price."),
    ("Tool list", "/get-started/", "VacationCRM"),
    ("Wave season Oct-Jan", "/get-started/", "October to January is coming"),
    ("Established advisors 3-10+ years", "/get-started/", "Three to ten-plus years in, luxury or high-touch, solo or a small agency."),
    ("Refund before work begins", "/terms/", "Before work begins, you can get a refund of any deposit or prepayment."),
    ("Georgia law", "/terms/", "These terms are governed by the laws of the State of Georgia."),
    ("No analytics, ads or tracking cookies", "/privacy/", "This site has no analytics, no ads and no tracking cookies of our own."),
    ("Stripe payments", "/terms/", "Payments are processed by Stripe."),
    ("cal.com booking link", "/get-started/", None),  # checked in HTML below
    ("AI tools: person reviews; no card/passport numbers", "/terms/", "We never put card numbers or passport numbers into AI tools"),
]


def validate_claims():
    rows = []
    for claim, path, phrase in CLAIMS:
        if phrase is None:
            ok = "https://cal.com/kady-dennis/discovery-call" in (ROOT / "get-started" / "index.html").read_text()
            phrase = "href=https://cal.com/kady-dennis/discovery-call"
        else:
            ok = norm(phrase) in norm(SITE_TEXT[path])
        rows.append((claim, path, phrase, ok))
        check("evidence", f"Claim supported: {claim}", ok, f"{path}: \"{phrase}\"")
    return rows


# ---------------------------------------------------------------- unpublished
def validate_unpublished():
    for f in ("robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"):
        check("unpublished", f"/{f} not present at site root", not (ROOT / f).exists())
    html = "".join(p.read_text() for p in ROOT.glob("**/index.html") if "geo-package" not in str(p))
    check("unpublished", "No JSON-LD or noscript added to any live page", "application/ld+json" not in html and "<noscript" not in html)
    r = subprocess.run(["git", "ls-tree", "-r", "--name-only", "origin/main"], cwd=ROOT, capture_output=True, text=True)
    check("unpublished", "origin/main (deployed branch) contains no geo-package files",
          r.returncode == 0 and "geo-package/" not in r.stdout)


def write_report(claim_rows):
    (PKG / "validation" / "results.json").write_text(json.dumps(results, indent=1) + "\n")
    counts = {s: sum(r["status"] == s for r in results) for s in ("PASS", "FAIL", "WARN")}
    out = [
        "# Validation report",
        "",
        f"Run: {datetime.datetime.now().astimezone().isoformat(timespec='seconds')} with `geo-package/tools/validate.py`.",
        "",
        f"**{counts['PASS']} pass · {counts['FAIL']} fail · {counts['WARN']} warnings.** Raw results: `results.json`.",
        "",
        "Validators used: Python `json` (syntax), rdflib 7.6 JSON-LD parser (JSON-LD to RDF), the schema.org v29.3 vocabulary "
        "(types, properties and domains), Google's FAQPage and Organization field rules, `xmllint` with the sitemaps.org 0.9 XSD, "
        "and Python `urllib.robotparser`. The Google Rich Results Test and validator.schema.org could not be reached from this "
        "sandbox (network policy), so run those on the staging or live URL after approval.",
        "",
        "| Group | Check | Status | Detail |",
        "|---|---|---|---|",
    ]
    for r in results:
        d = r["detail"].replace("|", "\\|")
        out.append(f"| {r['group']} | {r['check']} | {r['status']} | {d} |")
    (PKG / "validation" / "validation-report.md").write_text("\n".join(out) + "\n")

    led = ["# Evidence ledger", "",
           "Every business claim in the package, the page it comes from, and the exact phrase found there. "
           "These are checked automatically by `tools/validate.py` against the deployed source HTML.", "",
           "| Claim | Source page | Exact phrase on page | Found |", "|---|---|---|---|"]
    for c, p, ph, ok in claim_rows:
        led.append(f"| {c} | `{p}` | {ph.replace('|', '\\|')} | {'yes' if ok else '**NO**'} |")
    led += ["", "## Facts deliberately left out (not confirmed by any live page)", "",
            "- Founder or owner name. It appears only in the cal.com URL slug and the email address, never as visible text, so there's no `founder` in the schema.",
            "- Street address or phone number. Only \"Based in Georgia\" is stated, so the schema uses addressRegion GA / addressCountry US.",
            "- Social profiles (`sameAs`). No profile links on any page.",
            "- Area served. Not stated; the site says only \"based in Georgia, US business hours\".",
            "- \"Pay in three parts by November 14\" (`/services/setup/` FAQ). Visible, but left out of the FAQ markup and llms files because it's time-bound.",
            "- Content from the pre-placeholder home page (`live-site-backup-2026-10-15`). Not live, so it's used only in the copy proposal for the rebuilt home page."]
    (PKG / "evidence-ledger.md").write_text("\n".join(led) + "\n")
    return counts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vocab", required=True)
    ap.add_argument("--xsd", required=True)
    a = ap.parse_args()
    validate_schema(load_vocab(a.vocab))
    validate_urls()
    validate_sitemap(a.xsd)
    validate_robots()
    validate_llms()
    rows = validate_claims()
    validate_unpublished()
    print(json.dumps(write_report(rows)))
    for r in results:
        if r["status"] != "PASS":
            print(r["status"], r["group"], r["check"], r["detail"][:300])


if __name__ == "__main__":
    main()

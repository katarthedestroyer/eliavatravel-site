"""Build the draft JSON-LD files in geo-package/schema/ from verified site facts.

Every fact below cites the page it was read from (see ../evidence-ledger.md).
FAQPage blocks are extracted from the <details class="pk-q"> / FAQ markup of
each page, so the structured data always matches the visible text.

Run from the repo root:  python3 geo-package/tools/build_schema.py
"""
import json
import pathlib
import re

from bs4 import BeautifulSoup

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "geo-package" / "schema"
SITE = "https://eliavatravel.com"
ORG_ID = SITE + "/#organization"
WEBSITE_ID = SITE + "/#website"

# FAQ questions left out of the markup on purpose (see validation report).
EXCLUDED_QUESTIONS = {
    # Time-bound offer ("Reach out by November 14"); markup would go stale.
    ("services/setup", "Can I pay in parts?"),
}

ORG = {
    "@type": "Organization",
    "@id": ORG_ID,
    "name": "Eliava Travel Ops",                       # terms §1 "does business as"
    "legalName": "Eliava Consulting, LLC",             # terms §1, privacy §1, footer
    "alternateName": "Eliava",                         # page titles "| Eliava"
    "url": SITE + "/",                                 # CNAME, canonical tags
    "logo": SITE + "/assets/eliava-logo.png",          # repo asset (wordmark)
    "image": SITE + "/assets/share.png",               # og:image on every content page
    "description": (
        "Behind-the-scenes help for travel advisors. Client emails, payment "
        "reminders, documents and deadlines, done on time inside your tools."
    ),                                                 # site footer, verbatim
    "email": "hello@eliavatravel.com",                 # footer, home placeholder
    "address": {                                       # services "Based in Georgia"; terms §1
        "@type": "PostalAddress",
        "addressRegion": "GA",
        "addressCountry": "US",
    },
    "contactPoint": [
        {"@type": "ContactPoint", "contactType": "customer service",
         "email": "hello@eliavatravel.com", "availableLanguage": "en"},
        {"@type": "ContactPoint", "contactType": "privacy and legal requests",
         "email": "legal@eliavatravel.com"},           # privacy §12, terms §12
    ],
    "knowsAbout": [                                    # get-started tool list; services FAQ
        "Tern", "TravelJoy", "Travefy", "VacationCRM", "Tess", "CBO", "Trello",
        "Asana", "ClickUp", "Flodesk", "Travel advisor back-office operations",
        "Travel CRM workflow automation",
    ],
    "hasCredential": [                                 # services "Why Eliava"
        {"@type": "EducationalOccupationalCredential", "name": "Travefy Advanced Certified"},
        {"@type": "EducationalOccupationalCredential", "name": "Tern Workflows & Automations Certified"},
    ],
}

WEBSITE = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    "url": SITE + "/",
    "name": "Eliava Travel Ops",
    "inLanguage": "en",
    "publisher": {"@id": ORG_ID},
}

USD = "USD"


def price(value):
    return {"@type": "Offer", "price": value, "priceCurrency": USD,
            "availability": "https://schema.org/InStock"}


def from_price(value):
    return {"@type": "Offer", "priceCurrency": USD,
            "availability": "https://schema.org/InStock",
            "priceSpecification": {"@type": "PriceSpecification",
                                   "minPrice": value, "priceCurrency": USD}}


def monthly(value, name):
    return {"@type": "Offer", "name": name, "priceCurrency": USD, "price": value,
            "availability": "https://schema.org/InStock",
            "priceSpecification": {"@type": "UnitPriceSpecification",
                                   "price": value, "priceCurrency": USD,
                                   "referenceQuantity": {"@type": "QuantitativeValue",
                                                         "value": 1, "unitCode": "MON"}}}


# Package pages: name, path, description (each from the page's own meta description / hero).
PACKAGES = [
    {
        "slug": "automation-plan",
        "name": "Automation plan",
        "description": ("A full map of one kind of trip: what to automate in your Tern, "
                        "TravelJoy or Travefy, what to keep by hand, and when each email "
                        "goes out. With video walkthroughs. Delivered in 2 weeks."),
        "offers": [price(295)],
    },
    {
        "slug": "setup",
        "name": "Set up your Tern, TravelJoy or Travefy",
        "description": ("Client emails in your voice, payment dates, deadlines and "
                        "checklists for one kind of trip, set up in your Tern, TravelJoy "
                        "or Travefy. You OK each email. About 3 weeks to live."),
        "offers": [from_price(1175)],
    },
    {
        "slug": "backlog-catch-up",
        "name": "Backlog catch-up",
        "description": ("A fixed list of overdue work in your Tern, TravelJoy or Travefy, "
                        "agreed before we start, then done in two weeks."),
        "offers": [from_price(495)],
    },
    {
        "slug": "weekly-help",
        "name": "Weekly back-office help",
        "description": ("Weekly help with every step of your trips, from new inquiries to "
                        "welcome-home emails, inside your own tools. Month 1 has no "
                        "commitment."),
        "offers": [monthly(990, "Quarter plan"), monthly(1100, "Month to month")],
    },
    {
        "slug": "hand-off-kit",
        "name": "Assistant hand-off kit",
        "description": ("Written steps for one kind of trip, your templates and supplier "
                        "notes in one place, and two live training sessions for your new "
                        "hire. 2 weeks to hand-off."),
        "offers": [from_price(495)],
    },
]

# Catalog-only items listed on /services/ with no page of their own.
CATALOG_EXTRA = [
    {"name": "CRM setup and training",
     "description": "Your trips and clients moved to Tern or another tool, set up for how you work, then live training. Priced after your free call.",
     "offers": None},
    {"name": "Your private library",
     "description": "Templates, supplier contacts, trip steps and hotel notes in one private place, built wherever you want it.",
     "offers": [from_price(1495)]},
    {"name": "Untangle one thing, together",
     "description": "Bring one thing that's stuck. We fix it live on Zoom, inside your own account.",
     "offers": [price(95)]},
    {"name": "Embedded weekly help",
     "description": "For a busier business or a team. Adds a weekly video recap and one new build each quarter.",
     "offers": [monthly(1980, "Quarter plan"), monthly(2200, "Month to month")],
     "url": SITE + "/services/weekly-help/"},
    {"name": "AI setup and training",
     "description": "We set up Claude with your voice, your steps and your templates. Then we teach you and your assistant. Priced after your free call.",
     "offers": None},
    {"name": "Team training",
     "description": "For 4 or more people, planned around your trips and tools. Priced after your free call.",
     "offers": None},
]


def service_node(name, description, offers, url=None, sid=None):
    node = {"@type": "Service", "name": name, "description": description,
            "serviceType": "Travel advisor back-office operations",
            "provider": {"@id": ORG_ID},
            "audience": {"@type": "BusinessAudience",
                         "audienceType": "Travel advisors and travel agencies"}}
    if sid:
        node["@id"] = sid
    if url:
        node["url"] = url
    if offers:
        node["offers"] = offers if len(offers) > 1 else offers[0]
    return node


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


def extract_faq(rel_dir):
    """Return [(question, answer)] from the visible FAQ on a page."""
    html = (ROOT / rel_dir / "index.html").read_text()
    soup = BeautifulSoup(html, "lxml")
    pairs = []
    for d in soup.select("details"):
        summary = d.find("summary")
        if not summary:
            continue
        q = clean(summary.get_text(" "))
        summary.extract()
        a = clean(d.get_text(" "))
        a = re.sub(r"\s+([.,])", r"\1", a)
        if (rel_dir, q) in EXCLUDED_QUESTIONS:
            continue
        pairs.append((q, a))
    return pairs


def faq_node(page_url, pairs):
    return {"@type": "FAQPage", "@id": page_url + "#faq", "url": page_url,
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}}
                           for q, a in pairs]}


def write(name, graph):
    doc = {"@context": "https://schema.org", "@graph": graph}
    (OUT / name).write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    faq_report = {}

    # Sitewide: Organization + WebSite (place on every indexable page, or at least /services/).
    write("organization.jsonld", [ORG, WEBSITE])

    # /services/: catalog of every package, plus the page FAQ.
    services_url = SITE + "/services/"
    items = []
    for p in PACKAGES:
        url = f"{SITE}/services/{p['slug']}/"
        items.append(service_node(p["name"], p["description"], p["offers"], url, url + "#service"))
    for x in CATALOG_EXTRA:
        items.append(service_node(x["name"], x["description"], x["offers"], x.get("url")))
    catalog = {"@type": "OfferCatalog", "@id": services_url + "#catalog",
               "name": "Eliava Travel Ops services and prices",
               "url": services_url,
               "itemListElement": items}
    org_ref = {"@id": ORG_ID, "hasOfferCatalog": {"@id": services_url + "#catalog"}}
    pairs = extract_faq("services")
    faq_report["services"] = len(pairs)
    write("services.jsonld", [org_ref, catalog, faq_node(services_url, pairs)])

    # Each package page: its Service + its FAQ.
    for p in PACKAGES:
        url = f"{SITE}/services/{p['slug']}/"
        node = service_node(p["name"], p["description"], p["offers"], url, url + "#service")
        rel = f"services/{p['slug']}"
        pairs = extract_faq(rel)
        faq_report[rel] = len(pairs)
        write(f"service-{p['slug']}.jsonld", [node, faq_node(url, pairs)])

    print(json.dumps(faq_report, indent=1))


if __name__ == "__main__":
    main()

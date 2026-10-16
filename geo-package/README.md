# GEO implementation package: eliavatravel.com

**Status: DRAFT, unpublished, pending your approval.** Nothing in this folder is live, and no live page has been changed. These files are on branch `claude/dreamy-feynman-565x67` only. Do **not** merge this folder to `main` as it is. GitHub Pages serves everything on `main` (the repo has `.nojekyll`), so a merge would publish `/geo-package/` as a public folder. On approval, the files get copied to their real locations (see the bottom of this README) in a separate commit.

Audience: search crawlers and AI systems that need to discover and understand Eliava Travel Ops and its services.

## What's in the package

| File | What it is |
|---|---|
| `seo-audit.md` | Full `/marketing:seo-audit` output: technical checklist, on-page issues, keywords, gaps, competitors, action plan |
| `confirmed-paths.md` | Crawl results and the 10 confirmed canonical paths, plus every flagged or unconfirmed path |
| `evidence-ledger.md` | Every business claim, mapped to the exact phrase on the page it came from (all auto-checked) |
| `discovery/llms.txt` | Proposed `/llms.txt` (llmstxt.org format) |
| `discovery/llms-full.txt` | Proposed `/llms-full.txt`: the full verified reference for AI systems |
| `discovery/sitemap.xml` | Proposed `/sitemap.xml`: 10 confirmed URLs, XSD-valid |
| `discovery/robots.txt` | Proposed `/robots.txt` (the site has none today) |
| `schema/organization.jsonld` | Organization + WebSite, for every indexable page |
| `schema/services.jsonld` | OfferCatalog of all 11 offerings + FAQPage (8 Q&A) for `/services/` |
| `schema/service-*.jsonld` | Service + Offer + FAQPage for each of the 5 package pages |
| `copy/direct-answer-openings.md` | Answer-first opening copy for home (two options), `/services/` and each package page |
| `copy/noscript-fallback.md` | Tested JS-off gaps and `<noscript>` snippets for `/get-started/` and `/services/` |
| `validation/validation-report.md` | Validation results (116 pass, 0 fail, 1 informational warning) |
| `crawl/crawl.json` | Raw crawl data (with JS on and with JS off) |
| `tools/build_schema.py`, `tools/validate.py` | Rebuild and re-validate the package after any copy change |

## Done-when checklist

- [x] **The missing discovery and structured-data checks are addressed.** The site had no sitemap, robots.txt, llms.txt or JSON-LD, and the home page was a dead end. All are covered.
- [x] **Every business claim and sitemap path is backed by a confirmed input.** 41 claims are matched verbatim to live-source pages, and the 10 sitemap URLs equal the crawl's indexable set exactly.
- [x] **Unconfirmed items are flagged:** home (`noindex`), `/samples/`, `/fix/next/`, orphaned PDFs, dead `/#` anchors, founder name, address, phone, `sameAs`, and the time-bound "pay in parts" FAQ.
- [x] **FAQPage is used only where real FAQ content exists:** `/services/` plus 5 package pages. Not applicable to `/`, `/get-started/`, `/working-agreement/`, `/privacy/` and `/terms/` (no Q&A content on them).
- [x] **Validation results are saved and nothing is published:** see `validation/`. The unpublished checks pass.

## Blockers and caveats

1. **The live domain couldn't be reached from this sandbox** (the egress proxy refuses `eliavatravel.com`). The crawl used the deployed source (`main` = commit `09d96d8`, CNAME `eliavatravel.com`). Before publishing, spot-check that the 10 sitemap URLs return 200 on the real domain.
2. **The Google Rich Results Test and validator.schema.org couldn't be reached.** Validation used the schema.org v29.3 vocabulary, rdflib and Google's documented field rules offline. Run the Rich Results Test on the live URLs after publishing.
3. **FAQ rich results:** since 2023, Google shows FAQ rich results mainly for government and health sites. The FAQPage markup is still valid, and AI systems still use it, but don't expect FAQ dropdowns in Google.
4. **Your decisions needed:** (a) home page Option A or B, (b) whether to delete the 6 orphaned sample PDFs, (c) "Single Fix" vs "Untangle one thing" as the product name, (d) whether to add a founder or "About" fact so it can go in the schema.

## How to approve

Reply with "approve" (or name the parts you want changed), and I'll then make these changes in one commit on this branch for you to merge:

1. Copy `discovery/robots.txt`, `sitemap.xml`, `llms.txt` and `llms-full.txt` to the site root, with the `DRAFT` comment lines removed.
2. Add `<script type="application/ld+json">` blocks: `organization.jsonld` on every indexable page, `services.jsonld` on `/services/`, and each `service-*.jsonld` on its package page.
3. Apply the copy and noscript changes you approve, and fix the dead anchors.
4. Remove `/geo-package/` from the publishing commit (keep it on a non-deployed branch).
5. Re-run `tools/validate.py`, then you submit the sitemap in Google Search Console and Bing Webmaster Tools.

To rebuild and re-validate after copy edits:

```
python3 geo-package/tools/build_schema.py
python3 geo-package/tools/validate.py --vocab schemaorg-current-https.jsonld --xsd sitemap.xsd
```

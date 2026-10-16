# Confirmed path list

**Source of truth:** the deployed source of eliavatravel.com. That's this repository, branch `main`, commit `09d96d8`. `CNAME` = `eliavatravel.com`, and the site is served by GitHub Pages (privacy policy §2).

**Why not the live URL:** this sandbox's network policy blocks `eliavatravel.com`. curl got a 403 from the egress proxy, and WebFetch got a DNS failure. So the crawl ran against the same files served locally (`python3 -m http.server`), using headless Chromium (Playwright 1.56), on 2026-10-16. **Before publishing, re-run one live check:** fetch each sitemap URL on the real domain and confirm it returns 200.

## Crawl 1: start at `/` and follow links (how a crawler discovers the site today)

| Path | Status | Result |
|---|---|---|
| `/` | 200 | `noindex`. **0 internal links to other pages.** The crawl stops here. |

**Finding:** the home page is a dead end for discovery. A crawler starting at the domain root finds no other page. Every other page can be discovered only through old index entries or external links. The draft `sitemap.xml` and `llms.txt` exist to fix this.

## Crawl 2: every HTML page in the deployed source, with links followed

| Path | Status | Final URL | robots | Canonical | In sitemap? | Why |
|---|---|---|---|---|---|---|
| `/` | 200 | `/` | noindex | `(none)` | no | noindex |
| `/services/` | 200 | `/services/` | index | `/services/` | **yes** | indexable, self-canonical |
| `/get-started/` | 200 | `/get-started/` | index | `/get-started/` | **yes** | indexable, self-canonical |
| `/working-agreement/` | 200 | `/working-agreement/` | index | `/working-agreement/` | **yes** | indexable, self-canonical |
| `/privacy/` | 200 | `/privacy/` | index | `/privacy/` | **yes** | indexable, self-canonical |
| `/terms/` | 200 | `/terms/` | index | `/terms/` | **yes** | indexable, self-canonical |
| `/samples/` | 200 | `/services/` | index | `/services/` | no | meta-refresh to /services/, canonical /services/ |
| `/fix/next/` | 200 | `/fix/next/` | noindex | `(none)` | no | noindex |
| `/services/automation-plan/` | 200 | `/services/automation-plan/` | index | `/services/automation-plan/` | **yes** | indexable, self-canonical |
| `/services/setup/` | 200 | `/services/setup/` | index | `/services/setup/` | **yes** | indexable, self-canonical |
| `/services/backlog-catch-up/` | 200 | `/services/backlog-catch-up/` | index | `/services/backlog-catch-up/` | **yes** | indexable, self-canonical |
| `/services/weekly-help/` | 200 | `/services/weekly-help/` | index | `/services/weekly-help/` | **yes** | indexable, self-canonical |
| `/services/hand-off-kit/` | 200 | `/services/hand-off-kit/` | index | `/services/hand-off-kit/` | **yes** | indexable, self-canonical |

**Confirmed canonical, indexable paths (10):** `/services/`, `/services/automation-plan/`, `/services/setup/`, `/services/backlog-catch-up/`, `/services/weekly-help/`, `/services/hand-off-kit/`, `/get-started/`, `/working-agreement/`, `/privacy/`, `/terms/`.

## Flagged, not in the sitemap

| Item | Flag |
|---|---|
| `/` (home) | Exists (200) but is `noindex` ("Excuse our dust" placeholder since 2026-10-15). Add it to the sitemap only when `noindex` is removed. See `copy/direct-answer-openings.md`, Option A or B. |
| `/fix/next/` | Post-payment thank-you page, `noindex`. Correctly excluded. |
| `/samples/` | Meta-refresh redirect to `/services/`, `noindex`. Correctly excluded. |
| `/samples/pdf/*.pdf` (6 files) | Still in the repo and publicly reachable, but **no page links to them** since "Sample work" was removed. They're orphaned and possibly outdated. Decide: delete them, or keep them out of search with an `X-Robots-Tag` (not possible on GitHub Pages, so deleting is the practical option). |
| `/#start`, `/#about`, `/#quiz` | Linked from the nav and footer on every page, and `/#quiz` from the `/services/` FAQ. **The anchors don't exist** on the current home page. |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt` | **Do not exist** on the site today. Drafts are in `discovery/`. |


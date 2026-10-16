# SEO audit: eliavatravel.com (2026-10-16)

Method: `/marketing:seo-audit` (full site audit), run against the deployed source because the live domain is blocked from this sandbox. **No SEO tool was connected:** Ahrefs and Similarweb failed to connect (proxy 403). So keyword demand and difficulty are qualitative estimates from web search, not measured volumes. Reconnect Ahrefs and re-run to replace them with real numbers.

## Executive summary

The content pages are strong. Each package page has clear prices, timing, scope, "fit / not a fit" lists and real FAQs, all in server-rendered HTML with clean self-canonicals. That's exactly what search and AI systems can quote. **Discovery is the problem: right now the site is close to invisible.** The home page is a `noindex` placeholder with no links out, there's no sitemap, no robots.txt, no llms.txt and no structured data, and the nav's "How it works" and "About" links point to anchors that no longer exist.

**Overall: critical issues on discovery, strong foundation on content.**

The top 3 fixes:

1. Give the home page a way out (links, plus a decision on `noindex`).
2. Ship `sitemap.xml`, `robots.txt` and `llms.txt` from this package.
3. Add the Organization, Service and FAQPage JSON-LD.

## Technical SEO checklist

| Check | Status | Details |
|---|---|---|
| Home page indexable | **Fail** | `noindex` on `/` since the 2026-10-15 placeholder. The brand query has no home page to rank. |
| Crawl path from home | **Fail** | `/` links to no internal page. A crawl from the root finds 1 page out of 11. |
| XML sitemap | **Fail** | None. Draft: `discovery/sitemap.xml` (10 confirmed URLs, XSD-valid). |
| robots.txt | **Fail** | None. Draft: `discovery/robots.txt`. |
| llms.txt / llms-full.txt | **Fail** | None. Drafts are in `discovery/`. |
| Structured data | **Fail** | 0 JSON-LD blocks on any page. Drafts are in `schema/` (validated). |
| Canonical tags | Pass | All 10 content pages are self-canonical. `/samples/` canonicalizes to `/services/`. |
| Internal anchors | **Fail** | `/#start`, `/#about` and `/#quiz` are linked sitewide and don't exist. |
| Orphaned files | Warning | 6 PDFs in `/samples/pdf/` are reachable but unlinked. |
| HTTPS | Pass (by config) | Canonicals and og:url use https. Couldn't test the live certificate. |
| Mobile | Pass | Viewport meta on every page. Layout is responsive (CSS reviewed). |
| Content without JS | Pass | Content is in the HTML. Only the `/services/` finder is JS-only, and the `/get-started/` form can't send without JS. See `copy/noscript-fallback.md`. |
| Page weight | Pass | No hero video on current pages. Largest image asset 141 KB (`share.png`). |
| Analytics / Search Console | Unknown | The privacy policy says no analytics. Search Console status not visible from here; verify it in GSC. |

## On-page issues

| Page | Issue | Severity | Recommended fix |
|---|---|---|---|
| `/` | `noindex` plus no internal links | Critical | Option A in `copy/direct-answer-openings.md`: answer paragraph and links, then remove `noindex`. |
| All pages | Nav "How it works" → `/#start`, "About" → `/#about` (dead anchors) | High | Point "How it works" to `/working-agreement/`. Hide "About" until the new home ships. |
| `/services/` | FAQ answer links "1-minute check" to `/#quiz` (dead) | Medium | Reword it to point at the 3-question finder on the same page. |
| `/services/` | Meta description is 212 chars (truncated in results) | Medium | Trim to about 155 chars: "Fixed prices for travel advisors: Automation plan $295, setup from $1,175, catch-up from $495, weekly help $990/mo. Answer 3 questions to see your top 3." |
| `/services/automation-plan/`, `/services/hand-off-kit/`, `/services/setup/` | Meta descriptions 165–167 chars | Low | Trim about 10 chars each. |
| `/services/`, package pages | H1s are slogans and don't name the service category | Medium | Keep the H1s. Add the direct-answer sentence after them (see the copy file). |
| `/privacy/`, `/terms/` | Titles use "\| Eliava", while other pages use "\| Eliava Travel Ops" | Low | Standardize on "\| Eliava Travel Ops". |
| `/get-started/` | Form can't send without JS | Medium | Add the noscript fallback. |
| `/fix/next/` vs `/services/` | Same $95 product called "Single Fix" in one place and "Untangle one thing, together" in the other | Low | Pick one name. |
| Package pages | No links between sibling packages except in "not a fit" lines | Low | Add a "Related packages" row at the bottom. |

## Keyword opportunities (qualitative, no tool data)

| Keyword | Est. difficulty | Opportunity | Current ranking | Intent | Recommended content |
|---|---|---|---|---|---|
| Tern workflow setup for travel advisors | Easy | High | Unknown | Commercial | `/services/setup/` (exists). Add "Tern" to the H2s. |
| TravelJoy setup service | Easy | High | Unknown | Commercial | `/services/setup/` + FAQ entry |
| Travefy automated workflows setup | Easy–moderate | High | Unknown | Commercial | `/services/setup/`. Travefy's own blog ranks for the feature; target "done for you". |
| travel advisor back office help | Moderate | High | Unknown | Commercial | `/services/weekly-help/` |
| virtual assistant for travel advisors | Hard (VA agencies) | Medium | Unknown | Commercial | Comparison page: "Weekly help vs hiring a VA" |
| travel agent assistant training / SOPs | Easy | High | Unknown | Commercial | `/services/hand-off-kit/` |
| travel advisor automation plan | Easy | Medium | Unknown | Commercial | `/services/automation-plan/` |
| move to Tern from Travefy / migrate to Tern | Easy–moderate | High | Unknown | Commercial | New page for CRM setup and training (currently has no page) |
| what can travel agents automate | Moderate | Medium | Unknown | Informational | Guide (Travefy ranks here) |
| final payment reminder email travel agent | Easy | Medium | Unknown | Informational | Guide or template article |
| welcome home email travel advisor | Easy | Medium | Unknown | Informational | Guide or template article |
| wave season prep travel advisor | Easy | Medium (seasonal, Oct–Jan) | Unknown | Informational | Article → `/services/backlog-catch-up/` |
| Claude AI for travel advisors | Easy (new) | High | Unknown | Informational/commercial | New page for AI setup and training |
| travel agency backlog catch up | Easy | Low–medium | Unknown | Commercial | `/services/backlog-catch-up/` |
| travel advisor CRM comparison Tern vs TravelJoy vs Travefy | Moderate | Medium | Unknown | Commercial investigation | Comparison guide |

## Content gaps

| Topic | Why it matters | Format | Priority | Effort |
|---|---|---|---|---|
| CRM setup and training (move to Tern) | Listed with no page. Migration is high-intent, and host agencies are pushing Tern. | Landing page | High | Moderate |
| AI setup and training (Claude) | New, low-competition, and fits your consultancy direction | Landing page | High | Moderate |
| About / credentials | The "About" nav target is gone. AI systems look for who is behind a service. | Section or page | High | Quick win |
| "What travel advisors can automate" | Informational demand, and it feeds the Automation plan | Guide | Medium | Substantial |
| Weekly help vs a VA | Buyers compare you to VA agencies (about $1,600/mo, per Stealth Agents' own page) | Comparison page | Medium | Moderate |

## Competitor snapshot (qualitative)

| Dimension | Eliava | Stealth Agents (VA agency) | "Travefy Systems Intensive" (Payhip seller) | Winner |
|---|---|---|---|---|
| Positioning | Done-for-you ops inside the advisor's tools | General VA staffing | One-off Travefy install | Eliava (specific) |
| Price transparency | Full, on page | "From $1,600/mo" | Not shown in results | Eliava |
| Structured data / discovery files | None yet | Unknown | None (marketplace page) | Open. This package fixes it for you. |
| Content depth | 10 pages, strong FAQs | Large blog | Single listing | Stealth Agents (volume) |
| Keyword / backlink data | Needs Ahrefs | Needs Ahrefs | Needs Ahrefs | n/a |

The vendors (Tern, Travefy) also offer their own onboarding and migration help, and they rank for the feature terms. Position Eliava as the "done in your voice, on your trips" layer on top of the vendors, not a rival to them.

## Prioritized action plan

**Quick wins (this week)**

1. Approve and ship `discovery/robots.txt`, `sitemap.xml`, `llms.txt` and `llms-full.txt` to the site root. Then submit the sitemap in Google Search Console and Bing Webmaster Tools. Impact high, effort 30 minutes.
2. Home page Option A (answer paragraph and links, remove `noindex`). Impact high, effort 30 minutes. This depends on your call about the placeholder.
3. Fix the dead nav anchors on all pages. Impact high, effort 30 minutes.
4. Paste the approved JSON-LD into the 6 service pages, and put `organization.jsonld` sitewide. Impact medium–high, effort 1 hour.
5. Add the 2 noscript fallbacks and trim the 4 long meta descriptions. Impact medium, effort 30 minutes.

**Strategic (this quarter)**

1. Build pages for CRM setup and training (Tern migration) and for AI setup and training. Impact high, effort half a day each.
2. Ship the rebuilt home page with the direct-answer opening and an About section (credentials, Georgia, E&O). Then add `/` to the sitemap.
3. Write one "what to automate" guide per tool (Tern, TravelJoy, Travefy), linking into the Automation plan.
4. Reconnect Ahrefs and re-run this audit for real volumes and backlinks.

Sources consulted for the competitor and keyword context:
- [Stealth Agents: hire a virtual assistant travel agent](https://stealthagents.com/hire-virtual-assistant-travel-agent-today)
- [Payhip: Travefy Systems Intensive](https://payhip.com/b/KPyfT)
- [Travefy: travel agency automation](https://travefy.com/blog-post/travel-agency-automation)
- [Travefy: Automated Workflows announcement](https://travefy.com/blog-post/travefy-introduces-automated-workflows-to-bring-next-level-efficiency)
- [Tern](https://www.tern.travel)
- [Travel Market Report: Ensemble partnerships](https://www.travelmarketreport.com/retail-strategies/articles/ensemble-expands-technology-offerings-with-new-partnerships)

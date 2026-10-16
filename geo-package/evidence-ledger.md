# Evidence ledger

Every business claim in the package, the page it comes from, and the exact phrase found there. These are checked automatically by `tools/validate.py` against the deployed source HTML.

| Claim | Source page | Exact phrase on page | Found |
|---|---|---|---|
| Legal name Eliava Consulting, LLC | `/terms/` | Eliava Consulting, LLC is a Georgia limited liability company | yes |
| DBA Eliava Travel Ops | `/terms/` | does business as Eliava Travel Ops | yes |
| Does not sell travel | `/terms/` | We do not sell travel. | yes |
| Never takes or holds client payments | `/terms/` | We never take or hold your clients' payments. | yes |
| No marketing, websites or travel sales | `/get-started/` | We also don't do marketing, websites or travel sales. | yes |
| Serves travel advisors and travel agencies | `/privacy/` | behind-the-scenes help for travel advisors and travel agencies | yes |
| Footer description | `/services/` | Client emails, payment reminders, documents and deadlines, done on time inside your tools. | yes |
| Based in Georgia, US business hours | `/services/` | Based in Georgia, on US business hours. | yes |
| 15+ years ops, 4+ years luxury agencies | `/services/` | 15+ years in operations and 4+ years inside luxury agencies. | yes |
| Certifications | `/services/` | Travefy Advanced Certified and Tern Workflows & Automations Certified. | yes |
| NDA + E&O insurance | `/services/` | Eliava signs your NDA and carries E&O insurance. | yes |
| Contact email hello@ | `/services/` | hello@eliavatravel.com | yes |
| Legal email legal@ | `/privacy/` | legal@eliavatravel.com | yes |
| Free 25-minute call on Zoom | `/services/` | It's free and takes 25 minutes on Zoom. | yes |
| No hourly billing | `/services/` | No hourly billing. | yes |
| Nothing reaches a client without OK | `/working-agreement/` | Nothing reaches a client without your OK. | yes |
| Host login never needed | `/working-agreement/` | Your host login is never needed. | yes |
| Automation plan $295 | `/services/automation-plan/` | $295 · 2 weeks to your plan | yes |
| Setup from $1,175, 3 weeks | `/services/setup/` | From $1,175 for one kind of trip · 3 weeks to live | yes |
| Setup 14 days of questions | `/services/setup/` | 14 days of questions answered | yes |
| Backlog from $495, 2 weeks | `/services/backlog-catch-up/` | From $495 · 2 weeks start to done | yes |
| Hand-off kit from $495 | `/services/hand-off-kit/` | From $495 for one kind of trip · 2 weeks to hand-off | yes |
| Weekly help $990 / $1,100 | `/services/weekly-help/` | $990 a month, quarter plan · $1,100 month to month · Month 1 no commitment | yes |
| Weekly: routine tasks in 2 business days | `/services/weekly-help/` | Routine tasks are done within 2 business days. | yes |
| Embedded $1,980 / $2,200 | `/services/weekly-help/` | It's $1,980 a month on the quarter plan, or $2,200 month to month. | yes |
| One Embedded client at a time | `/services/weekly-help/` | We take one Embedded client at a time. | yes |
| $110 off month 2 | `/services/` | $110 comes off month 2 | yes |
| Private library from $1,495 | `/services/` | From $1,495 | yes |
| Untangle one thing $95 | `/services/` | Untangle one thing, together | yes |
| AI setup with Claude | `/services/` | We set up Claude with your voice, your steps and your templates. | yes |
| Team training 4+ people | `/services/` | 4 or more people | yes |
| $295 credited toward setup within 30 days | `/services/automation-plan/` | Book a setup within 30 days and the $295 comes off the price. | yes |
| Tool list | `/get-started/` | VacationCRM | yes |
| Wave season Oct-Jan | `/get-started/` | October to January is coming | yes |
| Established advisors 3-10+ years | `/get-started/` | Three to ten-plus years in, luxury or high-touch, solo or a small agency. | yes |
| Refund before work begins | `/terms/` | Before work begins, you can get a refund of any deposit or prepayment. | yes |
| Georgia law | `/terms/` | These terms are governed by the laws of the State of Georgia. | yes |
| No analytics, ads or tracking cookies | `/privacy/` | This site has no analytics, no ads and no tracking cookies of our own. | yes |
| Stripe payments | `/terms/` | Payments are processed by Stripe. | yes |
| cal.com booking link | `/get-started/` | href=https://cal.com/kady-dennis/discovery-call | yes |
| AI tools: person reviews; no card/passport numbers | `/terms/` | We never put card numbers or passport numbers into AI tools | yes |

## Facts deliberately left out (not confirmed by any live page)

- Founder or owner name. It appears only in the cal.com URL slug and the email address, never as visible text, so there's no `founder` in the schema.
- Street address or phone number. Only "Based in Georgia" is stated, so the schema uses addressRegion GA / addressCountry US.
- Social profiles (`sameAs`). No profile links on any page.
- Area served. Not stated; the site says only "based in Georgia, US business hours".
- "Pay in three parts by November 14" (`/services/setup/` FAQ). Visible, but left out of the FAQ markup and llms files because it's time-bound.
- Content from the pre-placeholder home page (`live-site-backup-2026-10-15`). Not live, so it's used only in the copy proposal for the rebuilt home page.

# Validation report

Run: 2026-10-16T18:01:33+00:00 with `geo-package/tools/validate.py`.

**116 pass · 0 fail · 1 warnings.** Raw results: `results.json`.

Validators used: Python `json` (syntax), rdflib 7.6 JSON-LD parser (JSON-LD to RDF), the schema.org v29.3 vocabulary (types, properties and domains), Google's FAQPage and Organization field rules, `xmllint` with the sitemaps.org 0.9 XSD, and Python `urllib.robotparser`. The Google Rich Results Test and validator.schema.org could not be reached from this sandbox (network policy), so run those on the staging or live URL after approval.

| Group | Check | Status | Detail |
|---|---|---|---|
| schema/organization.jsonld | JSON syntax | PASS |  |
| schema/organization.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 45 triples |
| schema/organization.jsonld | @context is https://schema.org | PASS |  |
| schema/organization.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/organization.jsonld | Organization has name, url, logo | PASS |  |
| schema/service-automation-plan.jsonld | JSON syntax | PASS |  |
| schema/service-automation-plan.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 40 triples |
| schema/service-automation-plan.jsonld | @context is https://schema.org | PASS |  |
| schema/service-automation-plan.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/service-automation-plan.jsonld | Service 'Automation plan' has name, provider, description | PASS |  |
| schema/service-automation-plan.jsonld | FAQPage required fields (Question.name, acceptedAnswer.text) | PASS | 4 questions |
| schema/service-automation-plan.jsonld | FAQ text matches visible page text on /services/automation-plan/ | PASS | all Q&A found verbatim |
| schema/service-backlog-catch-up.jsonld | JSON syntax | PASS |  |
| schema/service-backlog-catch-up.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 43 triples |
| schema/service-backlog-catch-up.jsonld | @context is https://schema.org | PASS |  |
| schema/service-backlog-catch-up.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/service-backlog-catch-up.jsonld | Service 'Backlog catch-up' has name, provider, description | PASS |  |
| schema/service-backlog-catch-up.jsonld | FAQPage required fields (Question.name, acceptedAnswer.text) | PASS | 4 questions |
| schema/service-backlog-catch-up.jsonld | FAQ text matches visible page text on /services/backlog-catch-up/ | PASS | all Q&A found verbatim |
| schema/service-hand-off-kit.jsonld | JSON syntax | PASS |  |
| schema/service-hand-off-kit.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 49 triples |
| schema/service-hand-off-kit.jsonld | @context is https://schema.org | PASS |  |
| schema/service-hand-off-kit.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/service-hand-off-kit.jsonld | Service 'Assistant hand-off kit' has name, provider, description | PASS |  |
| schema/service-hand-off-kit.jsonld | FAQPage required fields (Question.name, acceptedAnswer.text) | PASS | 5 questions |
| schema/service-hand-off-kit.jsonld | FAQ text matches visible page text on /services/hand-off-kit/ | PASS | all Q&A found verbatim |
| schema/service-setup.jsonld | JSON syntax | PASS |  |
| schema/service-setup.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 49 triples |
| schema/service-setup.jsonld | @context is https://schema.org | PASS |  |
| schema/service-setup.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/service-setup.jsonld | Service 'Set up your Tern, TravelJoy or Travefy' has name, provider, description | PASS |  |
| schema/service-setup.jsonld | FAQPage required fields (Question.name, acceptedAnswer.text) | PASS | 5 questions |
| schema/service-setup.jsonld | FAQ text matches visible page text on /services/setup/ | PASS | all Q&A found verbatim |
| schema/service-weekly-help.jsonld | JSON syntax | PASS |  |
| schema/service-weekly-help.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 75 triples |
| schema/service-weekly-help.jsonld | @context is https://schema.org | PASS |  |
| schema/service-weekly-help.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/service-weekly-help.jsonld | Service 'Weekly back-office help' has name, provider, description | PASS |  |
| schema/service-weekly-help.jsonld | FAQPage required fields (Question.name, acceptedAnswer.text) | PASS | 6 questions |
| schema/service-weekly-help.jsonld | FAQ text matches visible page text on /services/weekly-help/ | PASS | all Q&A found verbatim |
| schema/services.jsonld | JSON syntax | PASS |  |
| schema/services.jsonld | JSON-LD parses to RDF (rdflib) | PASS | 257 triples |
| schema/services.jsonld | @context is https://schema.org | PASS |  |
| schema/services.jsonld | schema.org v29.3 types and properties valid | PASS |  |
| schema/services.jsonld | FAQPage required fields (Question.name, acceptedAnswer.text) | PASS | 8 questions |
| schema/services.jsonld | FAQ text matches visible page text on /services/ | PASS | all Q&A found verbatim |
| schema/* | Every @id reference resolves to a node in the package | PASS |  |
| schema/service-backlog-catch-up.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| schema/service-hand-off-kit.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| schema/service-setup.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| schema/service-weekly-help.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| schema/organization.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| schema/service-automation-plan.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| schema/services.jsonld | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| discovery/sitemap.xml | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| discovery/llms.txt | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| discovery/robots.txt | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| discovery/llms-full.txt | Every eliavatravel.com URL is a confirmed indexable path | PASS |  |
| assets | /assets/eliava-logo.png exists in deployed source | PASS |  |
| assets | /assets/share.png exists in deployed source | PASS |  |
| discovery/sitemap.xml | XSD valid (sitemaps.org 0.9, xmllint) | PASS | /home/user/eliavatravel-site/geo-package/discovery/sitemap.xml validates |
| discovery/sitemap.xml | Lists exactly the confirmed indexable paths | PASS | 10 URLs; missing=[] extra=[] |
| discovery/sitemap.xml | Excluded crawled paths | WARN | / (noindex), /fix/next/ (noindex), /samples/ (redirects to /services/) |
| discovery/robots.txt | Parses; all indexable paths allowed for search and AI crawlers | PASS |  |
| discovery/robots.txt | Declares sitemap | PASS | ['https://eliavatravel.com/sitemap.xml'] |
| discovery/llms.txt | llmstxt.org shape: H1 first, then blockquote summary | PASS |  |
| discovery/llms.txt | Has H2 sections | PASS |  |
| discovery/llms-full.txt | llmstxt.org shape: H1 first, then blockquote summary | PASS |  |
| discovery/llms-full.txt | Has H2 sections | PASS |  |
| discovery/llms.txt | Section entries are markdown link lists | PASS | 11 links |
| evidence | Claim supported: Legal name Eliava Consulting, LLC | PASS | /terms/: "Eliava Consulting, LLC is a Georgia limited liability company" |
| evidence | Claim supported: DBA Eliava Travel Ops | PASS | /terms/: "does business as Eliava Travel Ops" |
| evidence | Claim supported: Does not sell travel | PASS | /terms/: "We do not sell travel." |
| evidence | Claim supported: Never takes or holds client payments | PASS | /terms/: "We never take or hold your clients' payments." |
| evidence | Claim supported: No marketing, websites or travel sales | PASS | /get-started/: "We also don't do marketing, websites or travel sales." |
| evidence | Claim supported: Serves travel advisors and travel agencies | PASS | /privacy/: "behind-the-scenes help for travel advisors and travel agencies" |
| evidence | Claim supported: Footer description | PASS | /services/: "Client emails, payment reminders, documents and deadlines, done on time inside your tools." |
| evidence | Claim supported: Based in Georgia, US business hours | PASS | /services/: "Based in Georgia, on US business hours." |
| evidence | Claim supported: 15+ years ops, 4+ years luxury agencies | PASS | /services/: "15+ years in operations and 4+ years inside luxury agencies." |
| evidence | Claim supported: Certifications | PASS | /services/: "Travefy Advanced Certified and Tern Workflows & Automations Certified." |
| evidence | Claim supported: NDA + E&O insurance | PASS | /services/: "Eliava signs your NDA and carries E&O insurance." |
| evidence | Claim supported: Contact email hello@ | PASS | /services/: "hello@eliavatravel.com" |
| evidence | Claim supported: Legal email legal@ | PASS | /privacy/: "legal@eliavatravel.com" |
| evidence | Claim supported: Free 25-minute call on Zoom | PASS | /services/: "It's free and takes 25 minutes on Zoom." |
| evidence | Claim supported: No hourly billing | PASS | /services/: "No hourly billing." |
| evidence | Claim supported: Nothing reaches a client without OK | PASS | /working-agreement/: "Nothing reaches a client without your OK." |
| evidence | Claim supported: Host login never needed | PASS | /working-agreement/: "Your host login is never needed." |
| evidence | Claim supported: Automation plan $295 | PASS | /services/automation-plan/: "$295 · 2 weeks to your plan" |
| evidence | Claim supported: Setup from $1,175, 3 weeks | PASS | /services/setup/: "From $1,175 for one kind of trip · 3 weeks to live" |
| evidence | Claim supported: Setup 14 days of questions | PASS | /services/setup/: "14 days of questions answered" |
| evidence | Claim supported: Backlog from $495, 2 weeks | PASS | /services/backlog-catch-up/: "From $495 · 2 weeks start to done" |
| evidence | Claim supported: Hand-off kit from $495 | PASS | /services/hand-off-kit/: "From $495 for one kind of trip · 2 weeks to hand-off" |
| evidence | Claim supported: Weekly help $990 / $1,100 | PASS | /services/weekly-help/: "$990 a month, quarter plan · $1,100 month to month · Month 1 no commitment" |
| evidence | Claim supported: Weekly: routine tasks in 2 business days | PASS | /services/weekly-help/: "Routine tasks are done within 2 business days." |
| evidence | Claim supported: Embedded $1,980 / $2,200 | PASS | /services/weekly-help/: "It's $1,980 a month on the quarter plan, or $2,200 month to month." |
| evidence | Claim supported: One Embedded client at a time | PASS | /services/weekly-help/: "We take one Embedded client at a time." |
| evidence | Claim supported: $110 off month 2 | PASS | /services/: "$110 comes off month 2" |
| evidence | Claim supported: Private library from $1,495 | PASS | /services/: "From $1,495" |
| evidence | Claim supported: Untangle one thing $95 | PASS | /services/: "Untangle one thing, together" |
| evidence | Claim supported: AI setup with Claude | PASS | /services/: "We set up Claude with your voice, your steps and your templates." |
| evidence | Claim supported: Team training 4+ people | PASS | /services/: "4 or more people" |
| evidence | Claim supported: $295 credited toward setup within 30 days | PASS | /services/automation-plan/: "Book a setup within 30 days and the $295 comes off the price." |
| evidence | Claim supported: Tool list | PASS | /get-started/: "VacationCRM" |
| evidence | Claim supported: Wave season Oct-Jan | PASS | /get-started/: "October to January is coming" |
| evidence | Claim supported: Established advisors 3-10+ years | PASS | /get-started/: "Three to ten-plus years in, luxury or high-touch, solo or a small agency." |
| evidence | Claim supported: Refund before work begins | PASS | /terms/: "Before work begins, you can get a refund of any deposit or prepayment." |
| evidence | Claim supported: Georgia law | PASS | /terms/: "These terms are governed by the laws of the State of Georgia." |
| evidence | Claim supported: No analytics, ads or tracking cookies | PASS | /privacy/: "This site has no analytics, no ads and no tracking cookies of our own." |
| evidence | Claim supported: Stripe payments | PASS | /terms/: "Payments are processed by Stripe." |
| evidence | Claim supported: cal.com booking link | PASS | /get-started/: "href=https://cal.com/kady-dennis/discovery-call" |
| evidence | Claim supported: AI tools: person reviews; no card/passport numbers | PASS | /terms/: "We never put card numbers or passport numbers into AI tools" |
| unpublished | /robots.txt not present at site root | PASS |  |
| unpublished | /sitemap.xml not present at site root | PASS |  |
| unpublished | /llms.txt not present at site root | PASS |  |
| unpublished | /llms-full.txt not present at site root | PASS |  |
| unpublished | No JSON-LD or noscript added to any live page | PASS |  |
| unpublished | origin/main (deployed branch) contains no geo-package files | PASS |  |

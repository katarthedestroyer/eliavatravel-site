# Direct-answer openings (draft, for approval)

AI answer engines and featured snippets lift the first plain sentence that answers "what is this / who is it for / what does it cost". Today the only sentence on the home page is "Excuse our dust.", and the H1s on the other pages are slogans ("Clear prices for every stage of your business."). Each proposal below puts a factual 40–60 word answer straight after the H1. Every claim in them is already on the live source site. The evidence is in `../evidence-ledger.md`.

Nothing here has been applied to the site.

---

## 1. Home page `/`: two options

The home page is the "Excuse our dust" placeholder. It has `noindex` and **no links to any other page**, so a crawler that starts at the home page finds nothing else (see `../confirmed-paths.md`). Pick one option.

### Option A: keep the placeholder, make it answer and link (recommended while the new build is in progress)

Keep the crane, the H1 and the button. Add this paragraph under the existing `p.prose` and the links row under it. Then remove `<meta name="robots" content="noindex">` so the home page can rank for the brand name.

```html
<p class="prose">Eliava Travel Ops does the back-office work for travel advisors: client emails, payment reminders, documents and deadlines, done on time inside your own Tern, TravelJoy or Travefy. We never sell travel or contact your clients without your OK. Based in Georgia, on US business hours.</p>
<p class="prose"><a href="/services/">Services and prices</a> · <a href="/get-started/">Book a free 25-minute call</a> · <a href="/working-agreement/">How we work</a></p>
```

Word count of the answer paragraph: 47.

### Option B: keep the page hidden until the new site ships

Leave the `noindex` as it is. Then the sitemap draft stays as it is (home excluded), and the brand query will keep pointing at inner pages or nothing. If you pick B, at least add the links row from Option A. That way crawlers and AI systems that land on `/` can still reach the 10 indexable pages.

### For the rebuilt home page (when it ships)

Use this as the first paragraph under the H1:

> Eliava Travel Ops handles the behind-the-scenes work for travel advisors and small agencies. Payment dates, documents and client emails go out on time, in your voice, from your own Tern, TravelJoy or Travefy. You see the plan and price in writing before you pay, and nothing reaches a client without your OK.

(54 words. It reuses the backed-up home hero copy from the `live-site-backup-2026-10-15` tag, trimmed to facts.)

---

## 2. `/services/`

Current H1: "Clear prices for every stage of your business." Insert before the existing sub-line ("Answer 3 quick questions…"):

```html
<p class="sec-sub">Eliava Travel Ops has fixed-price packages for travel advisors: an Automation plan ($295), a Tern, TravelJoy or Travefy setup (from $1,175), a Backlog catch-up (from $495), an Assistant hand-off kit (from $495), and Weekly back-office help ($990 a month on the quarter plan). No hourly billing. You see the price before you pay.</p>
```

(55 words.) The meta description already says nearly the same thing, so the page and the snippet will agree.

---

## 3. Package pages: one answer sentence each

These pages already open well (price, timing and spots in the hero line). Optional: add one "what it is" sentence so that an extracted answer names the brand. Proposed lead sentences:

| Page | Proposed first sentence after the H1 |
|---|---|
| `/services/automation-plan/` | The Eliava Automation plan maps one kind of trip in full, shows what to automate in your Tern, TravelJoy or Travefy and what to keep by hand, and comes with video walkthroughs, for $295 in 2 weeks. |
| `/services/setup/` | Eliava sets up your Tern, TravelJoy or Travefy for one kind of trip, with client emails in your voice, every payment date and deadline, and checklists, live in about 3 weeks, from $1,175. |
| `/services/backlog-catch-up/` | Eliava's Backlog catch-up clears a fixed, agreed list of overdue work inside your Tern, TravelJoy or Travefy in two weeks, from $495. |
| `/services/weekly-help/` | Eliava's Weekly back-office help covers new inquiries, payments, documents and welcome-home emails every week inside your own tools, for $990 a month on the quarter plan or $1,100 month to month. |
| `/services/hand-off-kit/` | Eliava's Assistant hand-off kit writes down one kind of trip as plain steps, gathers your templates and supplier notes, and trains your new hire in two live sessions, from $495. |

---

## 4. Copy fixes found during the audit (needed for the answers to hold up)

- **Broken anchors on every page.** The nav links "How it works" (`/#start`), "About" (`/#about`) and the services FAQ link "1-minute check" (`/#quiz`) all point to sections that the placeholder home page no longer has. Proposal: point "How it works" to `/working-agreement/`. Hide "About" until the new home ships. Change the FAQ answer to "Answer the 3 quick questions at the top of this page." and link it to `/services/`.
- **"Untangle one thing" vs "Single Fix".** `/services/` sells "Untangle one thing, together, $95", and the noindexed thank-you page `/fix/next/` calls it "Single Fix". Pick one name so AI systems don't treat them as two products. The schema drafts use "Untangle one thing, together", the name on the indexable page.

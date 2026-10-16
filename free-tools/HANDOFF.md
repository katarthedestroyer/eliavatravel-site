# Handoff: Operating Map landing page

**For:** the design session building the Eliava site template.
**From:** the session that built the free skill and a working reference page.
**Branch:** `claude/compassionate-allen-calyg5` on `katarthedestroyer/eliavatravel-site`.
**Internal file.** GitHub Pages serves every file in `main`, so delete this file before merging (or do not carry it into the template).

## Your job in one paragraph

Restyle `/free-tools/` (the opt-in landing page) and `/free-tools/get/` (the download page) into the real site template. Keep the copy, the page order, and everything in "How the form must work" below. The reference pages on this branch already work end to end. Treat them as the spec for behavior, not for visual design. The structure follows Nate Herk's Scrollcraft opt-in page (screenshots described in section 3).

---

## 1. What exists

| Path | What it is | Touch it? |
|---|---|---|
| `free-tools/index.html` | Landing page: hero with email form, then why, what you keep, how it works, fit, FAQ, final CTA | Restyle. Keep copy, order, and the `<script>` block |
| `free-tools/get/index.html` | Download page the form opens (noindex): downloads, install steps, starter prompts | Restyle. Keep copy and the copy-button script |
| `assets/free-tools.css` | Styles for both pages, using the placeholder home's tokens (black, Inter + mono, square buttons) | Replace with template styles |
| `assets/site.js` | Shared site JS. Defines `eliavaSend()` and `APPLY_ENDPOINT`, which the landing form uses | Keep loaded on the landing page |
| `free-tools/travel-operating-map/` | The skill source (SKILL.md + references/) | Do not edit as part of design work |
| `free-tools/travel-operating-map.zip` | The skill download. Folder at zip root, which claude.ai requires | Never edit by hand. Run `sh free-tools/build.sh` |
| `free-tools/travel-operating-map-guide.md` | One-file version for Claude without Skills | Built by `build.sh` |
| `free-tools/build.sh` | Rebuilds the zip and guide from the skill folder | Run after any skill edit |
| `index.html` (home placeholder) | Footer line links to `/free-tools/` | Keep a link from the real home footer: column "FREE", link "Operating Map" |

URLs that must keep working (emails and social posts will link to them):
- `https://eliavatravel.com/free-tools/`
- `https://eliavatravel.com/free-tools/get/`
- `https://eliavatravel.com/free-tools/travel-operating-map.zip`
- `https://eliavatravel.com/free-tools/travel-operating-map-guide.md`

---

## 2. Page flow

1. Visitor lands on `/free-tools/`, reads the hero, enters an email.
2. On submit: the lead is saved (section 5), then the browser goes to `/free-tools/get/`.
3. `/free-tools/get/` shows the downloads and setup steps at once. When Kit is connected it also says a copy of the link is on its way, and Kit's incentive email links back to the same page.
4. Returning visitors on `/free-tools/` see "Signed up before? Go to your download."

The gate is soft on purpose: the files have public URLs. That is normal for this kind of giveaway.

---

## 3. The pattern we are matching (Nate Herk's Scrollcraft opt-in)

From Kady's screenshots of `app.aiautomationsociety.ai/optin/scrollcraft/` (above the fold only). Light theme there. Ours stays in the Eliava dark system.

| His page | Ours |
|---|---|
| Logo and wordmark top left | Eliava / Travel Ops lockup |
| Two columns. Left: copy, then form. Right: a framed screenshot of what the skill makes, with a caption under it | Same. Right column is a framed page from a sample Operating Map, with a caption |
| Eyebrow naming the reader's problem: "For When Your AI-Built Website Looks Like Everyone Else's" | "For when the work moves but the checking stays with you" |
| H1 starting "Yours Free:", with the outcome phrase in an accent color | "Yours free: the Claude skill that shows where your agency **still runs through you.**" The bold phrase is the accent |
| Subhead naming the product and the person: "Get Scrollcraft, Nate Herk's free AI design skill..." | "Get the Operating Map, my free skill for Claude..." |
| Bold compatibility line: "Works with Claude Code and Codex." | "Works in the Claude app and Claude Code." |
| White card, one field only (Email *, mail icon, placeholder), full-width button "Send Me the Free Skill" | Same: one field, full-width button "Send me the free skill" |
| "No spam. Unsubscribe anytime." under the card | Same, plus one line of consent about the occasional note |
| Divider, then a row: FORMAT Downloadable skill / PRICE $0 / DELIVERY Download link by email | FORMAT Claude skill / TIME 20-minute snapshot / PRICE $0 / DELIVERY Instant download |

On phones the order is: eyebrow, headline, subhead, compatibility line, form, then the visual. The email field and button must show on the first screen of a 375 x 812 phone.

---

## 4. Copy deck: landing page `/free-tools/`

Voice rules apply (section 8). Copy here is final unless Kady changes it.

### SEO
- Title: `The Operating Map | Free Claude skill for travel advisors | Eliava Travel Ops`
- Description: `A free Claude skill for travel advisors. Map how your agency really runs and where each piece of work belongs: with you, your team, your tools and AI, or a check.`
- Canonical: `https://eliavatravel.com/free-tools/`

### Hero, left column
- Eyebrow: **For when the work moves but the checking stays with you**
- H1: **Yours free: the Claude skill that shows where your agency still runs through you.** (accent on "still runs through you.")
- Subhead: **Get the Operating Map, my free skill for Claude. It walks you through how your agency really runs. Then it writes down what stays with you, what moves to your VA, and what your tools and AI should own.**
- Compatibility line (bold): **Works in the Claude app and Claude Code.**

Alternative headline in the brand's thin/bold uppercase style, if the template needs a short one: thin "The operating", bold "map.", with the lede "See where your business still runs through you." Use the alternative only if the long headline cannot fit above the form.

### Form card
- Field label: **Email** (required, marked *). Placeholder: `you@youragency.com`
- Button: **Send me the free skill**
- Error: **Please enter a valid email address.**
- Fine print: **No spam. Unsubscribe anytime. I will also send an occasional note on running a travel back office.** plus a **Privacy** link to `/privacy/`
- Returning visitor line (hidden until a previous sign-up on this browser): **Signed up before? Go to your download** (links to `/free-tools/get/`)
- Meta row: **Format** Claude skill / **Time** 20-minute snapshot / **Price** $0 / **Delivery** Instant download. Once Kit is live, change Delivery to "Instant download, plus email".

### Hero, right column (visual)
A framed "document page" from a sample map. Not a real client.
- Frame label: **From a sample operating map**
- Section label: **05 / Who owns what**
- Rows (task, then an owner tag):
  - Check confirmations against the proposal | Team
  - Client payment reminders | Tools + AI
  - Supplier follow-ups | Team
  - First drafts of routine client emails | Tools + AI
  - Recommendations and client problems | Advisor
- Caption: **Your trips. Your rules. Written down.**

### 01 / Why
- Heading: thin **The work moves.** bold **The checking stays.**
- Body: **Most advisors are not short on tools or help. The VA finishes the task, and you check it. AI drafts the email, and you rewrite it. The CRM sends the reminder, and you make sure it went.**
- Body: **This skill helps you decide where each piece of work belongs, so less of it comes back to you. It maps your agency, not a generic one.**

### 02 / What you keep
- Heading: thin **One document.** bold **Your operating map.**
- Four cards (kicker, title, line). These mirror the homepage handoff pages:
  1. 01 / Ownership. **Who owns what.** What stays with you, what moves to your team, and what your tools and AI should own.
  2. 02 / Workflows. **Trigger to done.** Your trip from first inquiry to welcome home, with the dates and triggers that move it.
  3. 03 / Checks. **What gets checked.** What "done" really means, what needs review, and where problems go.
  4. 04 / Written down. **Out of your head.** The rules you carry in your memory, written so someone else can follow them.
- Note: **Plus three changes to make in the next 30 days.**

### 03 / How it works
- Heading: thin **Answer questions.** bold **Claude builds the map.**
- Three numbered steps:
  1. **Get the skill.** Enter your email at the top. The download page opens right away.
  2. **Add it to Claude.** Upload one file in Claude's settings. It takes a few minutes, and the steps are on the download page.
  3. **Say "Start my operating map."** Claude asks short questions, drafts each part, and you correct it. You never start from a blank page.
- Three ways to use it (cards):
  - **Quick snapshot.** About 20 minutes. Five questions and a one-page view of what still reaches you and where it should go.
  - **Full map.** Ten steps. One sitting of about two hours, or one step a day for two weeks. Save it and pick up where you left off.
  - **One piece.** Any single step. Jump straight to what you need, like escalation rules for your VA.
- The ten steps (two lists):
  - Part 1 / How the work moves now: 01 **Trip lifecycle.** Where a trip really begins and ends. 02 **What you remember.** The rules that live in your head. 03 **What done means.** Completed is not the same as correct. 04 **Where you are needed.** Not everything needs your review. 05 **Who owns what.** Today's owner and the right one.
  - Part 2 / Rules that let work leave your desk: 06 **Timing rules.** Trigger, action, owner, deadline. 07 **Escalation rules.** Instead of "ask me if you are unsure." 08 **Tools and AI.** Use what you already pay for. 09 **What gets checked.** Stop reviewing everything the same way. 10 **Stop, fix, protect.** Three changes for the next 30 days.

### 04 / Who it is for
- Heading: thin **Built for** bold **travel advisors.**
- Good fit: You have good tools or help, but too much still comes back to you. / You have a VA, or plan to hire one, and want clear rules for what they own. / You want to use the tools you already pay for before buying more.
- Not a fit: You want a general business course. / You want Claude to log into your tools and do the work. / You want to put client details into AI.

### 05 / Questions (accordion)
- **Is it really free?** Yes. The skill is free. You need a Claude account to use it.
- **Do I need to be technical?** No. Setup takes a few minutes and the steps are written out. After that, you answer questions and Claude does the writing.
- **Does it work with Tern, TravelJoy, or Travefy?** Yes, and with any other setup, even a spreadsheet. It asks what your tools do today. It never logs into them.
- **What happens to my answers?** The skill runs inside your own Claude account. Nothing is sent to me. Leave out client names, passport numbers, and card details. Describe the work, not the people.
- **What if I do not have the Skills option in Claude?** The download page also has a one-file version. Attach it to any Claude chat or Project and it works the same way.
- **Why do you ask for my email?** So I can send you the link and let you know when the skill gets better. You will also get an occasional note on running a travel back office. Unsubscribe anytime.
- **Can I share it?** Yes. Share it with anyone, with credit to Eliava Travel Ops. Please do not resell it.

### Final CTA
- Heading: thin **Your clients need your judgment.** bold **Your back office shouldn't need all of it.** (from the homepage final CTA)
- Line: **Start with the map. See what still runs through you.**
- Button: **Get the skill free**. Scrolls to the form and puts the cursor in the email field.
- Quiet line: **Already know you want help? Tell me what's stuck** (mailto `hello@eliavatravel.com`, subject "What's stuck", until the intake page is live, then link the intake page)

### Footer
Same as the rest of the site: Client billing portal link, Privacy, Terms, Eliava Consulting, LLC.

---

## 5. Copy deck: download page `/free-tools/get/`

- `<meta name="robots" content="noindex">`
- Kicker: **You are in**. H1: thin **Your skill is** bold **ready.**
- Lede: **The Operating Map, a free skill for Claude.**
- Body: **Download it, add it to Claude, and say "Start my operating map." Setup takes a few minutes. Bookmark this page in case you need it again.**
- Only when the URL has `?sent=1`: **A copy of this link is on its way to your inbox.**
- Primary button: **Download the skill** (`/free-tools/travel-operating-map.zip`, `download` attribute). Secondary text link: **How to install it** (jumps to install).
- **01 / Install.** Heading thin **Set it up once.** bold **Use it anytime.** Three blocks:
  - **In the Claude app, on the web or desktop:** 1. **Download the skill.** Keep it as a .zip file. You do not need to open it. 2. In Claude, open **Settings** and check that **Code execution and file creation** is turned on. On a Team or Enterprise plan, your admin controls this. 3. Go to **Customize**, then **Skills**. Click **+**, choose **Create skill**, then **Upload a skill**, and pick the zip. 4. Turn the skill on. 5. Start a new chat and type: `Start my operating map.` (copy button). Tip box: **On a Mac, did the download turn into a folder? Right-click the folder, choose Compress, and upload the new .zip. Menu names in Claude change from time to time. If yours look different, see Claude's help page on skills** (link: `https://support.claude.com/en/articles/12512180-using-skills-in-claude`).
  - **In Claude Code:** 1. Download the skill, then run this in the folder where you saved it: `mkdir -p ~/.claude/skills && unzip travel-operating-map.zip -d ~/.claude/skills` (copy button, scrolls sideways, never wraps). 2. Type **/travel-operating-map**, or just say "Start my operating map."
  - **No Skills option? Use the one-file guide.** 1. Download the guide. It is the same skill in one file. 2. Start a new chat or Project in Claude and attach the file. 3. Type: `Follow this guide and start my operating map.` (copy button). Button: **Download the guide** (`/free-tools/travel-operating-map-guide.md`, `download` attribute).
- **02 / Try it.** Heading thin **Three ways** bold **to start.** Line: **Type any of these in a new chat once the skill is on.** Three copyable prompts: `Start my operating map.` / `Give me a quick operating map snapshot.` / `Help me write escalation rules for my VA.` Tip box: **Leave out client names, passport numbers, and card details. Describe the work, not the people. If you stop halfway, Claude gives you the map so far. Next time, attach it and say "pick up where I left off."**
- Closing CTA: same heading as the landing page. Line: **If the map shows more than you want to build and keep up yourself, tell me what's stuck. I read every message myself.** Button: **Tell me what's stuck** (mailto as above).

Install steps were checked against Claude's Help Center on 2026-10-16: custom skill upload is under Customize > Skills, needs code execution on, and the zip must contain the skill folder at its root. Re-check if Claude's menus change.

---

## 6. How the form must work

Copy the `<script>` block at the bottom of `free-tools/index.html`. In short:

- **Fields:** `email` (required) and a hidden honeypot `website`. Keep the honeypot off-screen, `tabindex="-1"`, `aria-hidden`, and `autocomplete="off"`. If it has a value, skip saving but still redirect, so bots learn nothing.
- **Validation:** client-side, `^[^\s@]+@[^\s@]+\.[^\s@]+$`. On failure: show the error (`role="alert"`), set `aria-invalid="true"` on the input, focus it. Clear the error on input.
- **Save, without waiting:**
  1. `eliavaSend([['type','free-tool'], ['door','Operating Map skill'], ['email', ...], ['source', ...], ['page', location.pathname]])`. This comes from `assets/site.js` and posts to the Google Apps Script (`APPLY_ENDPOINT`) by `sendBeacon`, the same path the Get started form uses. `source` holds `utm_source`, `utm_medium`, `utm_campaign`, `ref`, and an outside referrer, when present.
  2. If `KIT_FORM_ID` is set: POST `email_address` to `https://app.kit.com/forms/{KIT_FORM_ID}/subscriptions` with `fetch(..., { mode: 'no-cors', keepalive: true })`.
- **Then redirect** to `/free-tools/get/`, adding `?sent=1` only when the Kit post was made. Never block the redirect on a network response.
- **Remember the visitor:** `localStorage['eliava-operating-map'] = '1'` (wrapped in try/catch) shows the "Signed up before?" line next time.
- **Disable the button** on submit to stop double posts.
- **"Get the skill free"** at the bottom links to `#get` and focuses the email field after the scroll.
- **Download page copy buttons:** `navigator.clipboard.writeText`, with a hidden-textarea fallback. The label changes to "Copied" for 1.6 seconds.

If the template has its own form component, wire it to the same calls. Do not invent a new endpoint.

---

## 7. Usability and accessibility checklist

Check each of these before calling it done.

**Above the fold**
- [ ] On a 375 x 812 phone, the email field and the button are visible without scrolling.
- [ ] On a 1280 x 800 laptop, the headline, the form, and the visual are all visible.
- [ ] Phone order: eyebrow, headline, subhead, compatibility line, form, then the visual.

**Form**
- [ ] Input text is at least 16px, so iPhones do not zoom in on focus.
- [ ] The field has a visible label, not just a placeholder.
- [ ] The button and field are at least 48px tall and the button is full width in the card.
- [ ] `type="email"`, `inputmode="email"`, `autocomplete="email"` on the input.
- [ ] Error text is announced (`role="alert"`) and the field shows an error state.
- [ ] Enter submits. Tab order: email, button, Privacy link.
- [ ] The honeypot is unreachable by keyboard and screen readers.

**General**
- [ ] No sideways scrolling at 375px on either page. Only the Claude Code command box may scroll inside itself.
- [ ] Visible focus on every link, button, field, and accordion.
- [ ] Text contrast meets WCAG AA. Watch secondary text on the dark background.
- [ ] Respect `prefers-reduced-motion`: no drifting background or wipe animations.
- [ ] FAQ uses `<details>`/`<summary>`, or an equivalent with keyboard and screen reader support.
- [ ] The visual is decorative and labeled "sample." It must not read as a real client's data.
- [ ] The download page has `noindex`. The landing page does not.

**Downloads**
- [ ] The zip downloads as `travel-operating-map.zip` (the `download` attribute) in Chrome and Safari.
- [ ] The guide downloads as a file (`download` attribute). Browsers may not display .md files.
- [ ] Every copy button copies the exact text (check the `&&` in the Claude Code command).

---

## 8. Voice rules for any copy you touch

From Kady's copy briefs:
- First person "I" for Kady. The visitor is "you." Never "we" or "our team."
- Plain English, grade 6 to 7. Short sentences.
- No em dashes. No emojis. No exclamation points.
- No hype: not "streamline, optimize, seamless, leverage, unlock, elevate, next level, tailored solutions."
- Do not invent numbers, quotes, testimonials, or client names.
- Buttons name their action ("Send me the free skill," "Download the skill").

---

## 9. Setup outside the code (Kady)

1. **Kit (for the emailed link and the list):** create a form in Kit for the Operating Map. Turn on its incentive email and set the link to `https://eliavatravel.com/free-tools/get/`. Put the form's number in `KIT_FORM_ID` in the landing page script. Then change the meta row's Delivery to "Instant download, plus email."
2. **Google Apps Script:** sign-ups arrive as `type=free-tool`, `door=Operating Map skill`. Make sure the script records that type, and decide whether you want an email for every sign-up.
3. **Home footer:** link "Operating Map" under FREE to `/free-tools/`.
4. **Intake page:** when it is live, point "Tell me what's stuck" there instead of the mailto.

---

## 10. Open decisions

- Long headline (recommended, matches the pattern) or the short brand headline.
- Email-only delivery (like Nate's, which forces a real address) or an instant download (current). Current choice: instant download, plus email once Kit is connected.
- Whether the "occasional note" promise stays. It is only honest once those notes actually go out.

---

## 11. Testing without sending real sign-ups

Serve the repo root locally (for example `python3 -m http.server 8765`). In Playwright, stub `navigator.sendBeacon` and `window.fetch` with `context.addInitScript`, and block `script.google.com` and `app.kit.com` with `context.route`, so no test lead reaches Kady's sheet or list. Then check: an invalid email shows the error, a valid email lands on `/free-tools/get/`, the beacon goes to `APPLY_ENDPOINT`, and the "Signed up before?" line shows on a return visit. Repeat at 1280 x 900 and 375 x 812.

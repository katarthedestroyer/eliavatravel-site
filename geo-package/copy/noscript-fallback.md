# Noscript fallback proposal (draft, for approval)

## What crawlers see without JavaScript (tested 2026-10-16)

I loaded every page in headless Chromium twice, once with JavaScript on and once with it off, and compared the visible text. Full data: `../crawl/crawl.json`.

| Page | Text with JS | Text without JS | What's lost without JS |
|---|---|---|---|
| `/services/` | 4,344 chars | 3,999 chars | The 3-question finder (`#finder`, `hidden` until `finder.js` runs). All packages, prices and the FAQ still show. |
| `/get-started/` | 3,314 | 3,314 | Nothing hidden, but the application form has no `action`, so without JS **submitting it sends nothing**. |
| All other pages | same | same | Nothing. The content is server-rendered HTML. |

The site already uses progressive enhancement well: the content is in the HTML, and JavaScript only adds interaction. Most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) don't run JavaScript. They can already read every package, price and FAQ. The fallbacks below cover the two interactive gaps.

## 1. `/get-started/`: the application form (priority)

Add this right after `<form class="step" id="apply-form" novalidate>` opens. Better still, add it just before the form, so it shows above the fields:

```html
<noscript>
  <div class="gs-noscript" role="note">
    <p><strong>This form needs JavaScript to send.</strong> You can still book your free 25-minute call:</p>
    <p><a href="https://cal.com/kady-dennis/discovery-call">Pick a time on our calendar</a> or email <a href="mailto:hello@eliavatravel.com">hello@eliavatravel.com</a> with your name, your tools and what's slipping.</p>
  </div>
</noscript>
```

Both links already appear on the page (the calendar fallback link and the footer email), so this adds no new destinations.

## 2. `/services/`: the 3-question finder

Add this where the finder sits (just before `<div class="fd" id="finder" hidden>`):

```html
<noscript>
  <p class="sec-sub">The 3-question check needs JavaScript. Every package and price is listed below. Or <a href="/get-started/">book a free call</a> and we'll help you choose.</p>
</noscript>
```

## 3. Home page

The current placeholder uses no JavaScript, so it needs no fallback. When the rebuilt home page brings back the 8-question "What would slip" quiz (from `live-site-backup-2026-10-15`), put the same kind of `<noscript>` note before it. The note should point to `/services/` and `/get-started/`.

## Not proposed

- No noscript copies of page content. The content is already in the HTML, so a copy would be duplicate text.
- No `<noscript>` tracking pixels. The privacy policy says the site has no analytics.

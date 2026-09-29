# Build brief 2: roadmap wave (2026-09-28)

Read in this order before writing anything: docs/CONCEPT.md, docs/BUILD-BRIEF.md (still binding: honesty rails, voice, page skeleton, design system classes, verification), docs/SCROLL-SCORE.md (the kit), docs/ROADMAP.md, docs/research-seo-gaps.md, docs/research-timeline.md. Then open three finished pages in a text editor to copy their patterns exactly: index.html, intel/species/index.html (a category hub), intel/roswell-ufo-incident-explained/index.html (an article).

Site root: C:\Users\bfauc\Desktop\Kootenay Made Digital\Disclosure App\disclosure-landing. Static HTML on Vercel with serverless functions in api/. A local server may or may not be running on 127.0.0.1:5177; if `curl http://127.0.0.1:5177/` fails, start your own with `py -m http.server 5180 --bind 127.0.0.1` from the site root in the background and use that port.

## What changed since BUILD-BRIEF.md

- The page skeleton now links these stylesheets, in this order, and every page must: `/assets/dx/dx.css?v=5`, `/assets/dx/kit.css?v=5`, `/assets/dx/chrome.css?v=5`, then any family CSS. Script `/assets/dx/dx.js?v=5` (defer). `node scripts/dx-chrome.mjs` injects kit.css and chrome.css if missing, stamps header and footer, adds the control strip under the page header, so run it after writing pages.
- Section h2s declassify on scroll automatically (dx.js). Nothing to do.
- The ask band at the end of each page becomes the eye closer automatically (kit.css). Use the ask markup from BUILD-BRIEF.md.
- `.file-index.file-cards` with `<span class="fc-img"><img ...></span>` first inside each `<a>` renders photo cards (see intel/species/index.html).
- The exhibit (paper interlude): `<section class="exhibit">` markup as in first-contact/index.html. Optional, one per page at most.
- Paper artifacts: `.paper`, `.paper-head`, `.stamp`, `.rx` redactions (BUILD-BRIEF.md).

## Hard rules for this wave

1. **Touch only the files and folders you own** (listed in your dispatch). Never edit: index.html, intel/index.html, any existing intel article, docs/partials/*, scripts/dx-chrome.mjs, scripts/dx-data.mjs, scripts/dx-categories.mjs, vercel.json, sitemap.xml, llms.txt, assets/dx/dx.css, dx.js, kit.css, chrome.css, classify.*. The chair integrates navigation, hub listings, inbound links, sitemap and CSP after you report.
2. **Never run git.**
3. **Every factual claim is sourced.** Primary sources first (congress.gov, govinfo.gov, archives.gov, aaro.mil, war.gov, nasa.gov, dni.gov, canada.ca / science.gc.ca, official agency pages, peer-reviewed papers, contemporaneous major-press reporting). Wikipedia only to find primary sources. Load WebSearch and WebFetch via ToolSearch ("select:WebSearch,WebFetch"). When you can only partly verify something, the page says so in plain words. Never invent a date, number, quote, name or source. Claims by witnesses and whistleblowers are stated as claims ("says", "testified that", "reported"), never as fact. Official findings are stated as findings.
4. **No em dashes, en dashes as dashes, or spaced hyphens as dashes. No accent words in headings. No invented statistics.** US spelling. Titles under 60 characters including " | DISCLOSURE"; meta descriptions 140 to 160 characters.
5. **One ask per page**: Find your role (`/#classify`), plus at most one secondary link.
6. **Accessibility**: WCAG 2.2 AA. Every form control has a visible label. Every interactive tool works with keyboard alone, announces results in an aria-live region, and works at 320px wide. Tap targets 44px for primary controls, 24px minimum for everything. Reduced motion respected.
7. **Privacy**: tools never send personal data anywhere. Location stays on the device. No new third-party scripts: vendor any library you need into `assets/vendor/<name>/` (MIT or similar licence, keep its LICENSE file next to it) and load it from there.

## Verification before you report

1. `node scripts/dx-chrome.mjs` then `node scripts/dx-check.mjs`. Your pages must show zero failures. Failures on pages you do not own: report them, do not fix them.
2. Headless screenshots only, never a visible browser: `node "C:\Users\bfauc\AppData\Local\Temp\claude\C--Users-bfauc-Desktop-Kootenay-Made-Digital-Disclosure-App\0a20baa1-7235-417c-ad9e-0acd4893c608\scratchpad\shoot.js" /your/path/ <outprefix> 1440 900 4` and at 390 844 (set env BASE=http://127.0.0.1:5180 if you run your own server). Zero page errors. Look at the PNGs and fix what looks wrong. Outputs go in the scratchpad, never the site. One headless browser at a time; close it when done.
3. For interactive tools, drive them with a playwright-core script (require it from C:\Users\bfauc\AppData\Local\Temp\claude\C--Users-bfauc-Desktop-Kootenay-Made-Digital-Disclosure-App\0a20baa1-7235-417c-ad9e-0acd4893c608\scratchpad\node_modules\playwright-core; launch `{channel:'chrome', headless:true, args:['--headless=new']}`) through at least two real scenarios and assert the output, plus an axe WCAG 2.2 AA run (axe-core is in the same node_modules; see scratchpad/axe2.js for the pattern, include `rules: {'target-size': {enabled: true}}`).

## Report format (the chair integrates from this, so be exact)

A JSON block:

```json
{
  "pages": [
    { "path": "/record/", "title": "...", "h1": "...", "description": "...", "category": "record | tools | cases | intel:<protocol|field-guide|psychology|species|public-record|theory> | glossary",
      "lens": "/path/to/an/existing/image/for/the/header/or null",
      "inboundFrom": [ { "page": "/intel/aaro-explained/", "sentence": "One sentence the chair can add there, containing the anchor text in [brackets]." } ] }
  ],
  "csp": ["any new connect-src or img-src origins you need, with why"],
  "api": ["any api/ functions you created"],
  "needsBoss": ["anything unverified, legal or judgment calls"]
}
```

Then a short plain summary of what each page contains and what you verified.

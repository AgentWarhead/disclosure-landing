# DISCLOSURE overhaul: build brief for every page agent (2026-09-28)

Read first, in order: docs/CONCEPT.md, this file, docs/dissect-sub.md (the old subpages), docs/research-timeline.md (verified facts). Look at the finished homepage (index.html) and the design system (assets/dx/dx.css) before writing a line: every page must look like it belongs to that homepage.

Site root: `C:\Users\bfauc\Desktop\Kootenay Made Digital\Disclosure App\disclosure-landing`. Static HTML, no build step, deployed on Vercel. A local server is already running at http://127.0.0.1:5177 serving the site root.

## Hard rules

1. **Touch only the files you own** (your dispatch lists them). Never edit index.html, assets/dx/dx.css, assets/dx/dx.js, assets/dx/classify.*, assets/dx/home.*, docs/partials/*, scripts/dx-chrome.mjs. If you need page-family CSS, create `assets/dx/<your-family>.css` (you own it) or a small inline `<style>` in your page. Never git (no add, commit, checkout, stash).
2. **Preserve every URL.** Same folders, same slugs. Pages live at `/<path>/index.html`.
3. **No em dashes** (the character U+2014) anywhere, and no en dashes used as dashes. No spaced hyphen " - " used as a dash either. Use commas, colons, periods, parentheses.
4. **No accent word in headlines**: never set one word of an h1/h2/h3 in another colour, face, outline or italic. A headline is one colour and one voice. Zero `<em>`, `<i>`, `<span class=...>` colour tricks inside h1-h3.
5. **Eyebrow restraint**: at most one small label/kicker per three sections. No `// SLASHED //` eyebrows anywhere. No decorative status dots, no rotated vertical text, no fake HUD coordinates, no "LIVE" badges, no scroll cues, no typewriter or scramble-text effects, no cursor trails.
6. **Honesty rails** (these are law):
   - No invented statistics. Delete every archetype percentage ("34% of people", "About 30% carry", "<0.1%", "25% of the population"). The role distribution is not measured, so it is not published.
   - No fake counters ("99+ briefed", "1,180 civilians right now"). No hardcoded "04 Archetypes" / "64 files" status strips.
   - The app is pre-launch and in development for iOS and Android. No store badges, no "available now", no "download now", no Apple or Google Wallet claims.
   - Public record: use only facts in docs/research-timeline.md. There was NO executive order: say "In February 2026 the President said he was directing agencies to release UAP files." The May 8, 2026 release was the Department of War (not the National Archives). The UAP Disclosure Act has NOT become law; a reduced records provision became law in the FY2024 NDAA (Dec 2023), and a fuller amendment passed the House on July 22, 2026.
   - Every official report so far (AARO, NASA) found no evidence of extraterrestrial technology. Never imply the record confirms contact. Treat species, abductions, lore as reports and claims.
   - Only the 12 confirmed app features (listed in .claude/product-marketing-context.md). Never invent features.
   - There are four public roles (Sentinel, Diplomat, Scholar, Survivor) plus a sealed fifth (First Contact) that "is not issued. It appears." Never say "four archetypes" while showing five, never publish how to unlock First Contact.
   - No internal build or SEO language visible to readers ("funnel", "conversion", "SEO", "bridge from", "That is the loop", "intent", "viral loop").
7. **Voice**: the product voice. Calm, plain, eerie. Bureaucratic composure about an impossible thing, never shouting. Short sentences. The reader is a normal person on their phone at night. Insider words (designation, record, released in part) decorate; the words a visitor must act on are plain ("Find your role", "Read the dossier"). Avoid: unlock, elevate, seamless, unleash, empower, game-changer, "not X, but Y" patterns repeated across a list. US spelling (the site's existing convention).
8. **One ask per page**: the primary action everywhere is **Find your role** linking to `/#classify` (label exactly that). A page may have one secondary link (to a dossier, the archive, a related file). No second email form anywhere (the only capture lives in the classification).
9. **Accessibility**: one h1 per page, heading order without skips, every image has meaningful alt (or alt="" if decorative), links say where they go, focus-visible works (the design system handles it), tap targets 44px, text contrast 4.5:1 (use the tokens: --bone, --bone-dim, --bone-faint on void; --toner, --toner-dim on paper). `<details>` for disclosure widgets.

## Page skeleton (copy exactly, fill the blanks)

```html
<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{Title under 60 chars} | DISCLOSURE</title>
<meta name="description" content="{140 to 160 chars, written for a click, primary query in it}">
<link rel="canonical" href="https://www.getdisclosure.app/{path}/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030504">
<meta name="color-scheme" content="dark">
<meta name="dx:control" content="{File XXX-000} &middot; {short page name} &middot; {Released in part | Unclassified | Sealed}">
<meta property="og:type" content="{website | article}">
<meta property="og:site_name" content="DISCLOSURE">
<meta property="og:url" content="https://www.getdisclosure.app/{path}/">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{short}">
<meta property="og:image" content="https://www.getdisclosure.app/{an image that EXISTS on disk}">
<meta property="og:image:alt" content="{alt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@disclosure_app">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300..900&amp;family=Space+Mono:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="/assets/dx/dx.css?v=1">
{optional: <link rel="stylesheet" href="/assets/dx/{family}.css?v=1">}
<script type="application/ld+json">{ BreadcrumbList + the page's main type, host always https://www.getdisclosure.app with trailing slash }</script>
</head>
<body>
<!-- dx:header -->
<!-- /dx:header -->
<main id="main">
  ...
</main>
<!-- dx:footer -->
<!-- /dx:footer -->
<script src="/assets/dx/dx.js?v=1" defer></script>
</body>
</html>
```

After writing your pages, run `node scripts/dx-chrome.mjs` from the site root. It fills the header/footer between the markers (idempotent, safe to run many times) and sets aria-current on the nav.

Canonical host is always `https://www.getdisclosure.app` with a trailing slash on every path. Internal links use root-relative paths with a trailing slash (`/intel/roswell-ufo-incident-explained/`).

## The design system you have (assets/dx/dx.css)

Tokens: `--void-0..4` grounds, `--bone`, `--bone-dim`, `--bone-faint` text, `--signal` (CRT green, use sparingly: under 10% of a viewport), `--paper`, `--toner`, `--toner-dim`, `--stamp` (red, only on paper), role colours `--sentinel --diplomat --scholar --survivor --gold`. Type steps `--step--2 .. --step-6`, spacing `--space-1 .. --space-10`, `--gutter`, `--max`.

Classes:
- Layout: `.wrap`, `.wrap-narrow`, `.section` (section padding + hairline between sections).
- Voices: `.poster`, `.label` (Space Mono small caps label), `.mono`, `.lede`, `.dim`, `.faint`, `.num`, `.h-hero .h-1 .h-2 .h-3`.
- Actions: `.btn` (signal fill), `.btn.btn-ghost`, `.btn.btn-gold`, `.link` (mono underlined text link). Arrow: `<span class="arr" aria-hidden="true">&rarr;</span>`.
- Interior page header: `<header class="page-head"><div class="wrap"> <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li>...</li></ol></nav> <h1>..</h1> <p class="lede">..</p> <div class="actions">..</div></div></header>` (it clears the fixed nav).
- Image header: `.plate` wrapper + `<img class="plate-img">` + `.wrap` content (scrim and treatment built in). Give the plate a min-height (e.g. `style="min-height:min(78vh,720px);display:flex;align-items:flex-end"` or a family CSS rule).
- Paper object (the leaked document, the concept's artifact): `.paper` with `.paper-head` (two spans: file id + page), `.stamp` ("Released in part"), `.exempt` margin code. Paper sits ON the void, never as a page background. Use paper for ONE artifact per page at most (a dossier sheet, a transcript, a record), never for every card.
- Redaction: `<span class="rx">words</span>` shows as a black bar that lifts once scrolled into view (add `data-delay="200"` to stagger). `<span class="rx rx-fixed" aria-hidden="true">WORDS</span><span class="visually-hidden">redacted</span>` never lifts. On the void add `rx-void`. Use one or two per page, not every paragraph.
- Lists: `.ledger` (hairline rows), `.file-index` (rows of files: `<li><a href><span class="no">File 01</span><span class="t">Title<span class="d">desc</span></span><span class="cat">Category</span></a></li>`).
- Prose: `.prose` for long reading (h2, h3, p, ul, ol, blockquote as witness statement, table, figure).
- `.field-note` (a boxed note with a `.label` inside), `.transcript` (FAQ as Q./A. with `<details><summary>Q</summary><div class="a"><div>A</div></div></details>`).
- The ask band (end of every interior page): `<section class="ask"><div class="wrap ask-grid"><div><h2>..</h2></div><div><p>..</p><div class="actions"><a class="btn" href="/#classify">Find your role <span class="arr" aria-hidden="true">&rarr;</span></a> {optional .link}</div></div></div></section>`
- Role colour: `.role-dot` inside an element with `.r-sentinel | .r-diplomat | .r-scholar | .r-survivor | .r-first-contact`.
- Reveal: add `data-reveal` to a block to fade it up once on scroll (optional, sparingly).
- Utilities: `.visually-hidden`.

## Share images (shared contract)

The infrastructure agent generates these 1200x630 JPGs. Reference them by exactly these paths even if they do not exist yet when you write your page:

| Path | Used by |
|---|---|
| /og/home.jpg | home, faq, about, privacy, terms, 404 |
| /og/quiz.jpg | /quiz/ |
| /og/briefing.jpg | /first-contact/ |
| /og/drill.jpg | /readiness/ |
| /og/roles.jpg | /archetypes/ |
| /og/sentinel.jpg, /og/diplomat.jpg, /og/scholar.jpg, /og/survivor.jpg, /og/first-contact.jpg | the five dossiers |
| /og/intel.jpg | /intel/ hub |

Intel articles keep their own existing article image (intel/images/{slug}-1280.webp or whatever their current og:image is, as long as the file exists on disk).

## Verification before you report

1. Headless screenshots only (never a visible browser): `node "C:\Users\bfauc\AppData\Local\Temp\claude\C--Users-bfauc-Desktop-Kootenay-Made-Digital-Disclosure-App\0a20baa1-7235-417c-ad9e-0acd4893c608\scratchpad\shoot.js" /your/path/ <outprefix> 1440 900 4` and again at `390 844`. The script prints page errors; zero is the bar. Look at the PNGs (Read tool) and fix what looks wrong. Put outputs under the scratchpad folder, not the site.
2. Grep your files: zero U+2014, zero " - " as a dash in visible text, zero banned claims (percentages for roles, "99+", "executive order", "Wallet", "available now").
3. Every internal href you wrote resolves to a folder with index.html on disk.
4. Report: files changed, what each page now contains (sections in order), anything you could not verify, anything that needs the boss.

# getdisclosure.app subpage dissection (read-only)

Site root: `C:\Users\bfauc\Desktop\Kootenay Made Digital\Disclosure App\disclosure-landing`
Scope: every `*/index.html` except the root `index.html`. 78 subpages total: 13 top-level/archetype pages, `intel/index.html`, and 64 intel articles.
Hosting: static folders (`about/index.html` etc.). `vercel.json` has NO `cleanUrls`, `trailingSlash` or redirects block, only headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, cache). So `/quiz` and `/quiz/` both resolve; canonical tags are the only dedupe.

Intel article folder count on disk: **64** (`intel/` holds 64 article folders + `images/` + `index.html` + `INTEL_DOCTRINE.md`).

---

## 1. Page families

### Family A: "Teko command" template (7 pages)
Pages: `quiz/`, `first-contact/`, `readiness/`, `faq/`, `about/`, `privacy/`, `terms/`.

Shared template, near-identical markup. Inline CSS is literally identical (same hash) on quiz/readiness/faq/about (8,143 B); privacy/terms share a second block (8,984 B, adds `.legal-copy`, `.legal-list`, `.notice`); first-contact is the bespoke parent of the template (15,565 B, adds console/incident animation, timeline, protocol grid, roles grid, reduced-motion block).

Skeleton (quiz/index.html):
- head: charset, viewport, title, description, keywords (quiz/faq/first-contact only), robots `index, follow, max-image-preview:large`, canonical (apex, no slash), og:title/description/image/url/type, twitter card/title/description/image, Google Fonts preconnect + css2 link.
- CSS linked: `/assets/disclosure-footer.css`, `/assets/disclosure-page-polish.css?v=number-badge-20260516`.
- JS: `/assets/disclosure-page-polish.js` (defer, end of body). No inline JS.
- JSON-LD: quiz `Quiz`, `BreadcrumbList`, `FAQPage`; first-contact `Article`, `BreadcrumbList`, `HowTo`, `FAQPage`; readiness `WebPage`, `FAQPage`; faq `BreadcrumbList`, `FAQPage`; about `Organization`, `FAQPage`; privacy/terms `WebPage`.
- header: `<div class="shell"><nav class="topbar" aria-label="Primary navigation">` with pill logo `<a class="logo" data-label="QUIZ"><img src="/logo-nav.png">` (label via CSS `::after content:attr(data-label)`; first-contact hardcodes `'BRIEFING'` in CSS instead) + `.navlinks` of 2 ghost links and 1 `.primary` "Get classified" to `/#quiz`. Mobile hides the non-primary links.
- main: `section.hero` (kicker, H1 with outlined `<span>` second line, `.lead`, `.answer-box`, `.actions` 2 buttons, `aside.panel` readout grid) then 3 to 6 `section.section` blocks (`.cards` 4-up, `.steps` 3-up, `.faq-grid` 2-up) and one `section.cta`.
- footer: full `ds-footer` (see section 4).

CTAs: every primary CTA goes to `/#quiz` (the homepage quiz). Secondary to `/archetypes`, `/first-contact`, `/readiness`, `/terms`, `/privacy`, or `mailto:team@getdisclosure.app` (privacy/terms hero).

Differences inside the family:
- quiz and faq have NO favicon/apple-touch/manifest links (the other five do).
- first-contact has `theme-color`, the rest do not.
- keywords meta only on quiz, first-contact, faq.
- Nav pairs differ per page (section 4).

### Family B: `archetypes/` hub (1 page, bespoke)
Different design system from Family A despite looking similar: loads Share Tech Mono + Rajdhani, not Teko. Inline CSS 22,769 B plus 5,941 B inline JS (the `archetypes` object and `selectArchetype()` click/keyboard handler that swaps the scanner and dossier panel). JSON-LD `CollectionPage` only. Canonical `https://www.getdisclosure.app/archetypes` (www, unlike the 12 other non-intel pages). Links polish CSS/JS + footer CSS.
Sections: hero with radar "scanner" aside, `#dossiers` 5 `.arch-card` (role=button, tabindex=0) + dossier panel + comparison matrix, `#field-unit` two team panels, `#assessment` CTA. Nav is 4 plain links (Assessment `/#quiz`, Briefing, Readiness, Main Site `/`), no primary pill.

### Family C: `archetype/*` dossiers (5 pages, shared template, older generation)
Pages: `archetype/diplomat`, `first-contact`, `scholar`, `sentinel`, `survivor`.
Same markup skeleton, inline CSS 4,749 to 5,425 B differing mainly by accent colour; restyled on top by `/assets/archetype-dossier.css?v=20260518` (uses `!important` to override body font/background).
- head: title "The Diplomat - De-escalation Lead | DISCLOSURE" pattern (spaced hyphen as dash), description, keywords, canonical (apex, no slash), og tags with `og:image https://getdisclosure.app/og-v2.png` (file does not exist), `twitter:card` only (first-contact also has twitter title/description/image). No robots meta. Favicons incl. 96px + manifest. Fonts: Share Tech Mono + Rajdhani 400;500;700 (no gstatic preconnect).
- CSS linked (after the inline style): footer, polish, archetype-dossier. JS: polish.js.
- JSON-LD: diplomat/sentinel/survivor `Article` (no date, no image); scholar/first-contact `WebPage`.
- header: bare `<nav>` (no class): text logo "DISCLOSURE" to `/` + "← ALL ARCHETYPES" to `/archetypes`.
- main: `div.container` > badge, H1, lead, divider, H2 sections (What is / Characteristics trait-list / Role / Other Archetypes grid of 4 links), `.cta-wrap`, `.faq` (3 Q/A as divs, no FAQPage schema).
- CTA: all five CTAs go to `/` (not `/#quiz`): "TAKE THE ASSESSMENT" x4, "JOIN THE WAITLIST" on first-contact. Copy says "Join the waitlist for early access" and "available through the Disclosure app at launch".
- Differences: survivor adds a 3-up `.stat-row` (incl. "SURVIVAL RATE 97%"); first-contact has bespoke sections (What We Can Tell You / What We Cannot / The Launch Event). Survivor's role is "Self-Preservation Specialist" here but "Extraction Specialist" on `/archetypes` and in both email templates.

### Family D: `intel/index.html` hub (1 page, bespoke)
Same Share Tech Mono + Rajdhani design as `/archetypes`. Inline CSS 16,682 B + 2,889 B inline JS (priority-stack swapper + category filter). CSS: footer, polish, `/assets/intel-archive-optimizer.css?v=mobile-sweep-20260515`. **Does NOT load `disclosure-page-polish.js`** (only subpage that skips it). JSON-LD `CollectionPage` with `ItemList` of 64 URLs (64 unique, `numberOfItems: 64`). Canonical `https://www.getdisclosure.app/intel/`.
Sections: hero + archive console (readout "SPECIES FILES 08 / PROTOCOLS 05 / HISTORY 04"), "Priority stack" feature card with 5 buttons, `#files` filter row (All/Protocols/Species/History/Psychology) + 64 `.article-card` links numbered INTEL-001..064 (unique), "Archive map" matrix, CTA. Footer is the full ds-footer but WITHOUT the social icon row and with a custom status ("64 Intel files", "04 Class paths").

### Family E: intel articles (64 pages, shared template with drift)
Common skeleton (intel/aaro-explained):
- head: title "X | DISCLOSURE", description, keywords, robots `index, follow`, canonical `https://www.getdisclosure.app/intel/<slug>/`, og (type article, site_name, image = `/intel/images/<name>.webp`), twitter card/title/description/image, theme-color, favicon.ico only, fonts Share Tech Mono + Rajdhani 400;500;600;700.
- Inline `<style>` 3,591 to 7,399 B (27 distinct variants across 64 pages; largest shared variant used by 11 pages).
- CSS linked (end of head): footer, polish, `/assets/intel-field-value.css?v=readability-20260515`, `/assets/intel-guide-header.css?v=mobile-sweep-20260515`. JS: polish.js. No inline JS.
- JSON-LD: `Article` on all 64, `BreadcrumbList` on all 64, `FAQPage` on 56, `HowTo` on 10 (alien-survival-guide-complete, how-to-film-a-ufo-at-night, how-to-prepare-for-alien-contact, how-to-report-a-ufo-sighting, ufo-contact-emergency-kit, ufo-evidence-checklist, ufo-sighting-family-protocol, what-to-do-if-a-ufo-follows-your-car, what-to-do-if-a-ufo-lands-nearby, what-to-do-if-you-see-a-ufo). No FAQPage on 8: are-we-alone-in-the-universe, fermi-paradox-explained, how-to-prepare-for-alien-contact, how-to-report-a-ufo-sighting, uap-disclosure-act-2026-timeline, ufo-evidence-checklist, what-to-do-if-you-see-a-ufo, what-would-first-contact-look-like.
- header: `nav.intel-guide-topbar` (brand mark `logo-nav.webp` + "INTEL GUIDE / CIVILIAN ACCESS FILE", chip "OPEN FILE", links ARCHIVE `/intel`, BRIEFING `/first-contact`, primary GET CLASSIFIED `/#quiz`), then `header.article-hero` (hero img with srcset, kicker, H1 `.article-title`).
- main `.article-wrap`: `.article-meta` (FILED, CLASSIFICATION, CATEGORY, READ TIME), `.article-body` with `.classified-box`, `.field-card`, `.source-panel` (11 pages), H2s prefixed `//`, related list, `.article-artifact`, then `.article-cta` with `.cta-btn` to `/quiz`.
- Author in Article schema: "DISCLOSURE Protocol" on 44, "Disclosure" on 20. datePublished: 2026-05-15 x47, 2026-02-26 x9, 2026-03-04 x8.

Drift inside the family:
- 8 articles have no `.cta-btn`, using inline-styled CTA blocks instead (alien-survival-guide-complete, anunnaki-creator-species-theory, grey-alien-encounter-survival-guide, nordic-alien-encounter-protocol, tall-white-alien-charles-hall, mantid-alien-encounter-what-to-do, reptilian-alien-threat-assessment, types-of-alien-species-ranked-threat). These 8 also carry 14 to 32 inline `style=""` attributes each and a `.dossier-header` block.
- 4 articles use a slim footer (no shell/grid, no CTA row, no social, no status, no binary easter egg, `<h2>` without `<em>`): alien-dreams-contact-meaning, disclosure-anxiety-explained, how-to-evaluate-ufo-memory, sleep-paralysis-vs-alien-abduction.
- Kicker numbering is broken: 44 of 64 article kickers disagree with the hub card number, and 13 kicker numbers are reused (e.g. INTEL-018 on aaro-explained, close-encounter-types-explained, how-to-report-a-ufo-sighting, pleiadian-aliens-explained; INTEL-019 and INTEL-020 on four pages each). The hub itself is clean 001 to 064. The hub's own priority-stack JS labels how-to-report "INTEL-018" while its grid card says a different number.
- Slug/title mismatch: `intel/four-types-of-people-alien-contact/` is titled "Five Types of People During Alien Contact".

---

## 2. Shared assets (`assets/`)

| File | Size | What it does | Linked by |
|---|---|---|---|
| `disclosure-footer.css` | 7,120 B | Styles the `.ds-footer` block (grid, CTA pills, footer nav, social, status chips, "FINAL SIGNAL LOCK" vertical label). Fonts via `var(--mono,'Share Tech Mono')` and `var(--font-head,var(--body,'Rajdhani'))`. | 78 of 78 subpages |
| `disclosure-page-polish.css` (`?v=number-badge-20260516`) | 9,765 B | "Visual/interaction only" layer: cursor glow, hover lift on cards/buttons, focus-visible rings, section hairlines, reveal-on-scroll states (`.dp-reveal`/`.dp-inview`), mobile fixes. | 78 of 78 |
| `disclosure-page-polish.js` | 1,957 B | Adds `dp-polish-ready`, pointer-follow glow (skipped on reduced motion), IntersectionObserver reveal for sections/cards. | 77 of 78 (missing on `intel/index.html`) |
| `archetype-dossier.css` (`?v=20260518`) | 14,420 B | Revamp skin for `/archetype/*`: accent-driven background, forces Rajdhani, restyles badge, trait list, CTA, FAQ. | 5 (archetype/*) |
| `intel-archive-optimizer.css` (`?v=mobile-sweep-20260515`) | 2,915 B | Hub grid readability + perf (`content-visibility:auto`, forces cards visible, topbar width fix). | 1 (`intel/index.html`) |
| `intel-field-value.css` (`?v=readability-20260515`) | 4,941 B | Styles `.field-card`, `.article-artifact`, artifact grid. | 64 (intel articles) |
| `intel-guide-header.css` (`?v=mobile-sweep-20260515`) | 7,614 B | Sticky `nav.intel-guide-topbar` for articles; defines `--intel-guide-mono: 'Share Tech Mono','JetBrains Mono'`. | 64 (intel articles) |

`assets/species-hangar/` (images) is not referenced by any subpage (root-only).

---

## 3. quiz/, first-contact/, readiness/: real tools or landings?

All three are **static SEO landing pages with zero inline or external interactive JS** beyond polish.js. None contains questions, scoring, result logic, or a capture form.

- `quiz/index.html`: describes the quiz (10 questions, 5 roles, "First Contact under 0.1%"), shows 4 sample "prompts" as prose, a 3-step how-it-works, 8 FAQs. Every CTA ("Begin classification", "Take the quiz", nav "Get classified") links to `/#quiz` on the homepage. `Quiz` JSON-LD claims a quiz lives at `/quiz`, which it does not. Section "Five roles. One reflex." renders only 4 cards (First Contact missing).
- `first-contact/index.html`: long-form article (definition, 2023/2024/2026 timeline, 6-step protocol, 5 role cards linking to `/archetype/*`, FAQ). CSS-only animated "incident console" (hidden on mobile). CTAs to `/#quiz` and `/archetypes`.
- `readiness/index.html`: static "readiness index" with a hardcoded "22/100" panel value, level bands 0-25/26-50/51-75/76-100, 4-step first-sixty-seconds. "THE FIVE READINESS AXES" shows 4 cards. Nothing computes a score. CTAs to `/#quiz`.

Capture exists only on the homepage (Supabase anon insert into `waitlist`, and `/api/send-card` called from root `index.html` line 3095).

---

## 4. Nav and footer

Header nav is **not consistent**; there are four different header systems:

| Page(s) | Header | Links (in order) |
|---|---|---|
| quiz, intel hub | `.topbar` | Briefing `/first-contact`, Dossiers `/archetypes`, **Get classified** `/#quiz` |
| readiness, faq | `.topbar` | Briefing, Quiz `/quiz`, **Get classified** |
| first-contact | `.topbar` | Intel `/intel`, Dossiers `/archetypes`, **Get classified** |
| about | `.topbar` | Briefing, Readiness, **Get classified** |
| privacy | `.topbar` | Terms, About, **Get classified** |
| terms | `.topbar` | Privacy, About, **Get classified** |
| archetypes | `.topbar` | Assessment `/#quiz`, Briefing, Readiness, Main Site `/` (no primary pill) |
| archetype/* (5) | bare `<nav>` | text logo `/`, "← ALL ARCHETYPES" `/archetypes` |
| intel articles (64) | `nav.intel-guide-topbar` | ARCHIVE `/intel`, BRIEFING `/first-contact`, **GET CLASSIFIED** `/#quiz` |

No header anywhere links to `/faq`; only first-contact's header links to `/intel`. On mobile (<760px) the Family A/B header collapses to the logo + primary pill only.

Footer: the **footer nav is identical on all 78 pages**: ARCHETYPE QUIZ `/quiz`, THE BRIEFING `/first-contact`, READINESS, ARCHETYPES, FAQ, ABOUT, INTEL, PRIVACY, TERMS. `aria-current="page"` is set correctly per page (archetype/* mark ARCHETYPES, all 64 articles mark INTEL). Footer CTAs: "START CLASSIFICATION ↗" `/#quiz`, "CLAIM CARD" `/#access` (both anchors exist in root index.html). Social: X `x.com/disclosure_app`, YouTube `@getdisclosure`, TikTok `@getdisclosure`, Instagram `disclosure_app` (handles are inconsistent: disclosure_app vs getdisclosure).

Footer variants: 73 pages full footer with status "LIVE Signal file / 04 Archetypes / 99+ Briefed"; intel hub full footer minus social, status "64 Intel files / 04 Class paths"; 4 articles slim footer (listed in 1E). The "decode" easter egg is an `onclick` on a `div` (not keyboard reachable).

---

## 5. Fonts

All via Google Fonts css2 `<link>` with `display=swap`; no self-hosting, no preload.

| Family | Loads | Weights |
|---|---|---|
| A: quiz, first-contact, readiness, faq, about, privacy, terms (7) | Teko, JetBrains Mono, Chakra Petch | Teko 500/600/700; JetBrains Mono 400/700/800; Chakra Petch 400/500/600/700 |
| B/D: archetypes, intel hub, E: 64 articles (66) | Share Tech Mono, Rajdhani | STM 400; Rajdhani 400/500/600/700 |
| C: archetype/* (5) | Share Tech Mono, Rajdhani | STM 400; Rajdhani 400/500/700 (no 600, no gstatic preconnect) |

Two type systems run side by side: Family A (Teko/Chakra/JetBrains) vs everything else (Rajdhani/Share Tech Mono).
Font bug: `disclosure-footer.css` sets mono text with `var(--mono,'Share Tech Mono',monospace)`. Family A pages define `--font-mono`, not `--mono`, and do not load Share Tech Mono, so on those 7 pages the footer mono text (kicker, nav, status, "FINAL SIGNAL LOCK") falls to the system monospace. Family A inline CSS uses `font-weight:950` in places, which none of the loaded fonts provide (synthesised/clamped).
Archetype and intel inline CSS also reference `'JetBrains Mono'` as a fallback inside `var(--mono,'JetBrains Mono',...)`; harmless since `--mono` is defined.

---

## 6. SEO per page

Canonical present on 78/78. Host split: **12 pages canonicalise to the apex `https://getdisclosure.app/<path>` with no trailing slash** (the 7 Family A pages + 5 archetype pages); **66 canonicalise to `https://www.getdisclosure.app/...`** (archetypes without slash; hub and 64 articles with slash). Sitemap and robots.txt use www + trailing slash throughout. og:url matches canonical on every page.

No duplicate titles, no duplicate descriptions. og:image is shared: `/og-image.jpg` on 8 pages (apex x7, www x1), `/og-v2.png` on 6 pages, each article has its own webp.

**Missing og:image file:** `/og-v2.png` does not exist on disk (only `og-image.jpg` and `og-image.png` exist). Affects `/archetypes` and all 5 `/archetype/*`. `vercel.json` also carries cache rules for `/og.png` and `/og-v2.png`, neither of which exists.

Titles over ~60 chars: quiz 68, first-contact 68, faq 67, about 64, readiness 63, archetypes 63, intel hub 85. Descriptions over 160: archetypes 167, diplomat 177, scholar 175, survivor 173, intel hub 179. None under 120.

| Page | Title len | Desc len | Canonical (host, slash) | og:image path | on disk | Flags |
|---|---|---|---|---|---|---|
| /quiz | 68 | 145 | y (apex, no /) | /og-image.jpg | y | title>60, no favicon link |
| /first-contact | 68 | 145 | y (apex, no /) | /og-image.jpg | y | title>60 |
| /archetypes | 63 | 167 | y (www, no /) | /og-v2.png | **NO** | title>60, desc>160, OG MISSING, no twitter:image, no robots meta |
| /archetype/diplomat | 46 | 177 | y (apex, no /) | /og-v2.png | **NO** | desc>160, OG MISSING, no twitter:image, no robots meta |
| /archetype/first-contact | 55 | 141 | y (apex, no /) | /og-v2.png | **NO** | OG MISSING, no robots meta |
| /archetype/scholar | 40 | 175 | y (apex, no /) | /og-v2.png | **NO** | desc>160, OG MISSING, no twitter:image, no robots meta |
| /archetype/sentinel | 45 | 149 | y (apex, no /) | /og-v2.png | **NO** | OG MISSING, no twitter:image, no robots meta |
| /archetype/survivor | 56 | 173 | y (apex, no /) | /og-v2.png | **NO** | desc>160, OG MISSING, no twitter:image, no robots meta |
| /readiness | 63 | 138 | y (apex, no /) | /og-image.jpg | y | title>60 |
| /faq | 67 | 131 | y (apex, no /) | /og-image.jpg | y | title>60, no favicon link |
| /about | 64 | 151 | y (apex, no /) | /og-image.jpg | y | title>60 |
| /privacy | 51 | 139 | y (apex, no /) | /og-image.jpg | y |  |
| /terms | 51 | 144 | y (apex, no /) | /og-image.jpg | y |  |
| /intel | 85 | 179 | y (www, /) | /og-image.jpg | y | title>60, desc>160 |
| /intel/aaro-explained | 26 | 123 | y (www, /) | /intel/images/aaro-explained.webp | y |  |
| /intel/ai-probe-alien-theory | 34 | 137 | y (www, /) | /intel/images/ai-probe-alien-theory.webp | y |  |
| /intel/airplane-satellite-balloon-ufo-misidentification | 49 | 146 | y (www, /) | /intel/images/ufo-misidentification.webp | y |  |
| /intel/alien-dreams-contact-meaning | 45 | 148 | y (www, /) | /intel/images/alien-dreams-contact.webp | y |  |
| /intel/alien-hybrid-theory-explained | 42 | 134 | y (www, /) | /intel/images/alien-hybrid-theory.webp | y |  |
| /intel/alien-implants-explained | 37 | 157 | y (www, /) | /intel/images/alien-implants-explained.webp | y |  |
| /intel/alien-survival-guide-complete | 52 | 145 | y (www, /) | /intel/images/alien-survival-guide.webp | y |  |
| /intel/ancient-astronaut-theory-explained | 47 | 137 | y (www, /) | /intel/images/ancient-astronaut-theory.webp | y |  |
| /intel/anunnaki-creator-species-theory | 44 | 141 | y (www, /) | /intel/images/anunnaki-creator-species.webp | y |  |
| /intel/arcturian-aliens-explained | 39 | 133 | y (www, /) | /intel/images/arcturian-aliens.webp | y |  |
| /intel/are-we-alone-in-the-universe | 42 | 143 | y (www, /) | /intel/images/are-we-alone.webp | y |  |
| /intel/black-triangle-ufo-explained | 41 | 153 | y (www, /) | /intel/images/black-triangle-ufo.webp | y |  |
| /intel/close-encounter-types-explained | 44 | 130 | y (www, /) | /intel/images/close-encounter-types.webp | y |  |
| /intel/dark-forest-theory-first-contact | 45 | 140 | y (www, /) | /intel/images/dark-forest-theory.webp | y |  |
| /intel/disclosure-anxiety-explained | 41 | 156 | y (www, /) | /intel/images/disclosure-anxiety.webp | y |  |
| /intel/drone-vs-ufo | 38 | 140 | y (www, /) | /intel/images/drone-vs-ufo.webp | y |  |
| /intel/experiencer-support-after-ufo-encounter | 54 | 135 | y (www, /) | /intel/images/experiencer-support.webp | y |  |
| /intel/fermi-paradox-explained | 36 | 140 | y (www, /) | /intel/images/fermi-paradox.webp | y |  |
| /intel/four-types-of-people-alien-contact | 54 | 146 | y (www, /) | /intel/images/people-contact-creates.webp | y |  |
| /intel/government-ufo-programs-history | 44 | 140 | y (www, /) | /intel/images/government-programs.webp | y |  |
| /intel/grey-alien-encounter-survival-guide | 48 | 133 | y (www, /) | /intel/images/grey-alien-encounter.webp | y |  |
| /intel/how-to-evaluate-ufo-memory | 41 | 150 | y (www, /) | /intel/images/evaluate-ufo-memory.webp | y |  |
| /intel/how-to-film-a-ufo-at-night | 39 | 131 | y (www, /) | /intel/images/film-ufo-at-night.webp | y |  |
| /intel/how-to-prepare-for-alien-contact | 45 | 152 | y (www, /) | /intel/images/prepare-contact.webp | y |  |
| /intel/how-to-report-a-ufo-sighting | 41 | 144 | y (www, /) | /intel/images/report-ufo-sighting.webp | y |  |
| /intel/how-to-talk-about-a-ufo-sighting | 45 | 139 | y (www, /) | /intel/images/talk-about-ufo-sighting.webp | y |  |
| /intel/insectoid-aliens-explained | 39 | 130 | y (www, /) | /intel/images/insectoid-aliens.webp | y |  |
| /intel/interdimensional-hypothesis-explained | 50 | 141 | y (www, /) | /intel/images/interdimensional-hypothesis.webp | y |  |
| /intel/mantid-alien-encounter-what-to-do | 41 | 133 | y (www, /) | /intel/images/mantid-alien-encounter.webp | y |  |
| /intel/mass-panic-first-contact | 41 | 145 | y (www, /) | /intel/images/mass-panic-first-contact.webp | y |  |
| /intel/missing-time-after-ufo-sighting | 44 | 143 | y (www, /) | /intel/images/missing-time-ufo.webp | y |  |
| /intel/nasa-uap-report-explained | 38 | 130 | y (www, /) | /intel/images/nasa-uap-report.webp | y |  |
| /intel/nimitz-tic-tac-ufo-explained | 41 | 137 | y (www, /) | /intel/images/nimitz-tic-tac.webp | y |  |
| /intel/nordic-alien-encounter-protocol | 44 | 149 | y (www, /) | /intel/images/nordic-alien-encounter.webp | y |  |
| /intel/ontological-shock-explained | 40 | 139 | y (www, /) | /intel/images/ontological-shock.webp | y |  |
| /intel/phoenix-lights-explained | 37 | 147 | y (www, /) | /intel/images/phoenix-lights.webp | y |  |
| /intel/pleiadian-aliens-explained | 39 | 132 | y (www, /) | /intel/images/pleiadian-aliens.webp | y |  |
| /intel/project-blue-book-explained | 40 | 144 | y (www, /) | /intel/images/project-blue-book.webp | y |  |
| /intel/psychology-of-ufo-encounters | 37 | 138 | y (www, /) | /intel/images/ufo-psychology.webp | y |  |
| /intel/rendlesham-forest-ufo-incident | 43 | 149 | y (www, /) | /intel/images/rendlesham-forest.webp | y |  |
| /intel/reptilian-alien-threat-assessment | 46 | 138 | y (www, /) | /intel/images/reptilian-alien-threat.webp | y |  |
| /intel/rio-scale-explained | 32 | 141 | y (www, /) | /intel/images/rio-scale.webp | y |  |
| /intel/roswell-ufo-incident-explained | 43 | 142 | y (www, /) | /intel/images/roswell-incident.webp | y |  |
| /intel/seti-post-detection-protocol | 51 | 130 | y (www, /) | /intel/images/seti-post-detection.webp | y |  |
| /intel/sirians-alien-lore-explained | 41 | 135 | y (www, /) | /intel/images/sirians-alien-lore.webp | y |  |
| /intel/sleep-paralysis-vs-alien-abduction | 47 | 149 | y (www, /) | /intel/images/sleep-paralysis-abduction.webp | y |  |
| /intel/starlink-vs-ufo | 41 | 138 | y (www, /) | /intel/images/starlink-vs-ufo.webp | y |  |
| /intel/tall-white-alien-charles-hall | 47 | 157 | y (www, /) | /intel/images/tall-white-alien.webp | y |  |
| /intel/types-of-alien-species-ranked-threat | 52 | 146 | y (www, /) | /intel/images/alien-species-ranked-threat.webp | y |  |
| /intel/uap-disclosure-act-2026-timeline | 50 | 146 | y (www, /) | /intel/images/disclosure-timeline.webp | y |  |
| /intel/uap-records-collection-explained | 45 | 127 | y (www, /) | /intel/images/uap-records-collection.webp | y |  |
| /intel/ufo-contact-emergency-kit | 38 | 145 | y (www, /) | /intel/images/ufo-emergency-kit.webp | y |  |
| /intel/ufo-evidence-checklist | 35 | 142 | y (www, /) | /intel/images/ufo-evidence-checklist.webp | y |  |
| /intel/ufo-sighting-family-protocol | 41 | 141 | y (www, /) | /intel/images/family-ufo-protocol.webp | y |  |
| /intel/ufo-vs-uap-difference | 47 | 144 | y (www, /) | /intel/images/ufo-vs-uap.webp | y |  |
| /intel/what-are-orbs-in-the-sky | 38 | 140 | y (www, /) | /intel/images/orbs-in-the-sky.webp | y |  |
| /intel/what-to-do-if-a-ufo-follows-your-car | 49 | 141 | y (www, /) | /intel/images/ufo-follows-car.webp | y |  |
| /intel/what-to-do-if-a-ufo-lands-nearby | 45 | 137 | y (www, /) | /intel/images/ufo-lands-nearby.webp | y |  |
| /intel/what-to-do-if-you-see-a-ufo | 40 | 132 | y (www, /) | /intel/images/ufo-sighting.webp | y |  |
| /intel/what-would-first-contact-look-like | 48 | 150 | y (www, /) | /intel/images/first-contact-scenario.webp | y |  |
| /intel/why-people-freeze-during-ufo-sightings | 51 | 123 | y (www, /) | /intel/images/freeze-during-ufo-sighting.webp | y |  |
| /intel/why-ufo-witnesses-stay-silent | 42 | 132 | y (www, /) | /intel/images/witness-silence.webp | y |  |
| /intel/zeta-reticuli-grey-aliens | 38 | 131 | y (www, /) | /intel/images/zeta-reticuli-greys.webp | y |  |
| /intel/zoo-hypothesis-explained | 37 | 140 | y (www, /) | /intel/images/zoo-hypothesis.webp | y |  |

Other SEO notes:
- Article JSON-LD on archetype pages has no date and no image; intel article schema is complete.
- JSON-LD URLs follow each page's host, so apex and www identities are mixed across the site's structured data.
- No analytics on any subpage (gtag only in root index.html), so intel traffic is unmeasured on-page.
- Intel og:image files are webp (2,752 px originals on some); some link-preview consumers handle webp poorly.

---

## 7. sitemap.xml, robots.txt, llms.txt

**sitemap.xml**: 78 `<url>` entries, all `https://www.getdisclosure.app/...` with trailing slash. lastmod: 2026-05-15 x72, 2026-03-04 x5, 2026-03-05 x1. Lists `/`, about, quiz, first-contact, readiness, faq, 5 archetype pages, privacy, terms, intel hub, 64 intel articles.
- On disk but NOT in sitemap: **`/archetypes`**.
- In sitemap with no page: none.
- Mismatch: 12 sitemap URLs (www + slash) differ from their page's canonical (apex, no slash); the archetype hub canonical (www, no slash) is absent from the sitemap entirely. Sitemap comments show build phases ("Phase A..D intel expansion").

**robots.txt**: `User-agent: * Allow: /`, then explicit Allow blocks for GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Googlebot, Bingbot, DuckDuckBot, Applebot, facebookexternalhit, Twitterbot. `Sitemap: https://www.getdisclosure.app/sitemap.xml`. Contains one em dash in a comment line ("AI Training Crawlers [em dash] Welcome").

**llms.txt** (225 lines, 23 KB): product summary, "Six Documented Alien Species" registry (Grey, Nordic, Reptilian, Mantid, Tall White, Anunnaki with threat levels and "Readiness Score required"), five archetypes, key features, **all 64 intel articles listed (64/64, no extras)**, FAQ, key URLs. All 79 URLs are www.
- Omits `/archetypes`, `/archetype/*`, `/readiness`, `/about`, `/privacy`, `/terms`.
- 94 em dashes.
- Claims to verify or remove: "world's only" / "first and only" alien first contact preparation app (x4), "Available: iOS and Android. Free to download." (contradicts archetype/first-contact "the Disclosure app hasn't launched" and the email's "COMING SOON TO iPHONE + ANDROID"), "governments have had classified contact protocols for 80 years", species survival directives stated as fact ("Submit immediately", "Stillness is your only protocol").

---

## 8. Serverless functions

### `api/send-card.js` (Vercel Node function)
- Purpose: POST `{ email, archetype, serial }` sends the branded "Your role is ready" card email (HTML + plain text) through Resend, from `Disclosure Protocol <team@getdisclosure.app>`, reply-to team@, with List-Unsubscribe headers. Called from root `index.html` (line 3095) and by `scripts/send-disclosure-batch.js` (default endpoint `https://www.getdisclosure.app/api/send-card`, dry-run by default, `--send --confirm-send` required).
- Env: `RESEND_KEY` (read from `process.env`, line 1). No hardcoded secret.
- Validation: only presence of the three fields. No email format check, no type checks (`archetype.toLowerCase()` throws on a non-string, returning the raw `err.message`), no allow-list on `archetype`.
- **HTML injection into outbound mail**: `archetype` is lowercased and passed unescaped into `urlsFor()` (`/archetype/${dossierPath}` and `?a=${archetype}`), which lands inside `href="..."` attributes via `button()` (lines 77-95, 186, 240). Only `serial` and copy strings go through `esc()`. Anyone can craft an email from team@getdisclosure.app with injected markup/links to any address.
- CORS `Access-Control-Allow-Origin: *`; no origin check, no auth, **no rate limiting**, no captcha/honeypot, no dedupe. Anyone can use it to send unlimited branded mail to arbitrary recipients (cost, sender-reputation and abuse risk).
- Response echoes `to: email` and the full Resend `detail` payload back to the caller.
- Compliance: unsubscribe link and List-Unsubscribe point to `https://getdisclosure.app?unsub=1`, which carries no recipient identity; root `index.html` has no `unsub` handling at all, and a static site cannot accept the one-click POST. No physical mailing address in the email (CASL requirement).

### `supabase/functions/send-welcome-email/index.ts` (Supabase Edge / Deno)
- Purpose: database-webhook style handler. Expects `{ record: { email, archetype, serial_number } }` (the `waitlist` row), builds a different, older card email and sends it over raw SMTP (TLS 465) to Hostinger.
- Env: `SMTP_PASS` via `Deno.env.get` (line 4). Hardcoded non-secret config: `SMTP_HOST = "smtp.hostinger.com"` (line 1), `SMTP_PORT = 465` (line 2), `SMTP_USER = "team@getdisclosure.app"` (line 3).
- No webhook signature/secret check, CORS `*` on OPTIONS. Reachable by anyone holding the public anon key (which is embedded in root `index.html` line 2465, role `anon`, project ref `bexjbozbrhijtjombxkm`) unless JWT verification is disabled, in which case it is fully open.
- **SMTP injection risk**: `to` is written raw into `RCPT TO:<${to}>` and the `To:` header (lines 320, 335). `schema.sql` allows public anon INSERT into `waitlist` with `WITH CHECK (true)`, so the email string is attacker-controlled if the webhook fires on insert. CRLF in the address could add recipients/headers.
- Same unescaped `archetype` in `dossierUrl` href as send-card.
- Logs every SMTP response and the recipient email to function logs (PII in logs).
- No plain-text part, **no unsubscribe link or List-Unsubscribe header**, no mailing address.
- Divergence: two welcome-email senders exist (Resend via Vercel, Hostinger SMTP via Supabase) with different copy and even different archetype colours (Sentinel `#FA3E3E` vs `#4AF626`, Scholar `#3B82F6` vs `#60A5FA`). If both are wired, a signup gets two emails. Which one is live cannot be told from the repo.

### Secret scan (locations only)
- `index.html` line 2465: Supabase JWT, role `anon` (public by design; RLS is the control).
- `index.html` lines 1237, 1240: GA4 measurement ID (public).
- No Resend key, SMTP password, or service-role key committed. `scripts/send-disclosure-batch.js` reads the service-role key from env `DISCL_SUPABASE_SERVICE_ROLE_KEY` or `/home/ubuntu/.config/...` JSON (lines 36-49).
- `schema.sql` line 2 names the Supabase project ref in a dashboard URL (not a secret).

---

## 9. Copy law

Visible text = body minus script/style/comments/tags.

| Family | Pages | Em dash (U+2014) visible | Em dash anywhere in file | Spaced hyphen used as dash (visible) | "conspiracy" | believe/believer | belief | theory/theories | "alien(s)" visible |
|---|---|---|---|---|---|---|---|---|---|
| quiz | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 |
| first-contact | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| archetypes | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| archetype/* | 5 | 0 | 0 | **41** | 0 | 0 | 0 | 0 | 0 |
| readiness | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| faq | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| about | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| privacy | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| terms | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| intel hub | 1 | 0 | 0 | 0 | 0 | 0 | 3 | 17 | 11 |
| intel articles | 64 | 0 | 0 | 0 | 1 | 22 | 25 | 88 | 141 |
| **Total** | 78 | **0** | **0** | 41 | 2 | 25 | 30 | 105 | 162 |

- Em dashes: zero across all 78 subpages. They survive in `llms.txt` (94), `robots.txt` (1) and `schema.sql` (1).
- Spaced hyphens stand in for dashes on the archetype pages (diplomat 10, scholar 11, survivor 9, first-contact 6, sentinel 5) and in their titles/meta ("The Diplomat - De-escalation Lead").
- "conspiracy": about ("A UFO news feed or conspiracy forum", in a NOT row) and intel/uap-records-collection-explained.
- "believe*" pages: archetypes, about, privacy, and 19 intel articles (alien-implants-explained, pleiadian-aliens-explained, zoo-hypothesis-explained have 2 each).
- Product context (`.claude/product-marketing-context.md` line 64) also lists "theory" and "alien" as avoid-words; "theory" appears 105 times, mostly in slugs/titles of theory explainers (ancient-astronaut, dark-forest, alien-hybrid, ai-probe, anunnaki).
- lorem / ipsum / TODO / TBD / FIXME / placeholder / "coming soon": **0** in all subpages.
- Internal strategy copy leaked into visible text (reads like build notes, not product copy):
  - quiz: label "Search answer:"; "the First Contact Card funnel".
  - first-contact: "Answer the query fast. Then make the answer impossible to forget."; "The visitor should leave knowing there is a sequence..."; "This is the bridge from SEO information to Disclosure conversion..."; "The suspense works because the premise is grounded..."; "Structured answers for humans, search engines, and AI answer engines."
  - archetypes: "This is the page visitors should send friends after the quiz result lands."; panel "VIRAL LOOP" with "That is the loop."; "The quiz gives visitors identity."
  - faq: "16 high-intent entries".
  - intel hub: "These are the files most likely to move a visitor from curiosity to classification without turning the page into homework."; "The archive should feel like a classified terminal, not a pile of thumbnails."; "The hub now has intention..."; "Field guides give visitors something practical to do with the tension."
  - intel/government-ufo-programs-history: "That is where the DISCLOSURE funnel begins"; intel/how-to-prepare-for-alien-contact: "connects the public file to the card and training funnel".
- Unverifiable numeric claims: archetype prevalence (Sentinel 25%, Diplomat 30%, Scholar 15%, Survivor 30%, First Contact <0.1%) stated as measured ("of all people assessed") while the app has not launched; survivor "SURVIVAL RATE 97%" and "In every crisis psychology study conducted since the Cold War..."; readiness "22/100" baseline.

---

## 10. Stale and conflicting counts

Actual intel article folders: **64**. Archetypes on the site: **5** (4 standard + First Contact).

| Claim | Where | Count of pages | Status |
|---|---|---|---|
| "64 FILES", "Sixty-four files", "64 FILES ONLINE", ItemList `numberOfItems: 64`, footer "64 Intel files" | intel hub | 1 | Correct (64) |
| "64 SEO-indexable Intel files", "Intel Articles (64 ...)" | llms.txt | n/a | Correct (64) |
| Footer "**04** Archetypes" | ds-ft-status | **73** pages | Stale/contradictory: site sells five archetypes ("Five archetypes" appears on 6 pages incl. /archetypes H1 "Five instincts") |
| Footer "**99+** Briefed" | ds-ft-status | **73** pages | Static social-proof number, not wired to `get_waitlist_count()`; unverifiable |
| Hub footer "04 Class paths" | intel hub | 1 | Same 4 vs 5 conflict |
| Hub console "SPECIES FILES 08 / PROTOCOLS 05 / HISTORY 04" | intel hub | 1 | Stale: grid tags give species 18, protocol 24, history 21, psychology 17 (multi-tag) |
| "Five roles. One reflex." with 4 cards | quiz | 1 | Content short by one |
| "THE FIVE READINESS AXES" with 4 cards | readiness | 1 | Content short by one |
| "16 high-intent entries" | faq | 1 | Correct (16 Q/A) but internal phrasing |
| Article kickers INTEL-0xx | intel articles | 44 mismatched, 13 numbers reused | Stale numbering vs hub 001-064 |
| "Six species" | 3 articles + llms.txt | 3 | Consistent with llms.txt registry |
| Slug `four-types-of-people-alien-contact` titled "Five Types..." | 1 article + hub ItemList | 1 | Slug stale |

Files referenced: `quiz/index.html`, `first-contact/index.html`, `readiness/index.html`, `faq/index.html`, `about/index.html`, `privacy/index.html`, `terms/index.html`, `archetypes/index.html`, `archetype/{diplomat,first-contact,scholar,sentinel,survivor}/index.html`, `intel/index.html`, `intel/*/index.html`, `assets/*.css`, `assets/disclosure-page-polish.js`, `sitemap.xml`, `robots.txt`, `llms.txt`, `vercel.json`, `schema.sql`, `api/send-card.js`, `supabase/functions/send-welcome-email/index.ts`, `scripts/send-disclosure-batch.js`.

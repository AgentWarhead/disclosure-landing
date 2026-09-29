# Dissection: getdisclosure.app homepage

Target: `C:\Users\bfauc\Desktop\Kootenay Made Digital\Disclosure App\disclosure-landing\index.html`
Size: 454,591 bytes, 4,444 lines. Read-only pass, nothing edited.
Sibling file: `index.html.pre-enhancements` (113,238 bytes) sits in the deploy folder and is probably publicly served.

Byte budget:

| Block | Lines | Bytes | Share |
|---|---|---|---|
| Main `<style>` | 120-1229 | ~205.0 KB | 45% |
| Species hangar `<style>` (it is really a second, page-wide override layer) | 1781-2043 | ~76.2 KB | 17% |
| Inline JS, all blocks | see section 3 | ~99 KB | 22% |
| Markup, SVG, JSON-LD | rest | ~75 KB | 16% |

CSS stats: 1,894 `!important`, 63 `@keyframes`, 529 class selectors, of which about 69 are dead (see section 7).

---

## 1. HEAD (lines 1-1246)

**Pre-doctype comments (lines 2-4):** `CASE FILE: UAP-CIVILIAN-001 ...`, the coordinates `37°14'06"N 115°48'40"W` (these are Area 51 / Groom Lake), and a binary string that decodes to "CITIZEN DIPLOMAT".

**Primary meta**
- `<title>` (l.11): `Disclosure App - Alien Encounter Preparation &amp; First Contact Training`
- description (l.12): "The only civilian alien encounter preparation app. Species threat assessments, first contact protocols, and readiness training for 6 documented non-human intelligences."
- keywords (l.13): UAP, UFO, first contact, alien encounter, archetype quiz, disclosure, NHI, contact protocol, citizen diplomat
- author `DISCLOSURE PROTOCOL`. robots `index, follow`.
- canonical (l.16): `https://www.getdisclosure.app/` (www). og:url and og:image use the non-www host, and the JSON-LD mixes both. The host is inconsistent.

**Open Graph (l.19-29):** type website, site_name DISCLOSURE, title "DISCLOSURE - Humanity's First Contact Readiness System", description "Get classified. Train your response. Carry the card before the sky opens.", image `https://getdisclosure.app/og-image.jpg` (image/jpeg, 1200x630; the file exists at 1200x630, 247 KB), alt "DISCLOSURE - Get classified before first contact.", locale en_US.

**Twitter (l.32-38):** summary_large_image, site and creator `@disclosure_app`. Title, description and image are the same as OG.

**Theme/app (l.41-49):** theme-color #000000, MS tile, apple-mobile-web-app-capable, app title DISCLOSURE.

**Favicons (l.52-58):** favicon.ico, 16, 32 and 96 PNGs, apple-touch-icon 180, mask-icon `safari-pinned-tab.svg` with `color="var(--crt-green)"` (**invalid**: an attribute cannot resolve a CSS var, so it must be a hex value), manifest `/site.webmanifest`. All files exist.

**JSON-LD blocks (4 total)**
1. l.61-91, `@graph`:
   - `WebApplication` "Disclosure" (alternateName "Disclosure - First Contact Guidance"), LifestyleApplication, OS "Web, iOS, Android", Offer price 0 USD, publisher Organization with sameAs x.com/disclosure_app, youtube @getdisclosure, tiktok @getdisclosure, instagram disclosure_app.
   - `Quiz` "First Contact Archetype Assessment": "A 10-question psychological assessment ... Sentinel, Diplomat, Scholar, Survivor, or the rare First Contact designation", url /quiz.
2. l.92-100, `WebSite` "Disclosure", url www.
3. l.101-111, `SoftwareApplication` "Disclosure", **UtilitiesApplication**, OS "Android, iOS". This duplicates and contradicts block 1 (Lifestyle vs Utilities, and the Web OS entry).
4. l.2082-2093, placed inside the species section: `FAQPage` with 4 Q&As:
   - main species files (six: Grey, Nordic, Reptilian, Mantis, Tall White, Anunnaki)
   - Grey danger ("high-risk retrieval class")
   - Reptilian threat ("critical")
   - why Anunnaki is classified ("progenitor-class", needs a high readiness score in the app)

**Preconnect/preload:** preconnect to fonts.googleapis.com and fonts.gstatic.com (l.114-115). The Google Fonts CSS is preloaded with the onload rel-swap trick (l.116) plus a `<noscript>` fallback (l.117). `logo-nav.webp` is preloaded as an image (l.119). **No preload for the hero's first frame** (`frames/f001.webp`), which is the actual LCP visual.

**Fonts:** all from Google Fonts, `display=swap`:
- Teko 500, 700 (`--font-head`)
- JetBrains Mono 400, 700 (`--mono`/`--font-mono`, used in 201+ declarations; this is the dominant face)
- Chakra Petch 400, 500 (`--font-body`, set on body)

Weight mismatch: the CSS asks for weights that are never loaded, so they render as synthetic or nearest weights: 950 (29x), 900 (17x), 850 (7x), 800 (12x), 760/780/750/650/600. One rule uses an undefined `var(--body)`.

**External scripts**
- Google Analytics GA4 `G-XFFMNLNSXM` (l.1230-1245). Deferred: it loads 4.5 s after `window.load`, is skipped when `navigator.webdriver` is set, and sends config only. **No conversion events** (quiz complete, email submit and share are never tracked).
- Supabase JS: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js` (l.2473). The major version is floating (`@2`, never pinned). Lazy-injected on first need.
- GSAP 3.12.5 + ScrollTrigger from cdnjs (l.4387). Lazy: loads on first scroll or pointerdown, or after a 9 s timeout.
- ipapi.co JSON fetch (l.2540). The visitor's IP goes to a third party with no consent.
- No other third parties. The CSP in `vercel.json` allowlists all of the above.

**Inline style block sizes:** main block 205.0 KB (l.120-1229); species/atmosphere block 76.2 KB (l.1781-2043). Nothing is external. Its section comments read like a patch log: "Million-dollar revamp pass", "Boss correction", "Final merge polish", "Mobile repair pass 2", "Premium accent doctrine v2", and so on. Each layer overrides the one before it (see section 7).

---

## 2. SECTION MAP (DOM order)

Fixed/overlay elements before `<main>`: skip link "SKIP TO BRIEFING" (l.1248); share-redirect script (l.1249); `.cursor-ring#cursor` (l.1264); `#stars` (l.1265); `#blackout-overlay`, `#particle-layer`, `#archetype-flash` (l.1269-1271); `#flagged-overlay` "YOU HAVE BEEN FLAGGED. / IDENTITY CONFIRMED · RECORD CREATED" (l.1274-1277); `#boot` loader (l.1280-1283).

Word counts below are static visible words from the markup, excluding script-injected text.

### 0. Nav (l.1286-1295)
Logo `logo-nav.webp` links to `/`. Links: "Briefing" to /first-contact, "Dossiers" to /archetypes. Status pill `#nav-status-text` reads "LEAKED DOCUMENT · READING IN PROGRESS"; it is scroll-state driven and gets the city injected. 7 words.

### 1. Hero `section.hero-scroll#hero-scroll` (l.1298-1363)
- 500vh tall (CSS l.203) with a sticky 100vh inner. Canvas `#eye-canvas` plays a scroll-scrubbed 201-frame eye sequence.
- Overlays: vignette, eye glow, bottom fade.
- HUD top-left "LAT: 37°14'06"N LONG: 115°48'40"W / SIGNAL: ░░░░░░░░░░"; HUD bottom-right "DECRYPTION: n%".
- Eyebrow (kicker layer): "CASE FILE: UAP-CIVILIAN-001 // CLASSIFICATION REVOKED BY EXECUTIVE ORDER" + "// LEAKED DOCUMENT - UNAUTHORIZED DISTRIBUTION - DO NOT SHARE //"
- H1: "DISCLOSURE" (glitch span)
- H2: "This file was not meant for you."
- Sub: "The civilian first contact readiness system just leaked. / Most people will panic without a role. / *Secure your designation now.*"
- CTA: "GET CLASSIFIED →" to `#quiz` (`#hero-cta-btn`, reticle wrapper).
- Counter: "[#hero-count] civilians briefed · lifetime total · file accessed" (starts at "-").
- Proof line: "**Pre-launch iOS + Android field app.** Classification unlocks your First Contact Card."
- Scroll hint: "SCROLL TO OPEN FILE".
- Background: canvas frames over #020302, plus radial green/blue gradients (overridden at l.1115 and again at l.1834).
- 72 words.
- **Every text layer starts at opacity 0.** The H1 and CTA are invisible until the visitor scrolls, and the layers fade back out by roughly 98% progress.

### 1b. `#hero-flash` (l.1366-1368)
"FILE ACCESSED - CLEARANCE PENDING". **Dead**: CSS l.1206 sets it to `display:none!important`, and the JS only sets a flag.

### 2. Signal Timeline `section#evidence-wall.evidence-wall.signal-runway` (l.1371-1388)
- Eyebrow: "// SIGNAL TIMELINE //"
- H2: "This stopped being fringe.*The paper trail is public.*"
- Copy: "The public record is no longer empty. Hearings, archives, and official pressure have moved the question from folklore to readiness."
- CTA: "GET CLASSIFIED →" to `#quiz` (**duplicate quiz CTA #2**).
- 4 cards (data-file FILE 01-04):
  - HEARINGS / "The subject entered public record."
  - PRESSURE / "Institutions are being forced to respond."
  - MAY 8, 2026 / "The files started landing in public." with a "Verify source" link to archives.gov UAP bulk download
  - NOW / "Civilian curiosity has no protocol."
- Background: #020202 with a green radial and a diagonal scan rail. GSAP stagger reveal. 107 words.

### Floating `#quiz-gate-notice` (l.1391)
"▶ CLASSIFICATION REQUIRED - COMPLETE THE ASSESSMENT TO SECURE YOUR POSITION". Shown by `handleAccess` when a visitor submits the email form before finishing the quiz.

### 3. Quiz `section#quiz.quiz.quiz-content-hidden` (l.1392-1558)
- Decor: containment frame, corners, radar rings, scanbeam, perimeter, 5 data fragments ("CONTACT PROTOCOL 7.2 // RESPONSE VECTOR ANALYSIS" etc.), vignette `#quiz-vignette`, EKG SVG.
- Eyebrow: "ARCHETYPE CLASSIFICATION // REAL-TIME ANALYSIS"
- H2: "Four types of people.<br>*Which one are you?*"
- Widgets: progress bar `#quiz-bar`; confidence meter (SENTINEL/DIPLOMAT/SCHOLAR/SURVIVOR bars); "◉ RESPONSE LOGGED" flash; scan sweep; 10 question steps; result panel.
- Result CTAs:
  - "CLAIM YOUR FIRST CONTACT CARD →" button scrolls to `#access`. JS relabels it "RECEIVE YOUR CREDENTIAL →", or "RECEIVE YOUR CREDENTIAL ⭐" for First Contact.
  - "REVIEW ALL DOSSIERS" to /archetypes
  - "SHARE MY ARCHETYPE" runs `shareArchetype()`
  - "↻ RETAKE ASSESSMENT" runs `retakeQuiz()`
- Background: #030612 with green/blue radials (three layered definitions: l.297, 1117, 1836).
- 746 words, most of them question text.

### 4. Card claim / email gate `section#access.gate` (l.1559-1641)  **(THE ONLY EMAIL CAPTURE)**
- Decor: targeting reticle SVG.
- Eyebrow: "// CARD CLAIM - SECURE CHANNEL //"
- H2: "Claim your<br>*First Contact Card.*"
- Sub: "Your classification is active. Secure the card, app access, and launch-day field kit built for whatever arrives next."
  - This copy is shown even before the visitor is classified.
- Strip: "01 First Contact Card / 02 Readiness Drills / 03 Species Protocols"
- Hint `#gate-archetype-hint`: city or archetype injected by JS.
- Form `#gate-form onsubmit="handleAccess(event)"`: `input#gate-email` type=email, placeholder "EMAIL", required, autocomplete=email, **no `<label>`**. Button `#gate-submit-btn` "CLAIM APP ACCESS →".
- Success panel `#gate-success` (hidden by default):
  - "◉ CLEARANCE GRANTED"
  - "YOU ARE CIVILIAN #- · ACCESS LOGGED · CARD INCOMING"
  - Rendered card `#gs-card`: serial DS-2026-00000, SENTINEL, PRIMARY PROTECTOR, THREAT READ ACTIVE, ROLE ONSET IMMEDIATE, READINESS 84%, "🔴 FIELD DEPLOYMENT: READY", "Your card is issued on launch day."
  - Share box: "// SHARE YOUR ARCHETYPE //", text `#gs-share-text` ("Loading share text..."), buttons "[ COPY ]" and "[ SHARE ]", confirmation "COPIED · SEND IT".
- Notes: "Your frequency is logged once. This channel does not repeat." and "Review the civilian archetype dossiers →" to /archetypes.
- Stats: "[#stat-count] CIVILIANS BRIEFED LIFETIME TOTAL · ACTIVE SECURE CHANNEL".
- **No consent line, no privacy link, no CASL language at the form.**
- Background: #020302 with a green aperture radial and amber accents. 108 words.

### 5. Field simulator `section#protocol-simulator.protocol-sim.sim-live.story-sim` (l.1644-1676)
- No eyebrow.
- H2: "Training<br>*unlocked.*" (shown to people who have not done anything yet).
- Meters: CALM 72, SAFETY 68, EVIDENCE 41, SECONDS 07.
- Console: chip "PRESS START. TIMER BEGINS IMMEDIATELY."; label "INCIDENT QUEUE // POWER FAILURE"; clock 00:42; alert "BLACKOUT DETECTED · LOCAL GRID OFFLINE · DOGS BARKING OUTSIDE"; scene "11:47 PM. The house dies..."
  - The JS intro replaces all of the placeholder copy immediately.
- CTAs: "START FIELD SIMULATION" (`#sim-reset`, which toggles to RESET SIMULATION / RUN IT AGAIN) and "ARM SHARE PACKET" to `#transmission-packet` (visible only after the sim finishes).
- Background: #010101 with a red/green emergency wash and a cursor-following spotlight (`--mx/--my`). 63 words.

### 6. Protocol advantage `section.calm-bridge.panic-gap#calm-bridge` (l.1678-1697)
- Eyebrow: "// PROTOCOL ADVANTAGE //"
- H2: "You just felt the gap.<br>*Ten seconds is not enough.*"
- Sub: "The simulation is the warning shot. DISCLOSURE turns the first-contact freeze into a trained sequence: stabilize, classify, signal, document, transmit."
- CTAs: "SEE THE FIELD KIT →" to `#app-command-bridge` and "ARM SHARE PACKET" to `#transmission-packet` (**duplicate of the sim CTA**).
- "REACTION STACK / LIVE AFTER-ACTION" console:
  - 00 DEFAULT HUMAN RESPONSE / UNTRAINED
  - 01 DISCLOSURE PROTOCOL / ACTIVE
  - 02 FIRST CONTACT CARD / ARMED
  - animated meter
- Background: green radial with black seams. 90 words.

### 7. App command bridge `section#app-command-bridge.command-bridge` (l.1698-1734)
- Phone mockup: "DISCLOSURE FIELD DEVICE // LIVE MIRROR", "READINESS 84%", "ARCHETYPE: SENTINEL / SIGNAL DISCIPLINE: ACTIVE / CARD STATUS: PENDING", bars 84/67/91/42%, "NEXT DRILL: STONE COLD ...".
- Eyebrow: "// MOBILE COMMAND CENTER //"
- H2: "The file classifies you. *The app trains you.*"
- Copy: "Your classification is only the first layer. The app turns it into daily readiness: drills, signals, rules, credentials, incident reports, and the launch-day First Contact chase."
- List:
  - 01 READINESS SCORE
  - 02 FIRST CONTACT CARD
  - 03 STONE COLD DRILLS
  - 04 INTEL FILE UNLOCKS
- CTAs: "CLAIM APP ACCESS →" to `#access` and "RUN FIELD SIMULATION" to `#protocol-simulator` (this links back up the page).
- Background: blue-green radials with a circuit diagonal. 116 words.

### 8. Transmission packet `section#transmission-packet.transmission-packet` (l.1735-1763)
- Eyebrow: "// VIRAL TRANSMISSION PACKET //"
- H2: "Every classification needs a witness."
- Copy: "Your quiz result reveals the role. Your card proves the status. Your packet gives you the exact message to send before the signal window closes."
- CTAs: "TRANSMIT PACKET" runs `nativeSharePacket()`; "COPY FIELD MESSAGE" runs `copyPacketText()`; "POST ON X" (`#packet-x`) is a twitter.com/intent link with a generic prefilled message.
- Packet card: "◉ BLACK CHANNEL FIELD PACKET", serial "DS-2026-SIGNAL", name "SIGNAL PENDING", role "CLASSIFICATION NOT YET ISSUED", text "A civilian first contact file is open. Mine has not been classified yet. ...", "COPIED TO CLIPBOARD".
- **Share surface #3.** It never personalizes (bug, section 3h).
- Background: green top radial, amber side heat, antenna stripes. 83 words.

### 9. Archive gateway `section.archive-choice.archive-gateway#archive-choice` (l.1765-1779)
- Eyebrow: "// ARCHIVE GATEWAY //"
- H2: "Choose the next breach."
- Copy: "Your packet is armed. ..." (assumes the visitor has acted).
- 4 nodes:
  - 01 LOCKED PROTOCOLS to `#locked-protocols` "BEST NEXT"
  - 02 CLASSIFICATION FILES to /archetypes "ROLE MAP"
  - 03 SPECIES FILES to `#species-threat-matrix` "VISUAL FILE"
  - 04 INTEL ARCHIVE to /intel "OPEN FILE"
- **Duplicated purpose with Related Files (section 18).** 85 words.

### 10. Species hangar `section#species-threat-matrix.species-hangar` (l.1780-2149)
- Contains a 76 KB `<style>`, the FAQ JSON-LD and the carousel script.
- Eyebrow: "Containment Hangar · Active Registry"
- H2: "Choose the file.<br>*Learn the protocol.*"
- Copy: "Six non-human intelligence profiles. Six containment protocols. Swipe the hangar, select a chamber, and watch the active dossier come alive before the full archive locks behind your readiness score."
- Status: FILES 06 ACTIVE / MODE FIELD TRAINING / ACCESS PARTIAL.
- Widgets: 3D carousel rail with prev/next; dossier panel with "OPEN FILE" (to the intel article) and "REQUEST CLEARANCE" (scrolls to #quiz, **duplicate quiz CTA**); fullscreen preview dialog.
- Hint: "SWIPE OR TAP A CHAMBER · ARROWS ALSO WORK".
- Background: `assets/species-hangar/hangar-bg.webp` photo at .42-.5 opacity with a per-species overlay image and colour. 55 words static.

### 11. Locked protocols `section.rules#locked-protocols` (l.2152-2186)
- Watermark "LOCKED".
- Eyebrow: "// UNIVERSAL CONTACT RULES · FULL PROTOCOL LOCKED UNTIL CLASSIFICATION //"
- Rules:
  - 00 "KNOW YOUR ARCHETYPE BEFORE CONTACT."
  - 01 "DO NOT REACH."
  - 02 "DO NOT APPROACH THE LIGHT."
  - 03 partial with redaction bars (`onclick="void(0)"` no-ops)
- Line: "// FULL SPECIES-SPECIFIC PROTOCOL LOCKED: COMPLETE CLASSIFICATION //"
- No H2 (the eyebrow is the only header).
- CTA: "UNLOCK YOUR PROTOCOL →" to `#quiz` (**duplicate quiz CTA**). 74 words.

### 12. Civilian readiness OS `section#civilian-readiness-os.mission-band` (l.2188-2228)
- Eyebrow: "// CIVILIAN READINESS SYSTEM ONLINE //"
- H2: "Your classification<br>*becomes training.*"
- Copy: "DISCLOSURE turns first contact from a headline into a protocol. ..."
- CTAs: "GET CLASSIFIED →" to `#quiz` (**dup**) and "RUN FIELD SIMULATION" to `#protocol-simulator` (**dup**).
- Panel "CIVILIAN READINESS 05" (the panel says 05 but lists only 4 rows):
  - 01 ARCHETYPE ASSESSMENT ACTIVE
  - 02 FIRST CONTACT CARD LOCKED
  - 03 FIELD TOOLS APP
  - 04 INTEL ARCHIVE PARTIAL
- **Same message as sections 7 and 13.** 108 words.

### 13. Field kit showcase `section#classified-tools.fd-command-center` (l.2229-2288)
- Eyebrow: "// PRIMARY APP SYSTEM //"
- H2: "Download the civilian field kit."
- Copy: "The landing page classifies you. The app trains you. ..." (repeats section 7's H2 almost verbatim).
- Strip: "04 FIELD TOOLS / 01 CARD / 24/7 READY".
- Selector buttons: 01 SIGNAL LANGUAGE, 02 UNIVERSAL TRANSLATOR, 03 STONE COLD DRILLS, 04 FIRST CONTACT CARD, with dots.
- CRT-framed image `#fd-feat-img`, metric row.
- CTAs: "GET THE APP AT LAUNCH ↗" to `#access` and "START CLASSIFICATION" to `#quiz` (**dup**).
- Note: "Download intent starts here: ..."
- Background: `asset-bg-alien.webp` on `.fd-card` plus green/blue radials. Fixed at 92svh height. 93 words.

### 14. Intel briefings `section#intel-briefings` (l.2290-2295, all inline styles)
- Eyebrow: "// DECLASSIFIED BRIEFINGS //"
- Headline (a div, not an H2): "64 INTEL FILES.<br>FULL CONTEXT LOCKED."
- Copy: "Public files reveal the shape. ..."
- CTA: "OPEN INTEL ARCHIVE →" to /intel. 23 words.

### 15. Clearance path `section#clearance-ladder.clearance-ladder` (l.2298-2317)
- Eyebrow: "// CLEARANCE PATH //"
- H2: "Protocol is earned. *Layer by layer.*"
- Copy: "Every action increases clearance. You are not filling out a form. ..."
- Panel "CLEARANCE PATH 04":
  - 01 OPEN FILE COMPLETE
  - 02 RUN MICRO-SIM OPTIONAL
  - 03 FINISH ASSESSMENT REQUIRED
  - 04 CLAIM CARD LOCKED
- The states are static and never update from real progress.
- No CTA. 76 words. It explains the funnel after the funnel has already been presented.

### 16. First Contact event `section#fc-event` (l.2318-2335, inline styles)
- Eyebrow: "// LAUNCH DAY EVENT - CLASSIFIED //"
- H2: "On launch day,<br>*one slot remains open.*"
- Copy: "The FIRST CONTACT archetype has never been confirmed in the field. On launch day, the first civilian to achieve a perfect Readiness Score unlocks it permanently. It may never happen again."
- Box: "ARCHETYPE STATUS / ⭐ FIRST CONTACT / NEVER BEEN UNLOCKED · 0 CONFIRMED / SERIAL: FC-0000-00001".
- Line: "Log your frequency now. When the slot opens, you will be contacted."
- CTA: "CLAIM CARD →" to `#access` (**dup**).
- Gold radial background. 67 words.
- **Contradicts the quiz**, which can already award First Contact via the hidden sequence and hands every such visitor that same serial.

### 17. Inline social bar `div.inline-social-bar` (l.2336-2345)
"// STAY ON FREQUENCY // Intel drops before launch." with X, YouTube, TikTok and Instagram icons. **Duplicates the footer socials.**

### 18. Related files `section.related-files` (l.2346-2358)
- Eyebrow: "// RELATED CLASSIFIED FILES //"
- H2: "Open the archive.*Pick your next file.*"
- 4 cards:
  - FILE 01 Archetype Dossiers /archetypes
  - FILE 02 First Contact Briefing /first-contact
  - FILE 03 Readiness Protocol /readiness
  - FILE 04 Intel Archive /intel
- **Duplicates Archive Gateway (section 9).** 85 words.

### 19. Final transmission `section.share.final-transmission` (l.2359-2366)
- Eyebrow: "// FINAL TRANSMISSION //"
- H2: "Get classified. Claim the card. Send the packet."
- Copy: "If the signal window opens, arrive with a role instead of a reaction."
- CTAs: "START CLASSIFICATION" to `#quiz` and "CLAIM CARD" to `#access`.
- 27 words. Then `</main>`.

### 20. Footer (l.2371-2415)
- Eyebrow: "// TRANSMISSION CLOSED //"
- H2: "Stay on frequency.*Arrive classified.*"
- CTAs: "START CLASSIFICATION ↗" to #quiz and "CLAIM CARD" to #access (**third pair of the same two CTAs**).
- Nav: ARCHETYPE QUIZ /quiz, THE BRIEFING, READINESS, ARCHETYPES, FAQ, ABOUT, INTEL, PRIVACY, TERMS. All targets exist.
- Socials ×4.
- Status: "LIVE Signal file / 04 Archetypes / 99+ Briefed" (hardcoded).
- "DISCLOSURE // GETDISCLOSURE.APP".
- Binary easter egg: clicking it changes the text to "IT'S REAL".
- 59 words.

### 21. `#alert-pop` (l.2417-2421)
Timed toast "◉ NOTICE", closable. Details in section 3.

### Duplicated purposes, summarized
- **Quiz entry CTAs: 8.** Hero, evidence, rules, mission band, tools, final, footer (7 `href="#quiz"`), plus the species "REQUEST CLEARANCE" button.
- **Card-claim / #access CTAs: 6.** Command bridge, tools, fc-event, final, footer (5 `href="#access"`), plus the quiz result button. There is **one** actual email form, and it rejects anyone who has not finished the quiz, so 5 of these 6 CTAs send unclassified visitors into a dead end.
- **Share surfaces: 3.** Quiz result "SHARE MY ARCHETYPE", the gate success copy/share box, and the transmission packet (transmit/copy/X).
- **"What the app does" sections: 5.** Calm bridge, command bridge, readiness OS, field kit, clearance path. "The file/landing page classifies you. The app trains you." appears twice.
- **Link-hub sections: 2.** Archive gateway and related files, both routing to /archetypes and /intel.
- **Sim CTAs:** "RUN FIELD SIMULATION" ×2 and "ARM SHARE PACKET" ×2.
- **Social rows:** 2 (inline bar and footer).
- **Counters:** 3 (hero, gate stat, footer "99+").

---

## 3. JAVASCRIPT INVENTORY

| Lines | Block | Purpose |
|---|---|---|
| 1230-1245 | GA loader | gtag config G-XFFMNLNSXM, 4.5 s after load, skipped under webdriver |
| 1249-1262 | Share redirect | `?share=x` / `wa` / `fb` + `text` from card emails; `location.replace` to the Twitter intent, wa.me, or FB sharer |
| 2095-2148 | Species hangar IIFE | carousel, drag, keyboard, preview dialog |
| 2426-2460 | `scrambleText(el, finalText, durationMs, onDone)` | random-char reveal via rAF; respects reduced motion |
| 2462-2493 | Supabase | `SUPA_URL`, `SUPA_KEY`, `loadSupabaseClient`, `initSupa`, `ensureSupa` |
| 2494-2508 | `shuffleQuizOptions()` | Fisher-Yates reorder of the 4 option buttons in each of q1..q10 (DOM order only) |
| 2510-2535 | `runWhenIdle`, `scheduleCountLoad` | IO on `#access` with rootMargin 700px triggers `loadCount()`; fallback idle at 15 s. Runs shuffle + schedule on DOMContentLoaded |
| 2537-2564 | Location | `fetchLocation()` via ipapi.co (idle, 3.5 s), `updateGateHint()` |
| 2566-2613 | `ARCHETYPES` | 5 entries |
| 2615-2622 | Quiz state | `scores`, `answers[10]`, `currentArchetype`, `savedSerial`, `FC_SEQUENCE` |
| 2624-2665 | `retakeQuiz()` | reset (buggy, see 3b) |
| 2670-2679 | Section divider injector | prepends `.section-divider` to every `main > section` except the hero |
| 2681-2702 | `initQuizEntrance()` | IO at threshold .15 removes `quiz-content-hidden`, adds reveal/activated classes, 260 ms body glitch |
| 2704-2715 | `updateConfidenceMeter()` | |
| 2717-2736 | `updateIntensity(qNum)` | vignette v7-v10, shake at Q8+, red pulse at Q10 |
| 2738-2841 | `answer(qNum, optIdx, archetype)` | the answer handler |
| 2843-2875 | `spawnParticleBurst(color, count)` | |
| 2877-3000 | `showArchetypeResult()` | |
| 3002-3007 | `updateGateHintWithArchetype(data)` | |
| 3009-3036 | `getArchetypeShareMessage`, `shareArchetype` | |
| 3038-3046 | `generateSerial` | |
| 3048-3174 | `handleAccess(e)` | email capture + card render |
| 3176-3194 | `nativeShareArchetypeCard`, `copyShareText` | |
| 3196-3228 | `NAV_STATES`, `initNavScroll()` | |
| 3230-3260 | `initFCDetect` IIFE, `triggerFlagged()` | keyboard easter egg |
| 3262-3295 | Boot sequence | 8 lines, then `initPage()` |
| 3297-3310 | `initStars()` | 180 star divs on desktop, 72 on mobile at 700px or below |
| 3312-3407 | `craftCanvas` IIFE | **DEAD**: `#craft-canvas` does not exist, so it returns at l.3315 |
| 3409-3413 | `initCursor()` | |
| 3415-3442 | `setBriefedCount`, `fetchLifetimeBriefedCount`, `loadCount` | |
| 3444 | "Liaison Map Counter Tick" | empty leftover header |
| 3446-3464 | `initScrollReveal()` | |
| 3466-3477 | `initAlert()` | |
| 3479-3503 | `copyLink()`, `copyForward()` | **DEAD**: target ids `#copy-confirm` / `#fwd-confirm` do not exist, and nothing calls these |
| 3505-3855 | `initEyeScroll()` | hero canvas plus all hero text effects |
| 3857-3906 | `initCursorTrail()` | |
| 3908-3918 | `initPage()` | initCursor, initScrollReveal, initEyeScroll, initAlert, initNavScroll, loadCount, initCursorTrail, initQuizEntrance |
| 3920-4112 | Product showcase V6 IIFE | field kit slideshow |
| 4116-4335 | `initProtocolSimulator` IIFE | |
| 4338-4377 | Packet | `getPacketMessage`, `updateTransmissionPacket`, `copyPacketText`, `nativeSharePacket` |
| 4380-4441 | `initGsapPhaseOneFixed` | lazy GSAP choreography, `answer()` wrapper, `dxSpeciesChoreo`, `dxSpeciesPreviewChoreo` |

### (a) Hero scroll-driven frame canvas: `initEyeScroll()` l.3506-3855

- **Frames on disk:** `frames/f001.webp`..`f201.webp`, all 201 present. Each is 960×523, about 22-24 KB; the folder totals about 5.2 MB.
- **Setup:** `var TOTAL = 201;` (l.3511). `frames = new Array(TOTAL)`. `loadFrame(i)` sets `img.src = 'frames/f' + String(i + 1).padStart(3, '0') + '.webp'` (l.3565-3566). Errors resolve silently.
- **Initial batch (l.3571-3584):**
  ```js
  var initialCount = window.matchMedia && window.matchMedia('(max-width: 700px)').matches ? 1 : 4;
  ```
  After those resolve it calls `resize()`, then `drawFrame(0)`, then shows the scroll hint.
- **Remaining 197-200 frames (l.3587-3598):** `loadRemaining()` fires every request at once with no concurrency cap, via `window.addEventListener('scroll', loadRemaining, {once:true, passive:true})` and the same for `pointerdown`. The comment at l.3599 says there is deliberately no timer.
- **No `<link rel=preload>`** for f001, and `initEyeScroll` only runs from `initPage()` after the boot overlay (about 1.1 s). The first frame therefore cannot begin downloading until then.
- **`drawFrame(idx)` (l.3536-3553):** cover-fit `drawImage`. If the requested frame is missing it searches outward for the nearest loaded frame.
- **Canvas size:** `canvas.width = window.innerWidth` with no devicePixelRatio scaling, so a 960 px source is stretched to full viewport. Soft on retina and wide screens.
- **Scroll mapping (l.3758-3765):**
  ```js
  progress = clamp(-rect.top / (heroScroll.offsetHeight - innerHeight))
  targetFrame = progress * (TOTAL - 1)
  ```
- **Animation loop (l.3602-3610):** runs rAF forever and lerps `currentFrame += (target - current) * 0.12`, drawing only when the delta exceeds 0.5.
- **Hero is 500vh** (CSS l.203). Text layers (l.3613-3618), each with a 0.1 fade-out window after its fadeOut value:

  | Layer | fadeIn | peak | fadeOut |
  |---|---|---|---|
  | kicker | .04 | .12 | .30 |
  | title | .15 | .28 | .55 |
  | tagline | .35 | .48 | .70 |
  | cta | .55 | .65 | .88 |

- **Eye glow:** opacity = `sin(progress·π)·0.6`.
- **Reduced motion:** CSS l.955 sets `.hero-scroll{height:auto;min-height:100vh}`. `onScroll` then sees `scrollable <= 0` and returns at l.3761 before touching the layers, and the layers are `opacity:0` in CSS (l.209). **The result is a blank hero with no H1 and no CTA for reduced-motion users.**

### (b) Archetype QUIZ

**Markup:** each option is `<button class="q-opt" onclick="answer(Q, OPT, 'archetype')">`, where OPT is the original index 1-4. The order is always 1=sentinel, 2=diplomat, 3=scholar, 4=survivor. Options are shuffled in the DOM on load and on retake, but the onclick arguments keep the original index and archetype.

**Questions and options, verbatim (option → archetype):**

- **Q1** (l.1432) "The power cuts out. A green light hangs over the hills, too low to be a star. What do you do first?"
  1. Check the people closest to you and move them away from the windows. → sentinel
  2. Tell everyone to breathe and keep their voices down. → diplomat
  3. Note the time, direction, color, weather, and start recording. → scholar
  4. Put shoes on, grab keys, and make sure there is a way out. → survivor
- **Q2** (l.1443) "A dark object settles into the field behind the house. The air goes quiet. People start stepping outside."
  1. Stand at the edge of the group and keep everyone back. → sentinel
  2. Stay visible, keep your hands open, and speak in a calm voice. → diplomat
  3. Hold one steady filming position and mark the distance from the object. → scholar
  4. Move everyone toward solid cover and keep watching the exits. → survivor
- **Q3** (l.1454) "Your phone flickers on by itself. A map appears with one message: COME ALONE."
  1. Nobody goes alone. If anyone moves, they move with protection. → sentinel
  2. Answer with one simple line: We are here. We are calm. → diplomat
  3. Screenshot it, save the coordinates, and check if other phones got it too. → scholar
  4. Turn off location sharing. I am not walking into a trap. → survivor
- **Q4** (l.1465) "Your neighbor goes blank and starts walking toward the field like they heard their name called."
  1. Get in front of them and stop them before they reach the light. → sentinel
  2. Use their name and talk them back one step at a time. → diplomat
  3. Watch what changed right before they moved: sound, light, or eye contact. → scholar
  4. Tell everyone else to look away and move back now. → survivor
- **Q5** (l.1477) "A figure appears near the tree line. It is tall, still, and watching the group."
  1. Make yourself the closest person to it so the group is behind you. → sentinel
  2. Lower your shoulders, keep your hands visible, and give a slow greeting. → diplomat
  3. Study how it stands, how it reacts to movement, and whether it casts a shadow. → scholar
  4. Stay quiet, keep distance, and choose the route you would use if it moved. → survivor
- **Q6** (l.1488) "It places a small object on the ground between you and the field."
  1. Stop anyone from touching it until you know it is safe. → sentinel
  2. Nod to show you understand, but do not reach for it. → diplomat
  3. Record where it landed, what it looks like, and what changed around it. → scholar
  4. Back up. Gifts can still be bait, trackers, or contamination. → survivor
- **Q7** (l.1499) "A voice lands in your head, not your ears: WHO SPEAKS FOR YOU?"
  1. I do. No one here gets harmed while I am standing. → sentinel
  2. We are afraid, but we do not want conflict. → diplomat
  3. I give only facts: my name, the place, the date, and who is present. → scholar
  4. I do not answer yet. I ground myself and break the hold first. → survivor
- **Q8** (l.1510) "The crowd behind you starts to break. Some are filming, some are crying, and two people are about to run."
  1. Block the rush and give one clear order: stay behind me. → sentinel
  2. Give everyone a job: breathe, sit down, hold someone’s hand, stay quiet. → diplomat
  3. Ask one steady person to film wide while you track what the object does next. → scholar
  4. Clear a path out and get children, pets, and panicked people moving first. → survivor
- **Q9** (l.1521) "The object rises without sound. Wind hits hard. Dust, branches, and loose metal start flying."
  1. Get bodies low and shield anyone who cannot move fast enough. → sentinel
  2. Keep the group from chasing it or throwing anything at it. → diplomat
  3. Record the lift, direction, speed, and what the wind does to the ground. → scholar
  4. Drop behind the nearest solid cover and protect your eyes. → survivor
- **Q10** (l.1532) "By morning, officials and cameras are everywhere. They ask what happened."
  1. Give names of anyone injured, missing, or still in danger first. → sentinel
  2. Tell the truth plainly so people understand without panicking. → diplomat
  3. Hand over the timeline, recordings, and what you can prove versus guess. → scholar
  4. Protect your people’s names and location until you know who can be trusted. → survivor

Step labels read "QUESTION 0N OF 10".

**Scoring: `answer()` l.2739-2841**
- `answers[qNum-1] = optIdx; scores[archetype]++;` means one point per answer to the matching archetype. `scores['first-contact']` exists but is **never incremented**.
- Progress bar width is `qNum*10%`. Colours: green for Q1-3 (`tension-3`), amber for Q4-6 (`tension-7`), red for Q7-10 (`tension-9`, plus a card shake). Q7+ also calls `updateIntensity` (vignette v7..v10, section shake at Q8+, red pulse at Q10).
- Confidence meter (l.2705-2715): each bar is `score/10*100%`; the diplomat bar adds the unused first-contact score.
- Transition: a 420 ms delay for the "RESPONSE LOGGED" flash, then the next step. On mobile under 768 px there is a slide-out/slide-in (210 ms / 260 ms) and the next step's options stagger in at 50 ms each.
- **Bug, no answer lock:** buttons stay clickable during the 420 ms window. A double tap or a second click scores twice (possibly for two archetypes) and skews the result.
- **Bug, wrong button after shuffle:** the click flash uses `#qN .q-opt:nth-child(optIdx)` (l.2744), and so does the GSAP wrapper (l.4412). After the shuffle, the button that pulses or gets marked `q-opt-selected` is usually not the one clicked.

**Archetype computation: `showArchetypeResult()` l.2877-3000**
- Hidden First Contact check at **l.2887-2891** compares `answers[0..3]` against `FC_SEQUENCE` (const at **l.2622**). **The secret sequence is printed in plain text in a code comment at l.2621 and in the constant at l.2622**, so anyone who views source can read it.
  - The match is on original option index, which means answer content (one specific archetype's answer per question for Q1-Q4). Screen position does not matter.
  - If matched, Q5-Q10 are ignored and the result is `'first-contact'`.
  - Random uniform play hits it with probability 1/256 ≈ 0.39%. That contradicts the page's "<0.1%" anomaly figure.
- Otherwise (l.2897-2902):
  ```js
  let top = 'diplomat', topScore = -1;
  ['sentinel','diplomat','scholar','survivor'].forEach(a => { if (scores[a] > topScore) {...} });
  ```
  The comment says "ties go to diplomat", but with strict `>` in that iteration order **ties actually go to the first in the order sentinel > diplomat > scholar > survivor**. Ties are common with 10 answers across 4 buckets (for example 3/3/2/2).
- The keyboard easter egg (typing "FIRST CONTACT", l.3231-3246) only shows the "YOU HAVE BEEN FLAGGED." overlay for 2 s. It does **not** unlock the archetype.

**ARCHETYPES object (l.2567-2613):**
- sentinel: SENTINEL 🛡️, pct "Primary Protector designation.", desc "You are the protector. You move first. You assess the threat before anyone else does. When it happens, people will look to you."
- diplomat: DIPLOMAT 🤝, "De-escalation Lead designation.", "You are the de-escalator. Calm under pressure. You will be the one who prevents a first contact from becoming a last contact."
- scholar: SCHOLAR 🔬, "Field Analyst designation.", "You are the observer. You document. You analyze. Your records will be the only verifiable account that survives."
- survivor: SURVIVOR 🏃, "Self-Preservation Specialist designation.", "You read the exit before you read the room. When it happens, your family is behind you and moving. That's not cowardice - that's the most human response there is."
- first-contact: FIRST CONTACT ⭐, "Signal anomaly: no public civilian match. This designation should not be visible.", "This path is not issued. It appears. If it opened for you, the protocol is already watching."
- `serial_prefix` and `card_color` are unused. There is no `role` field, which matters for bug (h).

**Result rendering:**
- Hides all `.q-step` with **inline `style.display='none'`** (l.2881).
- `#qr-icon` is set; `#qr-name` runs `scrambleText` (700 ms) then a `stamp-in` class; `#qr-pct` gets pct (plus `fc-pct` for First Contact); `#qr-desc` gets desc.
- Primary CTA is relabelled "RECEIVE YOUR CREDENTIAL →" or "... ⭐".
- Calls `updateGateHintWithArchetype` ("ARCHETYPE DETECTED: NAME icon · SOURCE: CITY") and `updateTransmissionPacket`.
- Blackout overlay for 1.8 s, then a full-screen colour flash, a particle burst (35, or 45 for FC), a gold border pulse for FC, and result `slam-in`.
- **Bug:** `rawColors` (l.2965-2970) has no `survivor` key, so Survivor gets `background: undefined` on the flash and 'undefined' as the particle colour. `archetypeColors` (l.2959) is unused.
- References to `#share-forward-text` and `#share-x-bottom` (l.2941-2949) are dead: those elements do not exist.

**Retake: `retakeQuiz()` l.2625-2665.** It resets scores, answers, bar, meter and classes, re-adds `.active` to q1 and reshuffles. **Bug: it never clears the inline `display:none` that `showArchetypeResult` set on every `.q-step`**, so after a retake the quiz card is empty and the quiz is unusable until reload.

**Entrance:** `.quiz-content-hidden` keeps the eyebrow, H2, progress, meter and card at opacity 0 until `initQuizEntrance` fires. That only happens after the boot finishes, and if JS fails the quiz stays invisible.

### (c) EMAIL CAPTURE: `handleAccess(e)` l.3049-3174

- **Form:** `#gate-form` → `input#gate-email` (HTML5 `type=email required`, no other validation, no label, no consent checkbox) → `button#gate-submit-btn`.
- **Quiz gate (l.3053-3063):** if `!currentArchetype`:
  - the button text becomes "CLASSIFICATION REQUIRED", then after 2 s resets to **"SECURE POSITION"** (bug: the original label was "CLAIM APP ACCESS →")
  - `#quiz-gate-notice` shows for 5 s, then fades over 1 s
  - the page smooth-scrolls to `#quiz`
- **Submit path:**
  1. `btn.textContent = 'LOGGING FREQUENCY...'`, `btn.disabled = true`.
  2. `serial = generateSerial(archetype)` (l.3039-3046): `'DS-2026-' + String(Math.floor(Math.random()*99999)).padStart(5,'0')`. Random and non-unique, so collisions are possible. First Contact always gets the constant `'FC-0000-00001'`. The result is saved to `savedSerial`, then `updateTransmissionPacket(archetype, serial)` runs.
  3. `await ensureSupa()` lazy-loads supabase-js@2 UMD from jsDelivr and calls `createClient(SUPA_URL, SUPA_KEY)`.
     - `SUPA_URL = 'https://bexjbozbrhijtjombxkm.supabase.co'` (l.2463).
     - `SUPA_KEY` is the anon JWT hardcoded at **l.2465** (role anon; comment l.2464 says it is RLS-protected).
  4. RPC (l.3082-3086), not a direct table insert:
     ```js
     sb.rpc('join_waitlist', { p_email: email, p_archetype: archetype, p_serial: serial })
     ```
     If there is no error, a second RPC `sb.rpc('get_waitlist_count')` runs, and `civilianNum = cnt || data || null`.
     - All errors are swallowed (`catch(_){}`).
     - **The table is `waitlist`** per `schema.sql`: id uuid, email text UNIQUE NOT NULL, archetype, serial_number, readiness_score, readiness_label, created_at. RLS allows public insert and blocks select. `get_waitlist_count()` is SECURITY DEFINER count(*).
     - **`join_waitlist` is NOT defined anywhere in the repo** (schema.sql only has `get_waitlist_count`). It exists only in the live database, so its duplicate-email behaviour is unknown and needs pulling from Supabase before the rebuild.
  5. `/api/send-card` (l.3095-3099):
     ```js
     fetch('/api/send-card', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({ email, archetype, serial })
     })
     ```
     This is fire-and-forget (`.catch(()=>{})`) and is sent **regardless of whether the Supabase insert succeeded**, so duplicate submissions get re-emailed.
     - Server `api/send-card.js`: needs `RESEND_KEY`; 400 if any field is missing; sends via Resend from `Disclosure Protocol <team@getdisclosure.app>`; subject per archetype; List-Unsubscribe `https://getdisclosure.app?unsub=1`.
     - **The homepage has no `unsub` handler.**
     - CORS is `*` with no auth, rate limit or captcha, so it can be abused to send branded mail to arbitrary addresses.
- **Success UI:** always rendered, even if both calls failed.
  - `#access` gets `.gate-claimed`; the form and `#gate-note` are hidden.
  - `#gs-cleared-text`: "◉ CLEARANCE GRANTED", or "⭐ FIRST CONTACT CONFIRMED" (+`fc-cleared`).
  - `#gs-num`: `await fetchLifetimeBriefedCount()` (a third RPC call), then "YOU ARE CIVILIAN #N · NAME · CARD INCOMING". N is the total count, not the visitor's own row. Fallback: "ACCESS LOGGED · NAME · CARD INCOMING". `setBriefedCount(N)` then updates the hero and gate counters.
  - Card via the `CARD_RENDER` map (l.3130-3134):

    | Key | Class | Colour | Role | Stat 1 | Stat 2 | Bar | Status |
    |---|---|---|---|---|---|---|---|
    | sentinel | ac-s | red | PRIMARY PROTECTOR | THREAT READ ACTIVE | ROLE ONSET IMMEDIATE | READINESS 84% | 🔴 FIELD DEPLOYMENT: READY |
    | diplomat | ac-d | green | DE-ESCALATION LEAD | CONTACT IDX 11.4 kHz | PROTOCOL ALPHA-7 | CALM RATING 96% | 🟢 FIRST CONTACT: AUTHORIZED |
    | scholar | ac-sc | #60A5FA | FIELD ANALYST | OBS CLASS ALPHA | FIELD MODE PASSIVE RECORD | DATA INTEGRITY 91% | 🔵 DOCUMENTATION: ACTIVE |
    | first-contact | ac-fc | #FFD700 | NONSTANDARD CONTACT ASSET | FILE STATE BLACK CHANNEL | CLEARANCE SIGNAL-LOCKED | ANOMALY INDEX "<0.1%" (bar 0.1%) | ⭐ FILE BREACH: FIRST CONTACT PATH OPEN |

    **Bug: there is no `survivor` entry**, so Survivors get the Diplomat card (green, "DE-ESCALATION LEAD", "CALM RATING 96%").
  - `#gs-share-text` is set to `getArchetypeShareMessage(archetype)`. `#gate-success` is shown with `.sr`, then gets `.vis` after 50 ms.
- **There is no failure UI at all.** The button stays disabled, and a failed signup looks identical to a successful one.
- The success card mockup is hardcoded in markup at l.1592-1609 (the Sentinel defaults).

### (d) ipapi.co geolocation

`fetchLocation()` (l.2539-2556) runs through `runWhenIdle` with a 3.5 s delay. It fetches `https://ipapi.co/json/` and reads `city` (uppercased) and `region_code || country_code`. The city is displayed in:
1. `#nav-status-text` while nav state is 0: "LEAKED DOCUMENT · CITY, REGION · READING IN PROGRESS" (l.2549). When the visitor later scrolls back to state 0 it becomes "LEAKED DOCUMENT · CITY, REGION" without the suffix (l.3223), which is inconsistent.
2. Nav state 3 (scroll 80% or more): "OPERATIVE CITY - CLEARANCE PENDING" (l.3221).
3. `#gate-archetype-hint`: "SOURCE LOCATION: CITY · SIGNAL TRACED" (l.2562).
4. After the quiz: "ARCHETYPE DETECTED: NAME icon · SOURCE: CITY" (l.3005).

It fails silently. No consent is asked. The ipapi free tier has a daily cap.

### (e) Civilian counter

- **Real:** `get_waitlist_count()` RPC, which is count(*) of `waitlist`. It is loaded by `scheduleCountLoad` (IO near `#access`) **and** again by `loadCount()` inside `initPage()` (l.3915). That is two RPC calls per visit, plus one more after signup.
- It only renders when the count is above 0; otherwise the placeholder "-" stays in `#hero-count` / `#stat-count`.
- **Fake/static numbers elsewhere:**
  - Footer "99+ Briefed" is hardcoded (l.2405).
  - `initAlert()` (l.3467-3477) picks `count = Math.floor(Math.random()*80+1180)`, i.e. **a fabricated 1,180-1,259**, and rotates between "You are one of N civilians accessing this file right now." / "You have been on this frequency for 30 seconds. Pattern logged." / "Your connection origin has been identified. This is normal." It shows at **20 s** (the copy says 30), auto-hides after 7 s, and the markup default says "30 seconds" too.

### (f) Field simulation: `initProtocolSimulator` l.4117-4334

- Constants: `BEAT_SECONDS=10`, `FEEDBACK_HOLD_MS=2600`.
- Start state: calm 72, safety 68, evidence 41. Total clock = 60 s.
- Intro (`renderIntro`) text:
  - label "READY ROOM // FIELD SIMULATION LOCKED"
  - alert "SIX DECISIONS · TEN SECONDS EACH · STAY USEFUL"
  - scene "A normal night breaks in one second. Read the scene, make the call, keep people alive."
  - feedback "Start the simulation when you are ready. It will move fast."
- 6 beats (l.4138-4199), 3 options each, with calm/safety/evidence deltas and feedback. The "good" option is always listed first and **options are not shuffled**.
  1. 01:00 HOME BLACKOUT
  2. 00:50 PHONES FAIL
  3. 00:40 BACKYARD IMPACT
  4. 00:30 WINDOW STRIKE
  5. 00:20 SPEAKER VOICE (mentions "ALEXA", a trademark in copy)
  6. 00:10 WHITEOUT SWEEP
- Timeout: −10 calm, −12 safety, −4 evidence, feedback "You froze. ...".
- Grade = average of the three meters:
  - 82 or more: FIELD READY
  - 66 or more: UNSTABLE BUT USEFUL
  - 48 or more: PANIC LIABILITY
  - below that: CONTACT COMPROMISED
- At the end, "ARM SHARE PACKET" (`#sim-claim`) is revealed.
- Cursor spotlight via `--mx/--my` on hover devices.
- Nothing is persisted and nothing is tracked. The sim result is not passed into the quiz, card or packet.

### (g) Species hangar carousel: l.2096-2147

`species[]` has 6 entries: grey, reptilian, nordic, mantis, tall-white, anunnaki. Each carries:
- key, name, code (e.g. "TYPE-II RETRIEVAL CLASS"), threat
- colour: #9fd7ff, #ff4545, #ffd66b, #a474ff, #d8f0ff, #d6a84a
- hero/close/mask/overlay image paths
- intel URL (absolute `https://www.getdisclosure.app/intel/...`; all 6 targets exist)
- line, protocol, closePos

Behaviour:
- Rendering is 3D coverflow-style:
  - offset d: x = d·292 px, z = −|d|·135, rotation d·−24°, scale 1.22 / .82 / .58
  - mobile under 720 px: x = d·220, no z
- Controls: prev/next buttons, ArrowLeft/Right on the focused stage, pointer drag (threshold 34 px), tap on a side card to activate it, tap on the active card to open the preview.
- Pointer parallax `--mx/--my`.
- Dossier innerHTML: close-up image, h3, line, "PARTIAL PROTOCOL: ...", "OPEN FILE" link, "REQUEST CLEARANCE" (scrolls to quiz).
- Preview dialog: moved to body, Esc/arrows, click backdrop closes, sets body overflow hidden. **No focus trap and no focus return.**
- GSAP hooks: `dxSpeciesChoreo`, `dxSpeciesPreviewChoreo`.
- Sets `--sh-species` on `<html>`.

### (h) Share packet / copy / X

- `getArchetypeShareMessage(archetype)` (l.3010-3020) has 5 fixed messages, all ending in `getdisclosure.app`. The Sentinel and Diplomat ones end "Find your First Contact role before the signal picks you".
- `shareArchetype()` (quiz result): Web Share API with `{title:'DISCLOSURE classification', text, url:'https://getdisclosure.app'}`, falling back to a `window.open` Twitter intent with `#FirstContact #Disclosure`.
- Gate success: `copyShareText()` (clipboard with an execCommand fallback, shows `#gs-copied` for 3.2 s) and `nativeShareArchetypeCard()`.
- Packet (l.4339-4376): `getPacketMessage()` reads `#packet-text`; `copyPacketText()` shows `#packet-copied` for 1.8 s and has **no fallback**; `nativeSharePacket()`.
- **BUG, the packet never personalizes:** `updateTransmissionPacket` (l.4343) does `const data = archetype && window.ARCHETYPES ? ARCHETYPES[archetype] : null;`. `ARCHETYPES` is a top-level `const`, which is **not** a `window` property, so `data` is always null. The packet stays "SIGNAL PENDING / CLASSIFICATION NOT YET ISSUED", and the "POST ON X" href stays the generic message. It also reads `data.role`, which does not exist on ARCHETYPES.
- The top-of-body share redirect (l.1249-1262) handles `?share=x|wa|fb&text=` links coming from the card emails.

### (i) Cursor, trail, HUD, typewriter, boot, other effects

- **Boot (l.3263-3295):** 8 lines:
  1. "INTERCEPTED TRANSMISSION // SOURCE: [REDACTED]"
  2. "CASE FILE: UAP-CIVILIAN-001 - LEAKED 2026-02-19"
  3. "ORIGIN: 37°14'06"N 115°48'40"W // DUGWAY PROVING GROUND" (**factual mismatch**: those coordinates are Area 51 in Nevada; Dugway is in Utah)
  4. "CLASSIFICATION: TS/SCI - DOWNGRADED BY EXECUTIVE ORDER"
  5. "ARCHETYPE DATABASE: MIRRORED FROM INTERNAL SERVER"
  6. "ROUTING THROUGH PROXY..."
  7. "CHAIN OF CUSTODY BROKEN. YOU ARE NOW A WITNESS."
  8. "THIS DOCUMENT WILL NOT EXIST TOMORROW."

  Timing: 90 ms start, 70 ms per line for lines 1-6, 110 ms after lines 7-8, then a 140 ms hold and a 220-240 ms fade. **About 1.1 s of full-screen black before `initPage()`**, which delays the hero frames, reveals, quiz entrance and cursor.
- **Cursor ring** `initCursor()` (l.3410): an 18 px ring follows the mouse via transform. Hidden on touch/coarse pointers via CSS. The body cursor is crosshair.
- **Cursor trail** `initCursorTrail()` (l.3858-3906): desktop only; pool of 30 green 2 px particles; spawns when the mouse has moved at least 8 px; 0.6 s fade.
- **HUD** (l.3799-3813): opacity .25 while progress is between .03 and .9; signal bar has 10 blocks; decrypt % = progress·100.
- **Typewriter** `triggerTypewriter()` (l.3623-3673): 30 ms per character with a █ caret on the kicker, then a block-char scramble on the intercept line (25 ms ticks). Fires at progress .04.
- **Title** `triggerTitleStagger()`: scrambleText of "DISCLOSURE" over 850 ms at .15.
- **Tagline** `triggerTaglineReveal()`: word-by-word at 120 ms, then the sub fades and the `em` pulses green. Fires at .35.
- **CTA reticle** `triggerCTAReticle()`: brackets for 650 ms, then the button appears with `cta-pulse`. Fires at .55.
- **Stars:** 180 or 72 absolutely positioned divs with CSS twinkle.
- **Scroll reveal** `initScrollReveal()`: IO with threshold .01 and rootMargin −12%, sibling stagger at 90 ms. Force-visible on mobile for 4 sections.
- **Nav states** (l.3198-3203) by page scroll %: below 20 "LEAKED DOCUMENT · READING IN PROGRESS", below 50 "IDENTITY SCAN IN PROGRESS...", below 80 "ARCHETYPE CLASSIFICATION PENDING", else "OPERATIVE LOCATION - FILE ACCESSED".
- **Product showcase V6** (l.3921-4112): 4 features:

  | Feature | Headline | CRT top / bottom | Metric | Image |
  |---|---|---|---|---|
  | SIGNAL LANGUAGE | "Speak when words fail." | "REC ● 03.05.24 // CLASSIFIED" / "FEED: SURVEILLANCE-07" | GESTURE LOCK 94% | signal-language-v7 |
  | UNIVERSAL TRANSLATOR | "Broadcast a first hello." | "FREQ: 1420.405 MHz // ACTIVE" / "TX: HYDROGEN LINE BROADCAST" | SIGNAL SYNC 88% | universal-translator-v3 |
  | STONE COLD DRILLS | "Train the panic out." | "SUBJ: 0041 // BPM: 142 // STRESS: HIGH" / "PROTOCOL: ENDURANCE LEVEL 07" | COMPOSURE 72% | stone-cold-v3 |
  | FIRST CONTACT CARD | "Carry your clearance." | "CREDENTIAL: VERIFIED // ACTIVE" / "CLEARANCE: PENDING CLASSIFICATION" | CARD STATUS ISSUED | first-contact-card-v5 |

  The card feature's bullets claim "Apple Wallet and Google Wallet compatible". Each image has srcset 640/960/1280/2752w. Auto-advances every 10 s; a user click pauses it for 10 s. Sequence: glitch flash, scanline, label typed at 40 ms per character, staged reveal. Pointer tilt ±3.4/4.2°. `#fd-feat-tag` is referenced but absent (null-guarded).
- **GSAP phase** (l.4381-4440): hero HUD/nav/hint fade-in, eye glow yoyo, reticle rotation, `.signal-item` ScrollTrigger reveals, command/clearance/mission/fd rows, quiz-card entrance, and a wrap of `window.answer` that pulses the (wrong, post-shuffle) button and jiggles the card. `.packet-channel` is targeted but no longer exists.
- **Footer binary** (l.2411): click sets the text to "IT'S REAL".
- **Section divider injector** (l.2671-2679).

### (j) localStorage keys

**None.** There is no localStorage, sessionStorage or IndexedDB anywhere. The quiz result, serial and signup state are lost on reload, so a returning visitor must retake the quiz before the email form will accept them.

---

## 4. ASSET REFERENCES (all checked against disk)

| Reference | Where | Exists |
|---|---|---|
| logo-nav.webp | preload, nav | yes |
| og-image.jpg (1200×630) | OG/Twitter (absolute URL) | yes (og-image.png 1193×630, 1.1 MB, is also on disk but unused) |
| favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-96.png, apple-touch-icon.png, mstile-150x150.png, safari-pinned-tab.svg, site.webmanifest | head | yes |
| frames/f001.webp .. f201.webp | hero canvas (JS) | all 201 present, 960×523, ~5.2 MB |
| asset-bg-alien.webp | CSS `.fd-card` bg (l.390) | yes |
| asset-signal-language-v7{,-640,-960,-1280}.webp | field kit | yes |
| asset-universal-translator-v3{,-640,-960,-1280}.webp | field kit (JS) | yes |
| asset-stone-cold-v3{,-640,-960,-1280}.webp | field kit (JS) | yes |
| asset-first-contact-card-v5{,-640,-960,-1280}.webp | field kit (JS) | yes |
| assets/species-hangar/hangar-bg.webp | CSS hangar bg | yes |
| assets/species-hangar/{grey,reptilian,nordic,mantis,tall-white,anunnaki}-hero.webp | carousel + preview | yes (6) |
| assets/species-hangar/{...}-close.webp | dossier | yes (6) |
| assets/species-hangar/disclosure-{...}-depth-mask.png | carousel depth layer | yes (6) |
| assets/species-hangar/disclosure-overlay-{grey-dark, reptilian-transparent, nordic-transparent, mantis-dark, tall-white-transparent, anunnaki-transparent}.webp | atmosphere overlay | yes (6) |

- No `<video>` is referenced.
- Unreferenced on disk in the root: card-diplomat.png, card-first-contact.png, card-scholar.png, card-sentinel.png, species-01..06 jpgs, android-chrome PNGs (manifest), og-image.png, and in the hangar folder the `*-transparent.png` duplicates and `grey-transparent`/`mantis-transparent` webp variants.
- No missing assets were found.

---

## 5. NUMBERS AND CLAIMS

| Claim | Location | Status |
|---|---|---|
| "The only civilian alien encounter preparation app" | meta desc l.12, JSON-LD l.108 | superlative, unverifiable |
| "The first civilian alien first contact preparation platform" | JSON-LD l.70 | superlative |
| "6 documented non-human intelligences" | meta l.12 | "documented" is a factual-sounding framing |
| "10-question" quiz; archetypes list includes "rare First Contact" | JSON-LD l.84 | matches (10 Qs) |
| price 0 USD; OS "Web, iOS, Android" vs "Android, iOS" | JSON-LD | contradictory between blocks; app is pre-launch |
| 37°14'06"N 115°48'40"W | comment l.3, HUD l.1307, boot l.3266 | Area 51 coords, labelled "DUGWAY PROVING GROUND" in boot (wrong) |
| "LEAKED 2026-02-19" | boot l.3265 | fiction |
| "CASE FILE: UAP-CIVILIAN-001", "TS/SCI" | hero/boot | fiction |
| "[count] civilians briefed · lifetime total" | hero l.1346, gate l.1631 | **real** Supabase count, "-" until loaded |
| "Pre-launch iOS + Android field app." | hero l.1353 | honest status |
| "MAY 8, 2026 ... National Archives UAP bulk downloads went live" + source link | evidence l.1383 | real-world claim with citation; verify the date |
| FILE 01-04 | evidence | labels |
| "QUESTION 0N OF 10" | quiz | accurate |
| "Four types of people" | quiz H2 l.1413 | there are 5 outcomes (FC hidden) |
| "25% of civilians share this archetype" | quiz result default l.1547 | placeholder, overwritten by JS (a fake stat that is visible if JS lags) |
| READINESS 84% / CALM RATING 96% / DATA INTEGRITY 91% | card render, phone mockup | fixed per archetype, not measured |
| "11.4 kHz", "ALPHA-7" | diplomat card | fiction |
| ANOMALY INDEX "<0.1%" | FC card l.3133 | **false by the code's own maths**: random play hits FC at 1/256 ≈ 0.39% |
| "DS-2026-00000", "DS-2026-SIGNAL", "FC-0000-00001" | gate/packet/fc-event | FC serial is a constant shared by every FC visitor |
| "YOU ARE CIVILIAN #N" | gate success | N = total waitlist count, not the visitor's row |
| Sim meters 72/68/41, "07 SECONDS", "00:42", "11:47 PM" | sim markup | placeholders; JS resets the timer to 10 s beats, 60 s total |
| "SIX DECISIONS · TEN SECONDS EACH" | sim JS | accurate |
| Grade cut-offs 82/66/48 | sim JS | |
| "Ten seconds is not enough." | calm bridge | rhetoric |
| Phone bars 84/67/91/42% | command bridge | decorative |
| "Six non-human intelligence profiles", "06 ACTIVE" | species | accurate (6) |
| "CIVILIAN READINESS 05" | mission panel l.2202-2203 | **mismatch**: 4 rows |
| "Ten pressure decisions" | mission row | accurate |
| "04 FIELD TOOLS / 01 CARD / 24/7 READY" | tools strip | "24/7 READY" is filler |
| GESTURE LOCK 94%, SIGNAL SYNC 88%, COMPOSURE 72% | tools | decorative |
| "REC ● 03.05.24", "BPM: 142", "SUBJ: 0041" | tools CRT | fiction |
| "FREQ: 1420.405 MHz // HYDROGEN LINE" | tools | real physics (hydrogen line) |
| "Apple Wallet and Google Wallet compatible" | tools feature 4 | **unverified product claim** for an unreleased app |
| "64 INTEL FILES." | intel l.2292 | **accurate**: `intel/` has 64 article folders with index.html (67 entries minus index.html, images/, INTEL_DOCTRINE.md) |
| "CLEARANCE PATH 04" | clearance | accurate (4) |
| "one slot remains open", "never been confirmed", "NEVER BEEN UNLOCKED · 0 CONFIRMED", "It may never happen again." | fc-event | **contradicted** by the quiz, which awards FC now |
| "perfect Readiness Score" unlocks FC on launch day | fc-event | product promise, unverified |
| "04 Archetypes" | footer l.2404 | 4 public + 1 hidden; conflicts with the "rare First Contact" JSON-LD |
| "99+ Briefed" | footer l.2405 | **hardcoded**, disagrees with the live counter |
| "You are one of 1,180-1,259 civilians accessing this file right now." | alert l.3468-3472 | **fabricated random number** |
| "on this frequency for 30 seconds" | alert | fires at 20 s |
| "Most people will panic without a role." | hero sub | unsupported generalization |

---

## 6. COPY

- **Em dashes (—): 0** in the whole file, and no en dashes either.
- The spaced hyphen " - " is used as a dash substitute: 74 occurrences from `<body>` onward, including JS and comments.
- **Visible static ones:**
  - "// LEAKED DOCUMENT - UNAUTHORIZED DISTRIBUTION - DO NOT SHARE //"
  - "FILE ACCESSED - CLEARANCE PENDING" (hidden element)
  - "▶ CLASSIFICATION REQUIRED - COMPLETE THE ASSESSMENT ..."
  - "// CARD CLAIM - SECURE CHANNEL //"
  - "// LAUNCH DAY EVENT - CLASSIFIED //"
- **JS-rendered ones:**
  - Survivor desc "That's not cowardice - that's ..."
  - Boot lines 2 and 4
  - Nav "OPERATIVE LOCATION - FILE ACCESSED" and "OPERATIVE CITY - CLEARANCE PENDING"
- **Head:** the title, OG/Twitter titles and alts use " - ".
- Static visible body words: about 2,302.

**Distinct CTA labels (static markup) with counts:**
- GET CLASSIFIED → ×3
- CLAIM APP ACCESS → ×2 (plus JS states CLASSIFICATION REQUIRED / SECURE POSITION / LOGGING FREQUENCY...)
- START CLASSIFICATION ×2, plus START CLASSIFICATION ↗ ×1
- CLAIM CARD ×2, plus CLAIM CARD → ×1
- RUN FIELD SIMULATION ×2
- ARM SHARE PACKET ×2
- CLAIM YOUR FIRST CONTACT CARD → ×1 (JS renames it RECEIVE YOUR CREDENTIAL → / ⭐)
- ×1 each: REVIEW ALL DOSSIERS, SHARE MY ARCHETYPE, ↻ RETAKE ASSESSMENT, Review the civilian archetype dossiers →, START FIELD SIMULATION (JS: RESET SIMULATION / RUN IT AGAIN), SEE THE FIELD KIT →, TRANSMIT PACKET, COPY FIELD MESSAGE, POST ON X, UNLOCK YOUR PROTOCOL →, GET THE APP AT LAUNCH ↗, OPEN INTEL ARCHIVE →, Verify source
- Gate share: [ COPY ] and [ SHARE ]
- JS-built species buttons: OPEN FILE, REQUEST CLEARANCE
- Archive nodes: LOCKED PROTOCOLS, CLASSIFICATION FILES, SPECIES FILES, INTEL ARCHIVE
- Related cards: Archetype Dossiers, First Contact Briefing, Readiness Protocol, Intel Archive
- Nav: Briefing, Dossiers. Footer nav: 9 links.

In total there are about 25 distinct action labels on one page, and 5 different phrasings for "take the quiz": GET CLASSIFIED, START CLASSIFICATION, UNLOCK YOUR PROTOCOL, REQUEST CLEARANCE, and ARCHETYPE QUIZ in the footer.

---

## 7. BROKEN, DEAD, DUPLICATED

**Functional bugs (priority order):**
1. **Retake breaks the quiz.** Inline `display:none` on `.q-step` (l.2881) is never cleared by `retakeQuiz()` (l.2625), so q1 `.active` cannot override it.
2. **The transmission packet never personalizes.** `window.ARCHETYPES` is undefined because ARCHETYPES is a `const` (l.4344). The packet also reads a nonexistent `data.role`.
3. **Survivor has no card render** (the `CARD_RENDER` map has no survivor, l.3130-3134), so Survivors get the Diplomat card. Survivor is also missing from `rawColors` (l.2965), which breaks the flash and particles.
4. **Signup reports success on failure.** No error handling, Supabase errors are swallowed, and send-card fires even when the insert fails.
5. **No answer lock in the quiz.** A double click double-scores.
6. **Clicked-button feedback targets the wrong button** after the shuffle (nth-child by original index, l.2744 and l.4412).
7. **The tie-break comment is wrong.** "ties go to diplomat" (l.2897), but ties actually go to sentinel first.
8. **The First Contact secret is in plain-text source** (comment l.2621, const l.2622). The FC serial is a single constant for everyone. The FC event section says it has never been unlocked.
9. **Reduced-motion users get an empty hero.** Text layers stay at opacity 0 (l.209 CSS + early return l.3761).
10. **H1/CTA invisible at first paint for everyone.** The layers only fade in on scroll, and a ~1.1 s boot overlay sits in front.
11. **Gate button label resets to "SECURE POSITION"**, not "CLAIM APP ACCESS →" (l.3056).
12. **mask-icon `color="var(--crt-green)"` is invalid** (l.57).
13. **`join_waitlist` RPC is not in the repo** schema.sql.
14. **No state persistence.** A reload loses the classification, and the email gate then rejects the visitor.
15. **`copyPacketText` has no clipboard fallback** (unlike `copyShareText`).
16. **The email field has no `<label>`.** There is no consent, privacy link or CASL wording at the capture point. The List-Unsubscribe URL (`?unsub=1`) is unhandled.
17. **Species preview dialog** has no focus trap and no focus restore.
18. **Canvas ignores devicePixelRatio**, and the 960 px frames are upscaled to full viewport.
19. **The remaining 197-200 hero frames load all at once** on first scroll (~5 MB burst, no throttling).

**Dead JS:**
- `craftCanvas` IIFE (l.3313-3407, ~95 lines; the element was removed, per CSS comment l.156)
- `copyLink` and `copyForward` (l.3480-3503)
- `#share-forward-text` / `#share-x-bottom` refs (l.2941-2949)
- `#fd-feat-tag` ref (l.3929)
- `.packet-channel` GSAP target (l.4403)
- `archetypeColors` (l.2959)
- `scores['first-contact']` (never incremented)
- `serial_prefix` / `card_color` fields
- `enhFlags.transitionFlashDone` (no-op)
- the empty "Liaison Map Counter Tick" header (l.3444)
- `onclick="void(0)"` on the redaction spans (l.2180)

**Dead DOM:** `#hero-flash` (forced `display:none!important` at l.1206).

**Duplicate work:** `loadCount()` runs both in `initPage` and via `scheduleCountLoad`. Signup then calls `get_waitlist_count` twice more (l.3088 and l.3118).

**Dead CSS:** about 69 class selectors match nothing in the markup or JS. They are mostly leftovers from removed sections:
- `archetype-strip` id, `arch-cards-wrap`, `as-*` (8 classes)
- `moment*` (7), `mystery-card*` (4), `quiz-scan-*` (4)
- `share-forward*`, `share-pre`, `share-row`, `share-sub`
- `signal-body/-tag/-title`
- `sim-brief-rail`, `sim-car`, `sim-holo`, `sim-kicker`, `sim-primer`, `sim-proof`, `sim-sub`, `sim-ufo`
- `stm-*` (9, the old species threat matrix)
- `fd-content`, `fd-copy`, `fd-cta-h`, `fd-cta-urgency`, `fd-divider`, `fd-nav-sep`, `fd-premium-strip`
- `packet-channels`, `packet-tease`, `mission-row-wrap`, `gate-card`, `hero-scan-line`, `radar-sweep`, `scramble-char`, `evidence-redact`, `ac-laser`, `ac-mission`, `arch-card-bg`, `archive-actions`, `species-mobile-note`, `mythic`

(`v7`-`v10` look dead but are built dynamically by `updateIntensity`.) `var(--body)` is undefined.

**Override stacking:** the same selector is redefined many times, each layer winning with `!important` (1,894 in total):
- `.story-sim .sim-wrap-live` ×12, `.story-sim .sim-h` ×10
- `.command-item`, `.story-sim .sim-screen`, `.story-sim .sim-scene` ×9 each
- `.phone-vault`, `#classified-tools.fd-command-center`, `.sim-screen`, `.sh-stage`, `.sh-card`, `.sh-dossier` ×8 each
- Section backgrounds are defined three times: base (~l.900-1000), the "Premium accent doctrine" at l.1110-1160, and the "Atmosphere Doctrine v1" at l.1822-1856, which sits inside the species `<style>` and so applies page-wide.

The CSS is an append-only patch log ("Boss correction", "Mobile repair pass 2", "Final merge polish", "Mobile overlap kill switch", and so on), so the final visual state can only be worked out from the cascade, not from any one rule. Keyframe blocks repeat too (`50%` ×21 and `to` ×21 across 63 keyframes). A rebuild should treat the rendered page as the spec, not the CSS.

**Content duplication:** listed at the end of section 2. The biggest structural waste:
- 5 "what the app does" sections
- 2 link-hub sections
- 3 share surfaces
- 8 quiz CTAs and 6 claim CTAs against a single gated form
- the simulator sits *after* the email gate while its header says "Training unlocked."
- the archive gateway copy assumes "Your packet is armed" whether or not the visitor did anything

**Other:**
- `index.html.pre-enhancements` is in the deploy root and likely publicly reachable.
- `/quiz` exists as a separate page (the JSON-LD Quiz points there), so there are probably two quiz implementations to reconcile.
- The URL host is inconsistent (www canonical vs non-www OG and share URLs).

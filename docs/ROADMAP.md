# DISCLOSURE roadmap: from archive to the ultimate alien website (2026-09-28)

Evidence: docs/research-seo-gaps.md (live autocomplete and SERP study, 2026-09-28). No keyword volumes were available; every "demand" below is autocomplete-confirmed or marked unknown. Authorize the Ahrefs connector and re-run clusters A, B and D before locking the order.

## The shape (information architecture after this roadmap)

    /                       the eye, the record, the classification
    /archetypes/ + 5        The file: roles and dossiers
    /first-contact/ /readiness/ /quiz/        Protocol
    /intel/ + 6 category hubs + 64 files      Archive (live 2026-09-28)
    /record/                NEW  The Disclosure Ledger: every official event with a verdict label
    /record/pursue/ + 6     NEW  The 2026 Department of War file releases, one page each
    /cases/ + 18            NEW  Case files: Navy videos, Jellyfish, NJ drones, Ariel School...
    /tools/                 NEW  Sky identifier, watch planner, report builder, Drake calculator
    /people/ + 8            NEW  Who's who in disclosure, claims stated as claims
    /glossary/              NEW  80 to 120 terms, one line each, linked deeper

The nav gains one tab when /record/ and /tools/ exist: 01 The file, 02 Protocol, 03 Archive, 04 Record, 05 Tools (FAQ moves to the File drawer).

## The edge we build on

1. Verdict honesty. Eight tracker sites launched around PURSUE in 2026; none labels claims VERIFIED / PARTLY / FALSE AS WORDED. We already do, in docs/research-timeline.md.
2. The civilian's next step. Every other site stops at "here is a file" or "here is a light". We go identify, then drill, then log, then report.
3. The identity loop. The Iris Print and the roles give people something to carry and share.

## Wave 1: ship next (small, fast, highest intent)

| # | Page | Why now | Links in from |
|---|---|---|---|
| 1 | /intel/is-disclosure-day-real/: the Spielberg film set against the public record | "is disclosure day real" is in autocomplete and the film shares our name; interest decays as it ages | /first-contact/, disclosure-anxiety, what-would-first-contact-look-like |
| 2 | /record/pursue/ hub + one page per release (1 to 6) | "pursue ufo files", "ufo files release 6", "ufo files explained" in autocomplete; facts already verified | uap-records-collection, uap-disclosure-act-2026-timeline, aaro-explained |
| 3 | /record/ The Disclosure Ledger | the verdict column is the moat; seed data exists | Public record hub, home record section, nav |
| 4 | /intel/report-a-ufo-in-canada/ + the 2025 Canadian UFO Survey | Canadian autocomplete, 1,052 reports in 2025, Sky Canada gives a real reporting path | how-to-report-a-ufo-sighting, protocol hub |
| 5 | /glossary/ | cheap, feeds the link mesh and AI answers | every intel article (first mention of a term) |
| 6 | /intel/did-trump-sign-a-ufo-executive-order/ | the most common false claim in the niche; we hold the verified answer | timeline, aaro-explained |

## Wave 2: the tools (the "ultimate experience" layer)

| # | Tool | Data (honest, licensed) | Size |
|---|---|---|---|
| 7 | What did I just see? Time, place, direction and behaviour in; ranked candidates out (ISS, Starlink, satellite, Venus, Jupiter, aircraft, meteor, launch plume). Last bucket reads "no match in public data", never "UFO". Ends with Log it and Run the drill. | CelesTrak elements cached every 2 h as static JSON (their download policy), satellite.js and astronomy-engine in the browser, optional aircraft from adsb.lol (ODbL, attribution). Location never leaves the device. | M |
| 8 | Witness report builder: guided form to a clean PDF and text, with a "report strength" meter (folds in the credibility scorer), routes to NUFORC, MUFON, Canadian UFO Survey, Sky Canada, AMS. States plainly that AARO takes no civilian reports. | none stored, jsPDF in the browser, EXIF warning | S to M |
| 9 | Tonight from your town: ISS and Starlink passes, planets, moon phase | same stack as 7 | S to M |
| 10 | Drake equation + Kardashev gauge with share card | NASA Exoplanet Archive ranges | S |

Tools unlock a real loop: sighting, identify, drill, report, card. That is the product story for the app launch.

## Wave 3: depth (the archive becomes the reference)

| # | Set | Notes |
|---|---|---|
| 11 | /cases/ first six: Navy videos (Gimbal, GoFast, FLIR), Jellyfish, New Jersey drones 2024, Ariel School, Travis Walton, Shag Harbour | each has "explained / debunked / what happened" autocomplete; then Tehran 1976, Kecksburg, Stephenville, Aguadilla, Lubbock, Belgian wave, Westall, O'Hare, Malmstrom, Hessdalen, Falcon Lake, Betty and Barney Hill. A map and timeline view once 15 exist. Roswell, Phoenix, Rendlesham and Nimitz move under /cases/ with redirects. |
| 12 | /people/: Grusch, Elizondo, Fravor, Graves, Lazar, Loeb, Hynek, Vallee | name queries confirmed; claims as claims, public figures only |
| 13 | Science hub children: 3I/ATLAS and 'Oumuamua, the Wow! signal, Kardashev scale, Great Filter, technosignatures, the five observables, crash retrieval claims vs AARO | 3I/ATLAS has heavy "where is it now" demand |
| 14 | Species lore atlas over the 13 species files | origin of each piece of lore, first appearance in print, "lore, unverified" badge |

## Parked, and why

- Sightings map: NUFORC's terms forbid scraping and redistribution; only with a data licence from them.
- Full PURSUE file mirror: The Black Vault and three trackers already do it; we summarise and link.
- Live flight data from OpenSky: needs a written licence for commercial use.

## Rules every new page follows

docs/BUILD-BRIEF.md (honesty rails, voice, one ask), the kit in docs/SCROLL-SCORE.md, and the link law: 2+ inbound links from related pages at launch, a hub link up, sibling links across. Run scripts/dx-chrome.mjs, dx-categories.mjs, dx-evidence.mjs, dx-sitemap.mjs, dx-links.mjs and dx-check.mjs before any push.

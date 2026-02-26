# Disclosure Landing Page — Hero & Site Enhancements

## IMPORTANT: All changes go in index.html (single file app). Backup is at index.html.pre-enhancements.

## Current State
- 201 webp frames in /frames/ folder, scroll-driven canvas animation
- 500vh hero-scroll container with sticky hero
- 4 text layers choreographed to scroll % (kicker, title, tagline, CTA)
- Eye glow overlay, vignette, fade-bottom

## Enhancements to Implement (in order of priority)

### 1. Typewriter Effect on Case File Kicker (Layer 1)
When the kicker layer becomes visible (scroll 4-12%), instead of simple fade-in:
- The "CASE FILE: UAP-CIVILIAN-001..." text types in character by character with a blinking cursor
- Speed: ~30ms per character
- The "// LEAKED DOCUMENT..." line scrambles in (random chars like ▓█░ → real text)
- Only triggers ONCE (use a flag). Don't re-trigger on scroll back.

### 2. DISCLOSURE Title Letter Stagger (Layer 2)
When title layer appears (scroll 15-28%):
- Split "DISCLOSURE" into individual <span> per letter
- Each letter fades in with 50ms stagger delay
- Each letter has a brief individual glitch (random translateX shift) before settling
- Once all letters are in, the existing CSS glitch animation takes over normally
- Only triggers ONCE.

### 3. Word-by-Word Tagline Reveal (Layer 3)
When tagline appears (scroll 35-48%):
- "This file was not meant for you." reveals word by word with ~120ms between words
- "Your designation is already assigned." — the word "assigned" gets a green color pulse after appearing
- Only triggers ONCE.

### 4. CTA Signal Lock Animation (Layer 4)
When CTA appears (scroll 55-65%):
- Before the button appears, show a brief targeting reticle animation (CSS only, ~600ms)
- Reticle: 4 corner brackets that converge to center
- Then the CTA button fades in at the center of where the reticle locked
- Add subtle pulsing box-shadow on idle CTA (electromagnetic pulse feel)
- Only triggers ONCE.

### 5. Corner HUD Elements
Add fixed-position HUD overlays that appear ONLY during the hero scroll section:
- **Top-left:** `LAT: 37°14'06"N  LONG: 115°48'40"W` in mono, 9px, very low opacity (0.25)
  Below it: `SIGNAL: ████████░░` where the filled blocks increase with scroll %
- **Bottom-right:** `DECRYPTION: 0%` that counts up with scroll progress to `DECRYPTION: 100%`
- These fade out when hero section is done (progress > 0.9)
- z-index: 2 (same as hero-content)

### 6. Green Scan Line
- A single horizontal green line (1px, opacity 0.15) that sweeps from top to bottom of the canvas
- Position mapped to scroll progress (at 0% scroll = top, at 100% = bottom)
- Very subtle — just a thin green line slowly moving down as user scrolls
- CSS: position absolute, width 100%, height 1px, green background with box-shadow glow

### 7. Section Transition Flash
When scrolling OUT of the hero (progress > 0.92):
- Brief "FILE ACCESSED — CLEARANCE PENDING" flash text that appears centered for 1.5s then fades
- Only triggers ONCE (use a flag)
- Style: mono font, green, letter-spacing, centered on screen

### 8. CTA Electromagnetic Pulse
The hero CTA button ("READ THE BRIEFING →") should have:
- A subtle pulsing green box-shadow animation when idle
- Pulse rhythm: every 2 seconds, like a heartbeat/signal
- CSS keyframes, no JS needed

### 9. Cursor Particle Trail (SUBTLE)
- On mousemove, spawn tiny green dots (2px) at cursor position
- Each dot fades out over 600ms and drifts slightly downward
- Max 30 particles at a time (pool to avoid DOM bloat)
- Very low opacity (0.3 max) — this should be barely noticeable
- Desktop only (skip on mobile/touch devices)

## Rules
- Keep ALL existing functionality intact
- Comment each enhancement clearly with `/* ENHANCEMENT: [name] */`
- All "only once" flags should be at the top of initEyeScroll or in a shared object
- Performance matters: use requestAnimationFrame where needed, passive scroll listeners
- Mobile: skip cursor trail. Text effects should still work but can be simpler.
- Test mentally that scroll up/down doesn't break anything

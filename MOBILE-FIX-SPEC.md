# Mobile Responsive Fix Spec — Disclosure Landing Page

## Context
Single-file HTML landing page at `index.html` (3228 lines). Dark/green CRT-themed alien first contact site.
Deployed via Vercel at getdisclosure.app.

## Target: iPhone viewport (390x844)

## CONFIRMED ISSUES (from automated scan at 390px width)

### 1. Archetype Cards Overflow (CRITICAL)
- `.arch-cards-wrap` at line ~674 has `flex-wrap:nowrap; overflow-x:auto` at `max-width:700px`
- Cards are `flex:0 0 260px` (260px fixed) — 4 cards × 260px = 1040px, WAY beyond 390px viewport
- The horizontal scroll IS intentional (carousel), BUT the scroll container is not properly contained
- Cards overflow to right:564, 844, 1124 pixels — causing page-level horizontal scroll
- Fix: ensure the `.arch-cards-wrap` parent has `overflow:hidden` or the wrapper `max-width:100%`
- The `@media(max-width:480px)` rule on line 559 sets `min-width:100%` but this conflicts with the nowrap+carousel at 700px

### 2. Quiz Radar Ring Overflow
- `.quiz-radar` is 600px wide (see line ~340) — overflows on mobile
- Already has a `@media(max-width:600px)` rule setting it to 300px, but something may be wrong
- The `.quiz-containment` parent needs `overflow:hidden`

### 3. General Mobile Spacing/Sizing Audit Needed
- Check ALL sections render properly at 390px
- Check font sizes are readable
- Check no horizontal scroll on any section
- Check touch targets are minimum 44px
- Check images scale properly (especially in feature dial section)

### 4. Hero Section
- `.hero-h` is 80px at 390px (via clamp). Verify it's not too large and "DISCLOSURE" fits without overflow
- The `white-space:nowrap` on `.hero-h` could cause overflow if text is too wide

### 5. Feature Dial (`#freq-dial`)
- Already has mobile overrides at max-width:600px
- Verify images scale, text is readable, nav labels fit

### 6. Social Proof Section
- Archetype cards are IN this section — the main overflow source
- Ensure testimonials/stats above cards render properly

### 7. Access/Gate Section  
- Email input + button should stack vertically on mobile
- Already handled at 480px but verify at 390px

### 8. Footer
- Verify links wrap properly
- Social icons should be accessible

## APPROACH
1. Add `overflow-x:hidden` on the `body` and critical wrapper elements  
2. Fix archetype cards: at ≤480px, stack vertically (one card per row)
3. At 481-700px, keep the horizontal carousel but ensure container is properly bounded
4. Audit every section at 390px for overflow, readability, spacing
5. Test that no horizontal scrollbar appears on the page

## RULES
- ONLY edit `index.html`
- Do NOT change the visual design/colors/theme
- Do NOT remove any content or sections
- Preserve all animations and effects (they're already disabled on mobile via existing media queries)
- Keep all existing media queries — add/modify as needed
- Use `!important` sparingly — only when overriding inline styles
- Test by checking computed widths don't exceed 390px
- Commit with message: "fix: comprehensive mobile responsive fixes for 390px viewport"
- Push to origin/main after committing

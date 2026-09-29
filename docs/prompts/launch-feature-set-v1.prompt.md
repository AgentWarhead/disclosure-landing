# The launch feature set (2026-09-29)

Five images, one family, for the app's five launch features on the home page field kit.
Anchor: asset-crew-v1 (see asset-crew-v1.prompt.md). Every other member used asset-crew-v1-1280.webp as
a style reference only. Model for all: gpt_image_2_5, variant sunburst, 16:9, 2k, MEDIUM quality (the
set ships at medium to match the anchor). Encoded to 960:537 at full, 1280, 960 and 640 wide.
Credits: 175.01 before this set, 169.01 after (6 generations: 4 probes, 1 reroll, 1 re-plate).

Shared style line (verbatim, in every prompt): Image 1 is a style reference only: match its photoreal
night look, film grain, 35mm lens, near-black ground and coloured phone light on skin; do not copy its
people, field or composition. Shot on a full frame camera with a 35mm lens at night, true-to-life
proportions, natural anatomy, five fingers on every hand.
Shared exclusion: Exclude: text, letters, numbers, logos, user interface, overlays.

| File | Feature | Job | Notes |
|---|---|---|---|
| asset-classify-v1 | The Classification | 37537978-4f1b-4e05-a056-e519e44e2661 | first roll |
| asset-flinch-v1 | Don't Flinch | 9666928e-b232-4feb-9fed-4bb320c16b29 | reroll: the first (d19f93db) put a red recording light on the back of the phone and the moment was flat; the reroll names a hard green burst, a thrown shadow, and excludes indicator lights |
| asset-open-hand-v1 | The Open Hand | c6638b82-735d-40a3-b652-79066e98b08e | first roll |
| asset-card-v6 | First Contact Card | plate 11c86487-9f63-4c8d-bbfb-91d7f090d63f | product-in-the-world: the plate has a blank dim green screen; a REAL card render (api/card.js, Diplomat, DSC-K7M2-P9QX) is warped onto it by scratchpad card_composite.py. Gate: inverse-warp correlation 0.9855 against the source, shifted red control 0.5242. The first plate (5233e85b, white screen) was rejected: the white spill lit the hand and face brighter than a dark card screen can |

## Scene lines (the part that varies)

- Classification: an extreme close-up of one adult's eye and brow at night, lit from below by the green glow of a phone screen held just out of frame; sharp iris of green and gold fibres, a tiny reflection of the screen; the eye at about sixty percent of the width, the left third in darkness.
- Don't Flinch: a young man on a stool in a dark room at the moment a sudden intense green light floods in from the right, throwing his shadow on the back wall; eyes wide, jaw set, shoulders and hands flat on his knees perfectly still; a phone on a small tripod in the left foreground facing him, back to the viewer, its screen glow faint on his knees.
- The Open Hand: a young woman on a quiet street at night filming herself, phone at arm's length lighting her face green, the other hand raised beside her face, palm open, fingers together and straight, a small calm smile, dark houses and one distant street lamp.
- First Contact Card: a hand holds a phone upright facing the viewer in the centre; the screen flat, evenly lit dim deep green, nothing on it; faint green spill on the fingers and on the out-of-focus face behind; dark field, stars, a line of trees.

## asset-open-hand-v2 (2026-09-29)

Replaces v1 after Court 0 (second sitting): the sign rule puts the hand at chest height or lower, never raised at face height. An edit of p3 (job c6638b82) on gpt_image_2_5 sunburst medium, job 5fbaa3db-aa0d-48d2-a2ec-cfeb411c986c, changing only the free hand (to the middle of the chest, open, palm out) and naming everything that stays. 1 credit.

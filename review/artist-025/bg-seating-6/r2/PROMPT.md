# BG-SEATING-6 R2 generation record

- runId: `ART3-D1-BG-SEATING-6-20260802-R2`
- tool: built-in `image_gen`
- use case: `stylized-concept`
- status: `approved-by-user`
- output intent: isolated Gate-1 candidate plus non-approval context evidence

## Read-only references

1. `app/public/assets/core/customer/background-complete-r3-b1.png` — approved camera, doorway, walnut, amber/indigo lighting and style.
2. `app/public/assets/core/customer/service-table-complete-r1-b1.png` — approved counter material and actual foreground occlusion.
3. `app/public/assets/core/customer/d1-tsukioka-waiting-r2-b1.png` — approved seated-person scale and eye level.
4. `docs/terminal-guides/dispatches/2026-08-01-d1-s0-art-production-packets.md`, `BG-SEATING-6` — production contract.
5. R1 context preview — negative evidence only: reject tall dining-chair silhouettes, doorway obstruction and overscale backs.

## Generation prompt

```text
Use case: stylized-concept
Asset type: production game architecture alpha-cutout for SCR-SVC-CUSTOMERS, BG-SEATING-6 R2
Input images: Image 1 is the approved customer-room background and defines camera, central doorway, walnut palette, amber/indigo lighting, and handcrafted raster style only. Image 2 is the approved service counter and defines walnut material and the foreground occlusion edge only. Image 3 is the approved Tsukioka seated customer and defines seated-person scale and front eye level only. Do not copy or include the room, counter, or person.
Primary request: Generate EXACTLY SIX compact LOW-BACK Japanese yakitori counter-stool backrest modules, isolated as one wide architecture layer. These are not chairs. They are the tiny lumbar-height backs of counter stools, seen straight-on from the bartender/player side. A seated person's torso must cover most of one backrest.
Subject geometry: each of six components consists only of one shallow gently curved or softly arched walnut lumbar rail, optionally one very short inset slat below it, a minimal thin seat-edge hint, and extremely short support stubs that stop immediately. Backrest height must be much smaller than its width. No legs. No footrests. No ladder backs. No tall uprights. No dining-chair silhouette. No full stool body. Keep the six components separate and clearly countable.
Composition/framing: wide 16:9 source sheet on green. Exactly six components, equal size, equal baseline, evenly spaced center-to-center across the full width, matching future FHD centers near x 210, 510, 810, 1110, 1410, 1710. Each backrest should occupy less than half the gap to its neighbor and remain narrower than the seated torso in Image 3. Place the entire six-piece subject in one narrow horizontal band around the lower-middle of the source, with abundant green above and below. The final composition will show only these low backs roughly between FHD y=360 and y=500; everything below the approved counter top near y=500 will be hidden. Make the silhouettes low enough that the central doorway in Image 1 stays clearly readable above and between them. No element may rise toward the lanterns or upper doorway.
Style/medium: YS-HANDCRAFTED-NIGHT-v1 matching the approved references: pencil underdrawing, irregular dark-espresso ink, opaque gouache in 2–4 stepped value blocks, subtle paper grain, hand-placed stair-stepped/pixel-cluster edges, restrained highlights. Quiet low-contrast storybook finish; worn dark walnut/espresso with aged edges. Avoid smooth 3D, glossy PBR, photorealism, clean vector art, thick bright outline.
Lighting/mood: restrained warm amber rim from above/front matching Image 2, deep indigo ambient shadow, no self-glow. Characters remain the focal point.
Scene/backdrop: perfectly flat uniform solid #00ff00 chroma-key background only.
Background-removal requirements: one uniform #00ff00 color with no gradient, shadow, floor, horizon, reflection, texture, ambient variation, or green spill. No green anywhere in the subject. Crisp fully separated edges; generous empty green padding on all four sides.
Hard constraints: exactly six LOW lumbar backrest modules and no other object. No full chairs, no high backs, no tall legs, no ladder construction, no people or body parts, no room, wall, doorway, lantern, counter, countertop, food, dishes, tools, UI, text, symbols, numbers, watermark, logo, captions, guides, anchors, crop marks, concept panels, cast shadows, contact shadows, glow, or reflections.
```

## Post-process

The official helper used border auto-key, soft matte, transparent threshold `12`, opaque threshold `220` and despill.
No crop, color correction, generated-object edit or consumer binding was applied. The first R2 generation passed isolated and
actual-context inspection, so the permitted correction iteration was not used.

## Gate-1 approval

- status: `approved-by-user`
- date: `2026-08-03`
- basis: `사용자 응답: r2 승인`
- scope: `BG-SEATING-6 R2` Gate-1 only

This does not approve a consumer-screen final, Gate-2/3, finalizer, promotion, runtime registration or app binding.

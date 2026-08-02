# D1-TSUKIOKA-WAITING R3 furniture-free edit record

- runId: `ART3-D1-TSUKIOKA-FURNITURE-FREE-20260802-R3`
- tool: built-in `image_gen`
- use case: `precise-object-edit`
- status: `approved-by-user`
- edit target: approved R2 chroma source, read-only

## Edit prompt

```text
Use case: precise-object-edit
Asset type: D1-TSUKIOKA-WAITING R3 furniture-free production game character source
Input image: Image 1 is the ONLY edit target. Preserve the person from Image 1 exactly.
Primary request: CHANGE ONLY THE FURNITURE. Remove every pixel belonging to the wooden chair: both tall backrest posts visible behind the shoulders, all chair back/seat wood behind or between the legs, both armrests and side blocks, every chair support, all chair legs, every footrest or wooden furniture fragment. Replace each removed furniture region with the exact same perfectly uniform flat solid #ff00ff chroma as the surrounding background.
Critical identity invariants: preserve Tsukioka exactly as shown in Image 1—same elderly Japanese man's face, facial proportions, skin texture, wrinkles, gray swept hair, glasses, ears, expression, gaze, green cardigan, brown shirt, buttons, belt, trousers, socks, shoes, both hands, fingers, exact seated body pose, anatomy, limb angles, silhouette, canvas position, scale, pixel/ink/gouache texture, palette, lighting, highlights and shadows. Do not redraw, redesign, beautify, sharpen, smooth, recolor, relight, resize, crop, shift, rotate, mirror, or change any person pixel. Keep the character edge intact wherever the chair was behind him.
Expected result: the same single full-body seated man floating naturally in empty space on a flat magenta background. The empty-space seated pose is intentional; runtime stool and counter are separate layers.
Scene/backdrop: perfectly uniform flat #ff00ff over the entire background and every removed furniture region.
Chroma requirements: one exact flat #ff00ff background, no gradient, shadow, texture, floor, horizon, reflection, glow, residue, patch boundary, or color variation. Magenta is forbidden inside the person. Keep crisp pixel-cluster character edges fully separated from the chroma.
Hard exclusions: no replacement chair, no backrest, no posts, no seat, no arms, no stool, no cushion, no supports, no legs, no footrest, no floor, no cast/contact shadow, no prop, no food, no drink, no table, no room, no counter, no background scene, no UI, no text, no number, no symbol, no watermark, no extra person. Output exactly one person only.
```

## Chroma and deterministic normalization

The generated source was processed with the official helper using an explicit sampled key rather than auto-key inference:

```text
--key-color #f706f0 --auto-key none --soft-matte
--transparent-threshold 12 --opaque-threshold 220 --despill
```

The R3 furniture-free source alpha bounds are `251,207..692,1387`. The R2 furniture-inclusive source bounds were
`229,207..712,1387` and mapped to approved FHD `944,215..1227,905`. Applying that identical source-to-FHD transform
to the furniture-free body yields the no-drift R3 alpha bounds `957,215..1215,905` (`258×690`). This preserves the
approved height and source proportions instead of stretching the narrower furniture-free body to the old chair-inclusive width.

## Canonical person-space declaration

`D1-TSUKIOKA-WAITING R3` is the canonical adult-customer reference for future character canvas, fixed front camera,
apparent scale, eye line, seated body proportions, seat plane and counter occlusion. Future characters may vary naturally by
age and body type but must not look miniature/giant beside Tsukioka, change perspective, or use arbitrary crops. Furniture is
owned exclusively by `BG-SEATING-6`; character-layer furniture pixels must remain zero.

## Gate-1 approval

- status: `approved-by-user`
- date: `2026-08-02`
- basis: `사용자 응답: 승인`
- scope: `D1-TSUKIOKA-WAITING R3` furniture-free Gate-1 only

This does not approve `BG-SEATING-6 R2`, a final consumer screen, another Tsukioka state, Gate-2/3, finalizer,
promotion, runtime registration or app binding.

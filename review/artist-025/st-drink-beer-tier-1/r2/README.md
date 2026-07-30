# ST-DRINK-BEER-TIER-1 R2 — corrective candidate

- status: `user-review-pending; not-approved; not-runtime-eligible`
- stable asset ID / semantic owner: `ST-DRINK-BEER-TIER-1` / `artist-3.d1-drink-service-cleanup-customer-settlement`
- source master: `CM-DRINK-STATION-R1` (read-only topology, camera, and lighting reference)
- candidate: `assets/st-drink-beer-tier-1-r2.png`
- SHA-256: `186382dd67ebf58b93924bf22cfdd0ee6944340c644a3d99f23c2e5e1fca9a27`
- raster: `1920×1080` RGBA; alpha bounds exactly `(240,288,1152,528)`; visible chroma-key green `0`.

## Corrected reading

This is a compact bartender-side draft-beer fixture: dark-walnut counter plinth, fixed recessed black drip tray for the future glass, and an aged-brass upright tower on the right. The circular brass boss is empty for the later `MDL-BEER-LEVER`; the short fixed spout has no lever, beer, liquid, foam, or VFX. It deliberately does not duplicate R2's rear architecture, shelves, bottles, or room.

The fixed `SCR-SVC-DRINK / D1-drink-base / drink.station / single-lever-empty` contract is unchanged: `D1-DRINK-FIXED-V1`, FHD `(240,288,1152,528)`, 720 `(160,192,768,352)` from one logical canvas, `architecture z20`, over `BG-WORKSPACE-DRINK R2 z0`. The asset contains no DOM content, person/body part, serving tray, glass rack, food, UI, text, button, gauge, or background reconstruction.

## Consumer evidence

- FHD: `review/recomposition-st-drink-beer-tier-1-fhd-r2.png`, SHA-256 `fe800c54daba5112248ab65eadf01321de694f2be19ff2ffccbf0f112906bf90`
- 720: `review/recomposition-st-drink-beer-tier-1-hd-r2.png`, SHA-256 `05b8578cfe182e3bc267895143b19810f84c7d95e95bb0efa20ea70c5607c895`
- checkerboard, supplemental only: `review/review-st-drink-beer-tier-1-isolated-fhd-r2.png`, SHA-256 `4410a391db71c0b9db14e7ae6420dfbe4908db4f70fba5cfc6f8ba923e37cc36`

No completion, provenance, optimization, finalizer, runtime-handoff, approval flag, or catalog status was created. R1 remains rejected; R2 is the only active candidate.

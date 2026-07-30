# ST-DRINK-BEER-TIER-1 R1 — single candidate

- status: `rejected-by-user; not-approved; not-runtime-eligible`
- stable asset ID: `ST-DRINK-BEER-TIER-1`
- semantic owner: `artist-3.d1-drink-service-cleanup-customer-settlement`
- source master: `CM-DRINK-STATION-R1` (read-only spatial and lighting reference)
- candidate: `assets/st-drink-beer-tier-1-r1.png`
- SHA-256: `3c65ebfeb642591728add98c62df5152f8a33797e857a008c18d4c7bb8e8b55e`
- dimensions / alpha: `1920×1080` RGBA PNG; alpha bounds exactly `x=240, y=288, width=1152, height=528`; no visible chroma-key green remains.

## Fixed consumption contract

| field | value |
|---|---|
| screen / state / component | `SCR-SVC-DRINK` / `D1-drink-base` / `drink.station` |
| state variant | `single-lever-empty` |
| camera | `D1-DRINK-FIXED-V1` |
| FHD / 720 bounds | `(240,288,1152,528)` / `(160,192,768,352)` via the same logical `1920×1080` canvas |
| layer / z-order | `architecture` / `20` |
| background dependency | `BG-WORKSPACE-DRINK R2`, SHA-256 `a30b2d44635ba52eef5d5461d4ea9b86ea80a2ab12e47f5377b58279dddeafce`, z0 |

This candidate is rejected and must not be promoted. It incorrectly reads as a large industrial cabinet, duplicates a counter rather than a compact bartender-side fixture, and does not faithfully follow the read-only `CM-DRINK-STATION-R1` station topology. Its technical bounds remain recorded only for rejection traceability.

## Scope

Included: one fixed Tier-1 workstation body, fixed structural pipework, and empty future lever/glass mounts.

Excluded: `MDL-BEER-LEVER`, `MDL-BEER-GLASS`, liquid, beer, foam, VFX, food, tray, customer, person or body part, DOM/UI/text/numbers, and any background remake. There is no runtime registration or interaction data in this candidate.

## Review evidence

- isolated checkerboard FHD (supplemental): `review/review-st-drink-beer-tier-1-isolated-fhd-r1.png`, SHA-256 `d26ad7fc6e728c5323111e860b716d5db999a446708605ac36f4d4bf0bdc9af4`
- R2-background FHD consumer board: `review/recomposition-st-drink-beer-tier-1-fhd-r1.png`, SHA-256 `3beffc50762851513d0e90d182974c3bdc2f5286f18a640f8050649011640984`
- R2-background 720 consumer board: `review/recomposition-st-drink-beer-tier-1-hd-r1.png`, SHA-256 `434e9edd754098fa95791e12b233a781e3faffe40d12e8bc19b4d38617b6b2e4`

The earlier anchor-mismatch assembly is retained recoverably under `rejected/anchor-mismatch/` and is not approval evidence. This R1 is rejected and no longer submitted for approval. Do not create completion, provenance, optimization, finalizer, runtime-handoff, or catalog approval metadata for it.

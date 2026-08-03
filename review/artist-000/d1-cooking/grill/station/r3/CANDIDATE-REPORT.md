# `ST-GRILL-TIER-1` R3 growth progression draft

- runId: `ART1-GRILL-STATION-GROWTH-DRAFT-LAND-20260803-R6`
- stage / priority: `D1 / P0`
- owner: `Artist 1`
- semantic owner: `grill.station.base`
- status: `candidate`; user approval `pending`
- candidate against runtime revision: `R2`
- runtime registration allowed: `false`

This is a review-only 2×2 concept board for the `2 → 4 → 6 → 8` physical side-cover progression. It is not a runtime alpha source and does not supersede the approved R2 asset.

## Artifact

| File | Format | Bytes | SHA-256 |
|---|---|---:|---|
| `review/review-st-grill-tier-1-growth-draft-r3.png` | 1536×1024, 8-bit RGB PNG | 2,029,066 | `2da58e232b6a5ad6452188acad16320ba59796f3d7d6287b7c53bc3006cd271e` |

## Producer inspection

- Four variants in a clean 2×2 layout: pass.
- Empty grill only; no food, skewers, tools, UI, labels, numbers, logo or deliberate watermark: pass.
- Every variant uses one continuous square-grid grate with no divided cooking wells: pass.
- Exposed grate width increases from top-left to top-right to bottom-left to bottom-right, so the intended `2 → 4 → 6 → 8` review sequence is readable: pass as concept intent only; physical capacities were not metrically proven.
- Black iron, aged brass, warm wood and ember tone remain harmonious with R2: pass.
- Camera remains in the same shallow top-down/three-quarter family: pass with drift noted below.

## Visible defects and runtime blockers

- The board is RGB on a near-black backdrop, has no alpha, is 1536×1024 rather than FHD/720, and contains four variants. It cannot be used as a runtime asset.
- Charcoal and ember glow are baked into all four variants. Current semantic ownership keeps `ST-CHARCOAL-CORE` separate from `grill.station.base`.
- The total grill silhouette grows across the sequence and the lower row is visibly larger. The prompt's identical-scale, unchanged-R2-core-silhouette requirement is therefore only partially met.
- The side covers become proportionally narrower, but a literal retracting mechanism is not consistently legible; some of the progression comes from widening the entire body.
- Perspective and front-rail height drift slightly between rows.
- Fine anti-aliased/high-detail rendered texture is more 3D-like than the requested crisp handcrafted pixel clusters.
- Small glyph-like generation noise is visible on portions of the feet/front timber. It is not intended text but should be removed in any revision.

## Gate decision

The artifact passes only as a user-facing progression concept draft. It is ineligible for provenance/finalizer/optimizer/promotion/manifest/binding work. No alpha asset, standalone-raster report, runtime handoff, consumer recomposition, or app/docs/catalog change was produced.

Next gate: PM may present this exact SHA as one review candidate. If the user accepts the progression semantics, Artist 1 must create and separately validate a single-state FHD straight-alpha source under a new explicitly assigned task; this board itself must never be promoted.

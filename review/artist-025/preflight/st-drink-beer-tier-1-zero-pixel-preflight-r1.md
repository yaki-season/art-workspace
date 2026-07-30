# ST-DRINK-BEER-TIER-1 zero-pixel preflight R1

- status: `one-candidate-created; user-consumption-review-pending; no-runtime-metadata`
- stable asset ID: `ST-DRINK-BEER-TIER-1`
- semantic owner: `artist-3.d1-drink-service-cleanup-customer-settlement`
- source master: `CM-DRINK-STATION-R1` (read-only spatial/lighting reference only)
- approved background dependency: `BG-WORKSPACE-DRINK R2`, SHA-256 `a30b2d44635ba52eef5d5461d4ea9b86ea80a2ab12e47f5377b58279dddeafce`
- dependency handoff: `../bg-workspace-drink/r2/metadata/runtime-handoff.json`, `BG-WORKSPACE-DRINK@R2-B1`
- pixels generated: `1` (the single permitted R1 candidate; approval is still pending)

## Fixed Developer 2 consumption contract

| field | fixed value |
|---|---|
| screen / state / component | `SCR-SVC-DRINK` / `D1-drink-base` / `drink.station` |
| asset / state variant | `ST-DRINK-BEER-TIER-1` / `single-lever-empty` |
| camera | `D1-DRINK-FIXED-V1`, fixed side/down `16:9` contain |
| FHD visual bounds | `x=240, y=288, width=1152, height=528` |
| 720 visual bounds | `x=160, y=192, width=768, height=352` |
| layer / z-order | `architecture` / `20` |
| background | approved `BG-WORKSPACE-DRINK R2` at z0 |
| DOM | use the Developer 2 binding contract unchanged; no DOM/UI pixels are part of this asset |

The 720 bounds are the exact `2/3` contain consumption of the FHD bounds. There is no independent 720 crop or camera.

## Station topology and ground contact

The only proposed R1 subject is a fixed Tier-1 beer-workstation body inside the stated architecture bounds. It sits on the approved background's existing service-plane perspective, preserving the indoor-only rear wall continuity on both sides and leaving every pixel outside the station's layer to `BG-WORKSPACE-DRINK R2`.

- contact baseline proposal: the lower bounds edge, FHD `y=816` from `x=240..1392`; 720 `y=544` from `x=160..928`.
- perspective: use the fixed side/down camera; verticals and counter-plane recession must converge with the approved background, not introduce a new front-facing or top-down camera.
- station silhouette: its mechanical body, fixed housing, and non-interactive structural surfaces only. It must leave a readable empty mount for the future lever and a clear resting/placement zone for the future glass.
- DOM safety: FHD receipt rect `176,104,1568,144` and prepared-item rect `104,872,1712,168` remain DOM-owned; their 720 `2/3` rects remain unchanged. The station layer does not bake receipt, button, label, number, gauge, or prepared-item content.

## Proposed later-layer anchors — not runtime bindings

These are station-local composition anchors, not new runtime bindings. Developer 2's fixed later-layer contract now supplies the canonical glass `drink.glass / empty / (792,424,224,336) / z40` and lever `drink.lever / idle / (1152,432,176,184) / z42` visual bounds; the table derives their centers without creating a new ID, hit target, or binding.

| proposal | normalized within station bounds | FHD proposal | 720 proposal | later owner |
|---|---:|---:|---:|---|
| `leverMount` | `(0.8681, 0.4470)` | `(1240, 524)` | `(826.7, 349.3)` | `MDL-BEER-LEVER` visual-bounds center |
| `glassPlacementCenter` | `(0.5764, 0.5758)` | `(904, 592)` | `(602.7, 394.7)` | `MDL-BEER-GLASS` visual-bounds center |

Both points are station-local visual anchors, measured from the given bounds' top-left. They must remain visually clear but are not rendered, clickable, or encoded in this zero-pixel preflight.

## Included / excluded

Included after the promotion gate only:

- fixed Tier-1 drink workstation and machine body;
- structural details consistent with the approved indoor R2 camera, perspective, tone, and contact plane;
- clearly readable future lever and glass attachment/rest positions.

Excluded now and from the R1 station raster:

- `MDL-BEER-LEVER`, `MDL-BEER-GLASS`, `TEX-BEER-LIQUID`, `VFX-BEER-CORE`;
- beer, foam, overflow, finished drink, food, person, hand, arm, or other body part;
- DOM UI, button, text, number, receipt, customer, or hit target;
- a background remake or any change to R2 pixel, camera, z0, or DOM-safe contract;
- runtime registration, completion, provenance, optimization, finalizer, or runtime handoff.

## Developer 2 promotion result and remaining output-profile confirmations — 2 fields

Developer 2 reported `BG-WORKSPACE-DRINK` promotion success: overall/drink placeholders `34→33` and `4→3`, both D1 entry points clear the BG missing ID, `unboundApprovedIds=[]`, `contractAudit.valid=true`, and unit/FHD/720 verification passed. This authorizes exactly one R1 station candidate.

1. The delivered station raster's alpha/full-canvas treatment and any station-specific performance budget; the fixed contract supplies bounds but not this output profile.
2. Whether the proposed lower-edge contact baseline is the required station root/depth anchor, or the canonical root coordinate Developer 2 expects instead.

No DOM-safe rectangle, camera, screen ID, state ID, component ID, asset ID, bounds, layer, or z-order outside the fixed table is inferred.

## User gate and next single action

Developer 2 promotion criteria were met and the single permitted `ST-DRINK-BEER-TIER-1 R1` candidate has now been created at `../st-drink-beer-tier-1/r1/`. Its R2-background FHD and `1280×720` consumer review boards are the only approval evidence; the checkerboard review is supplemental. User approval remains required before completion/provenance, optimization/finalizer/runtime-handoff, or catalog approval changes.

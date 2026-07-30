# BG-WORKSPACE-DRINK spatial-inference / topology report R2

- report status: `pm-approved-topology-correction; user-final-consumption-approved; developer-2-promotion-pending`
- stable asset ID: `BG-WORKSPACE-DRINK`
- display semantic owner: `Artist 3 / D1-DRINK-SERVICE-CLEANUP-CUSTOMER-SETTLEMENT`
- contract semantic owner: `artist-3.d1-drink-service-cleanup-customer-settlement`
- source master: `CM-DRINK-STATION-R1`
- source file / SHA-256: `art-workspace/concept-masters/2026-07-26/06_drink-station-master.png` / `667e8f704c74f6515e1a401fc4e2e0981545226fb42ce3f6916e9624fa183ee2`
- source inspection: `1672×941` PNG; mixed concept master, read-only spatial/lighting source
- developer contract: Developer 2 task 007 `v1.1.0`; `app/src/assets/s0D1ArtBindingContract.js` `v1.0.0`

## Fixed binding contract

| field | confirmed value |
|---|---|
| screen / state / component | `SCR-SVC-DRINK` / `D1-drink-base` / `drink.scene` |
| asset / stateVariant | `BG-WORKSPACE-DRINK` / `base-empty-workspace` |
| camera | `D1-DRINK-FIXED-V1`: fixed `16:9`, `contain`; player eye `(0, 2.6, 12)`, look `(1.8, -1.4, -4.4)` |
| FHD visualBounds / interactionBounds | `0,0,1920,1080` / `none` |
| 720 visualBounds / interactionBounds | `0,0,1280,720` / `none` |
| layer / z-order | `background / 0` |
| receipt DOM safe rect, FHD / 720 | `176,104,1568,144` / `117,69,1045,96` |
| prepared-item DOM safe rect, FHD / 720 | `104,872,1712,168` / `69,581,1141,112` |
| body-part count | `0` |

The 720 values are the contract’s exact `2/3` reduction of the FHD logical canvas. They are not a separate crop, camera, or background variant.

## Source and contract comparison

`CM-DRINK-STATION-R1` supplies a compatible side/down workspace perspective, dark rear shelving, and warm brass-and-wood lighting. Its source-side left alley depth is a read-only spatial reference, not R2 output: PM-approved R2 instead resolves both sides as continuous interior timber wall, shelving, and storage depth with no exterior opening. Its mixed contents cannot be reused directly: it contains a staff figure and arms/hands, tower, lever, glasses, racks, trays, liquid/foam, food, UI, controls, text-like symbols, and progress indicators.

The contract requires this asset to be an opaque, full-frame `background` at z0, before `drink.station` (`ST-DRINK-BEER-TIER-1`, architecture z20), `drink.glass` (interactable z40), `drink.lever` (interactable z42), liquid state overlay z44, VFX z50, and DOM. This matches the R1 background-only separation with no conflict.

## Approved-topology proposal

Use the fixed `D1-DRINK-FIXED-V1` camera. The full-frame background contains only these rear-to-front static continuations:

1. Left interior timber wall, shelf recesses, and storage depth.
2. Rear timber wall, shelf recesses, bottles, framed wall ornament, and warm practical lights.
3. Right interior timber wall, shelving/storage depth, fixed posts, trim, and unoccupied rear counter/wall planes.
4. An empty workspace continuity plane behind future station layers, with no station silhouette or contact hardware baked into it.

Surfaces presently hidden by the source’s tower, rack, trays, glasses, and staff are restored only as rear architecture or empty workspace continuation. The receipt and prepared-item rectangles remain visually quiet background under DOM and must not contain baked controls or information.

## Included and excluded scope

Included: continuous indoor rear architecture on both sides, fixed wood/trim/shelving/storage/light structure, and empty workspace continuity. No exterior opening is included.

Excluded: tower, nozzle, lever, work station body, glass, rack, drip tray, completed tray, liquid, foam, overflow, finished product, food, VFX, all UI/icon/text/number/button/ring/gauge, every person, and every body part.

## Gate

PM approved the indoor-only topology correction on `2026-07-30`; the user then final-approved the R2 FHD/720 consumption screen. Completion → provenance → lossless optimization → finalizer → runtime-handoff are complete with no R2 pixel change. Highball-specific vessels and ingredients remain excluded from this D1 background and require their own later asset review. The sole remaining gate is Developer 2 promotion; `ST-DRINK-BEER-TIER-1` remains blocked until that cycle completes.

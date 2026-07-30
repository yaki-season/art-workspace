# BG-WORKSPACE-DRINK spatial-inference / topology report R1

- report status: `pending-user-approval`
- stable asset ID: `BG-WORKSPACE-DRINK`
- semantic owner: `Artist 3 / D1-DRINK-SERVICE-CLEANUP-CUSTOMER-SETTLEMENT`
- source master: `CM-DRINK-STATION-R1`
- source file: `art-workspace/concept-masters/2026-07-26/06_drink-station-master.png`
- source SHA-256: `667e8f704c74f6515e1a401fc4e2e0981545226fb42ce3f6916e9624fa183ee2`
- inspected source dimensions: `1672×941` PNG (16:9 계열)
- target screen unit: `SCR-SVC-DRINK` only. `SCR-SVC-HIGHBALL` is a later shell reuse and is not part of this D1 candidate.
- target delivery profile: `complete-layer`, opaque `1920×1080` FHD background, no runtime registration.

## Source observation

The source is a mixed concept master, not a reusable runtime background. It contains a side/down view of the drink workspace and the shared night-bar lighting, but it also contains all of the following:

- a rear staff figure and visible arms/hands at the right;
- active beer tower, lever, nozzle, drip tray, glass rack, active tilted glass, finished glasses, foam, overflow glass, and finished tray;
- receipt cards, navigation controls, progress/risk rings, choice controls, prepared-item dock, iconography, clock, pause, and other UI;
- food and drink item illustrations in the UI/prepared dock.

The source is therefore usable only as a read-only spatial and lighting reference. It cannot be cropped, promoted, or used directly as `BG-WORKSPACE-DRINK`.

## Proposed background-only topology

Camera: an independent, fixed side/down service view from the player-side drink work area toward the rear bar wall. It preserves the master’s warm brass-and-wood interior, the darker rear shelving, and the left-side night-alley opening; it does not show the player or a staff member.

Back-to-front order for the proposed complete layer:

1. Left night alley and its exterior depth, behind the bar opening.
2. Rear timber wall, shelving recesses, bottles, framed wall ornament, and warm practical lights.
3. Fixed architectural posts, trim, and unoccupied rear counter/wall surfaces.
4. Empty, non-interactive workspace ground only where it must visually continue beneath later station layers; no station body, tray, rack, or glass is baked into it.

The station contract is intentionally outside this candidate: `ST-DRINK-BEER-TIER-1` later supplies the tower/worktop contact architecture; `MDL-BEER-LEVER`, `MDL-BEER-GLASS`, `TEX-BEER-LIQUID`, and `VFX-BEER-CORE` later supply every dynamic pour state. The FHD background may restore rear-wall surfaces presently hidden by these objects, but must never restore them as objects in front of future station layers.

## Required continuations and occlusion rules

- Behind the center tower/nozzle region, the rear shelf, wall panels, and their warm low-intensity lighting continue as background architecture.
- Behind the right staff/automatic-production region, the rear wall and shelf depth continue, but no person, arm, hand, machine, active glass, or automated production cue remains.
- Behind glass racks, trays, and all glass states, only the fixed rear wall/counter-plane continuation is restored. Rack rails, tray outlines, and glass silhouettes remain transparent/absent for later assets.
- The bottom prepared dock and top receipt rail are DOM/UI zones; the background continues beneath them without baked cards, icons, text, numbers, rings, buttons, or gauges.

## Invariants

- `SCR-SVC-DRINK` stays a standalone cooking screen; no customer screen, customer seats, or player body is composited into it.
- The D1 source uses one lever/tower workflow, but neither tower nor lever belongs in this background candidate.
- Visual continuity uses the source’s side/down perspective, dark rear shelving, warm brass highlights, and left alley depth.
- The target is FHD `1920×1080`; `1280×720` is a contain-scaled consumption verification after approval, not a separately cropped art layout.
- All semantic text, counts, quality stamps, choices, clock, receipt rail, progress ring, risk indication, and accessibility UI remain DOM.

## Exclusions for this single candidate

No human body part, staff figure, hand, arm, player body, glass, lever, nozzle, beer tower, rack, drip tray, tray, liquid, foam, overflow, completed product, food, VFX, UI, text, numeral, icon, button, ring, gauge, or state indicator.

## FHD/720 and anchor assessment

- FHD source separation: feasible only as a newly completed background reconstruction; direct reuse/crop is not feasible because dynamic station, human, and UI content occlude required background surfaces.
- 720 consumption: feasible through the shared `1920×1080` logical canvas at `2/3` scale, subject to the developer-2 inventory/harness that is still pending.
- Alpha: target background is opaque (`alpha: none`); future station/model/VFX layers own transparency.
- Anchors: no new anchor values are inferred. Required `screenId/stateId/componentId/requiredAssetId/stateVariant/bounds/layer` values must arrive from developer-1 task 009 and developer-2 task 007 before handoff/recomposition.

## Approval gate

`CM-DRINK-STATION-R1` is `pending-user-review` in the topology registry. This report is a preflight proposal, not an approved spatial-inference schema record: `approvedForGeneration=false` and no image candidate has been generated. User approval of this topology and separation boundary is required before creating one body-free `1920×1080` complete-background R1 checkerboard/consumption candidate.

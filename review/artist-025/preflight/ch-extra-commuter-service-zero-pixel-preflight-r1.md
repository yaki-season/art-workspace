# CH-EXTRA-COMMUTER-SERVICE zero-pixel preflight R1

- status: `developer-1-v1.0.0-partially-received; awaiting-clip-and-semantic-addendum; no-pixels; no-candidate`
- stable asset ID: `CH-EXTRA-COMMUTER-SERVICE`
- semantic owner: `artist-3.d1-drink-service-cleanup-customer-settlement`
- known inventory identity: `SCR-SVC-CUSTOMERS` / `D1-extra-commuter` / `customers.actor.commuter`
- current inventory binding: `pending`
- pixel output / approval / runtime metadata: none

## Scope and semantic boundary

This asset is a **nameless commuter extra category**, not a named person. It may communicate only a general D1 service role—quick ordering and relief after receiving an item—through posture and ordinary commuter styling. It must not receive an individual name, fixed biography, unique relationship, order number, FIFO arrow, or any visual claim that a particular customer ordered first.

The later serving-screen reading remains: **shared prepared item → player-selected customer → that selected customer's outstanding order**. It must not depict a delivery queue or priority order.

## Known source contracts

| field | currently known value | status |
|---|---|---|
| screen / state / component | `SCR-SVC-CUSTOMERS` / `D1-extra-commuter` / `customers.actor.commuter` | inventory-known |
| asset / owner | `CH-EXTRA-COMMUTER-SERVICE` / `artist-3.d1-drink-service-cleanup-customer-settlement` | inventory-known |
| actor visual geometry | six-seat bounds, lower-centre pivot, FHD/720 conversion | Developer 1 `extra-actor-layout v1.0.0` received |
| actor composition | upper body only behind the counter; `LAYER_Z.actor=-6`; counter foreground `order=50` owns non-rectangular occlusion | Developer 1 `v1.0.0` received |
| click separation | raster visual-only; separate fully transparent `seatServe:<seatId>` raycast mesh; no button/hit/table/number baked into raster | Developer 1 `v1.0.0` received |
| common candidate clips | 16 clips in `ART-003`: `enter`, `considering`, `order-ready`, `waiting`, `urgent`, `receiving`, `tasting`, `eating`, `drinking`, `satisfied`, `disappointed`, `angry`, `mismatch`, `retry`, `checkout`, `leave` | baseline only; D1 state-to-clip mapping unconfirmed |
| unnamed commuter meaning | `ART-003` baseline says quick ordering and relief must be readable | Developer 1 versioned role meaning unconfirmed |

## Received Developer 1 v1.0.0 geometry audit

Source: `docs/terminal-guides/dispatches/2026-07-31-developer-1-artist-3-extra-actor-layout-v1.md`.

| seat | FHD bounds / pivot | 1280×720 bounds / pivot |
|---|---|---|
| `seat-01` | `(105.6,140.4,249.6,453.6)` / `(230.4,594)` | `(70.4,93.6,166.4,302.4)` / `(153.6,396)` |
| `seat-02` | `(389.76,140.4,249.6,453.6)` / `(514.56,594)` | `(259.84,93.6,166.4,302.4)` / `(343.04,396)` |
| `seat-03` | `(673.92,140.4,249.6,453.6)` / `(798.72,594)` | `(449.28,93.6,166.4,302.4)` / `(532.48,396)` |
| `seat-04` | `(958.08,140.4,249.6,453.6)` / `(1082.88,594)` | `(638.72,93.6,166.4,302.4)` / `(721.92,396)` |
| `seat-05` | `(1242.24,140.4,249.6,453.6)` / `(1367.04,594)` | `(828.16,93.6,166.4,302.4)` / `(911.36,396)` |
| `seat-06` | `(1526.4,140.4,249.6,453.6)` / `(1651.2,594)` | `(1017.6,93.6,166.4,302.4)` / `(1100.8,396)` |

The canonical `customerOcclusionLine` is `y=594` FHD / `y=396` at 720 (normalised `y=0.55`). It is a layout line, not a raster mask: the full-frame counter foreground alpha owns the irregular lower-body occlusion. All six visual anchors use the supplied lower-centre pivot at that line. The transparent hit mesh is `seatServe:<seatId>` with supplied normalized bounds `(centerX-0.07,0.13,0.14,0.52)`; it is wider than the raster and remains outside Artist 3's pixel scope.

`sceneLayout` currently contains a normalised `customerOcclusionLine` and seats, but those values are not a versioned Developer 1 asset contract for this actor. They are not inferred into this preflight.

## Required Developer 1 versioned input request

Developer 1 `extra-actor-layout v1.0.0` has answered geometry, anchor, occlusion, and raster/hit separation. The two missing fields are re-requested at `docs/terminal-guides/dispatches/2026-07-31-artist-3-d1-extra-actor-contract-addendum-request.md`:

1. exact commuter D1 runtime state-to-clip mapping, including whether all 16 baseline clips are consumed;
2. the versioned role-only meaning of a *nameless commuter*, including permitted visual behavior and exclusions from personal identity/backstory.

Until that addendum arrives, no clip subset or role meaning may be guessed.

## Explicit exclusions and gates

Excluded: `CH-EXTRA-SOLO-SERVICE`, all cleanup assets, settlement assets, service tray/plate work, customer-order DOM, numbers, order text, FIFO arrows, named identity, background/counter rebuilds, and runtime registration.

The next permitted action is Developer 1's versioned contract review. Only after that input **and** user approval of this preflight may Artist 3 create one commuter candidate. This preflight does not alter or unblock the frozen `ST-DRINK-BEER-TIER-1 R2` approval gate.

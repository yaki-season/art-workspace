# ST-DRINK-BEER-TIER-1 R2 correction brief — no pixels

- status: `research-applied; one-R2-candidate-generated; internal-consumption-review-passed; user-approval-not-requested-yet`
- asset / owner: `ST-DRINK-BEER-TIER-1` / `artist-3.d1-drink-service-cleanup-customer-settlement`
- fixed runtime contract: `SCR-SVC-DRINK` / `D1-drink-base` / `drink.station` / `single-lever-empty`; `D1-DRINK-FIXED-V1`; FHD `(240,288,1152,528)`; 720 `(160,192,768,352)`; `architecture z20`.

## Reference conclusion

The read-only `CM-DRINK-STATION-R1` is a bartender-side, countertop draft-beer workflow: a compact aged-brass upright tower, one tap/lever locus, a recessed black metal drip tray beneath the pour zone, and rear bottle shelving that belongs to the environment. The concept reference `docs/inbox/2.art-concept/07_beer_drink_station.png` supports that same physical logic: the visible fixed equipment is a small tap body and drip tray, while the lever, glass, beer, foam, and hand are dynamic or separate.

Independent izakaya reference research reaches the same conclusion: draft service occupies a compact counter footprint with a beer dispenser/tap and drip tray, while bottles and shelves are rear architecture rather than a duplicate station asset. The approval background R2 already supplies that indoor shelving and storage continuity.

## R2 topology to build

- a compact wood-and-aged-brass bartender-side station, not an industrial cabinet or a second full-width counter;
- one upright brass beer-tower body on the **right**, with a clearly empty circular mounting boss inside the canonical future lever bounds `(1152,432,176,184)`;
- one fixed recessed dark drip tray / glass landing zone centered under the future glass bounds `(792,424,224,336)`;
- only enough low timber plinth/counter edge to ground those two fixtures on R2's existing service plane; no new rear wall, shelf, bottle display, or room volume;
- style follows the source's hand-crafted pixel clusters, dark ink contour, worn walnut, aged brass, indigo shadow, and restrained amber highlights—not smooth PBR machinery.

## Hard exclusions

No lever, tap handle, nozzle-pour animation, glass, liquid, foam, spill, rack of glasses, serving tray, food, body/hand/customer, text/UI, button, gauge, background reconstruction, or runtime metadata. A fixed drip tray is part of the workstation body; it is not the later serving `tray` asset.

## Correction gate

R1 is user-rejected. One R2 corrective candidate was generated and internally inspected first against the source topology and then in the R2-background FHD/720 consumer boards. It remains unapproved. No approval or runtime pipeline metadata may be created before the user explicitly approves it.

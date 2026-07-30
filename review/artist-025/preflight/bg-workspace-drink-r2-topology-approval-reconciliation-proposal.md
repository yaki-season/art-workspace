# BG-WORKSPACE-DRINK R2 topology / approval reconciliation proposal

- proposal status: `resolved-by-pm-correction-and-user-final-consumption-approval`
- semantic owner: `Artist 3 / D1-DRINK-SERVICE-CLEANUP-CUSTOMER-SETTLEMENT`
- stable asset ID: `BG-WORKSPACE-DRINK`
- source master: `CM-DRINK-STATION-R1` (read-only spatial reference)
- R2 asset: `../bg-workspace-drink/r2/assets/bg-workspace-drink-r2.png`
- R2 SHA-256: `a30b2d44635ba52eef5d5461d4ea9b86ea80a2ab12e47f5377b58279dddeafce`

## Verified R2 delivery facts

`BG-WORKSPACE-DRINK R2` is an opaque `1920×1080` PNG.  The isolated FHD checkerboard review and the FHD/720 consumption reviews use the recorded R2 pixels (no independent 720 crop):

| artifact | SHA-256 | dimensions / alpha |
|---|---|---|
| R2 asset | `a30b2d44635ba52eef5d5461d4ea9b86ea80a2ab12e47f5377b58279dddeafce` | `1920×1080`, opaque |
| isolated checkerboard review | `9a2f361fe75d2ffda78d05cbf4ccd9180b4b76fc24cf938ced1469ffe3ca4e38` | `1920×1080`, opaque |
| FHD consumption review | `c6f2ca31ace91e7a3d5ded07fe464ff5b63c89eeeafa8287e2d43c742d93789c` | `1920×1080`, opaque |
| 720 consumption review | `fbc5649efb36bd1e397e5f86b6605e7d443ac319de22af3d4056b0d00404b87e` | `1280×720`, opaque |

File metadata plus isolated/consumption-screen visual review reconfirm: `body=0`, `UI=0`, `station=0`.  In particular, there is no person or body part; no tower, lever, glass, rack, tray, liquid, foam, or VFX; and no baked UI, text, number, button, ring, or gauge.

## One proposed topology correction

The currently approved `CM-DRINK-STATION-R1` registry record says `left-night-alley-depth-and-rear-architecture`.  Its R2 spatial report repeats that former source inference.  This is incompatible with the approved R2 pixels and R2 README: the former left exterior alley and ambiguous right bay were both replaced by continuous interior timber walls, shelves, storage recesses, and warm practical lighting; no exterior opening remains on either side of the central timber division.

| record | current, inconsistent wording | proposed R2-aligned wording |
|---|---|---|
| registry `spatialOrder` | `left-night-alley-depth-and-rear-architecture` | `left-interior-wall-shelving-and-storage-depth` |
| R2 topology/spatial evidence | left alley depth / exterior relation | continuous indoor rear architecture and empty workspace on both sides; no exterior opening |

On confirmation, this is a documentation-only correction.  It does **not** change R2 pixels, `screenUnits`, `D1-DRINK-FIXED-V1`, full-frame z0 bounds, DOM safe rectangles, or the later station/interactable ordering.  The permitted edits are limited to Artist 3's `CM-DRINK-STATION-R1` record in `art-workspace/pipeline/topology-registry.json`, this R2 topology evidence, and the matching Artist 3 catalog wording.  No Artist 2 entry, app contract, resolver, manifest, or read-only review area is touched.

## Approval-evidence normalization proposal

The R2 README currently combines `user-confirmed-final-visual` with a next gate requiring final consumption-screen approval.  Those statements cannot both serve as the sole final-approval evidence while the registered topology still describes a left exterior alley.

Historical pre-confirmation evidence state (resolved on `2026-07-30`):

- topology: `needs-reconciliation` (the user-directed indoor-only R2 visual exists, but registry/evidence wording is stale);
- visual candidate: `user-confirmed` for R2's indoor-only composition;
- runtime/final approval: `not-established`; `runtimeRegistrationAllowed=false`;
- prohibited outputs: approval flag, completion, provenance, optimization, finalizer, and runtime handoff.

PM confirmed the indoor-only correction, README was normalized, and the user then gave one explicit final consumption-screen approval against the corrected record. This is the sole dated approval basis for the delivery chain.

## Post-confirmation gate (no pixel change)

Completion → provenance → lossless optimization → finalizer → runtime-handoff are now recorded. The valid package is handed to Developer 2 for task 003 v1.3.0 / dashboard v2.1.102 promotion:

1. promotion dry-run;
2. one-time receipt validation for handoff, bundle, and manifest consistency;
3. explicit receipt `--write`;
4. exact gameplay binding;
5. verify placeholders `34→33` overall and `4→3` drink;
6. remove `BG-WORKSPACE-DRINK` from both D1 entry points' `data-missing-asset-ids`;
7. retain no `unboundApprovedIds` and `contract audit: valid`.

`ST-DRINK-BEER-TIER-1` remains blocked until this entire BG cycle, including Developer 2 promotion, completes.

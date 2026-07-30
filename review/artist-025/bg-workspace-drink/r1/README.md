# BG-WORKSPACE-DRINK R1 — isolated candidate review

- status: `pending-user-review`
- stable asset ID: `BG-WORKSPACE-DRINK`
- profile: `complete-layer`
- semantic owner: `Artist 3 / D1-DRINK-SERVICE-CLEANUP-CUSTOMER-SETTLEMENT`
- contract owner: `artist-3.d1-drink-service-cleanup-customer-settlement`
- source master: `CM-DRINK-STATION-R1`
- approved topology: `../../preflight/bg-workspace-drink-spatial-inference-topology-r2.md`
- approved spatial inference: `../../preflight/bg-workspace-drink-spatial-inference-r2.json`

## Candidate

- asset: `assets/bg-workspace-drink-r1.png`
- SHA-256: `e51dee5e5a7e00d3f4a3f8ab18178a16553755535cfdf70606e6bccf3209e3f3`
- dimensions / alpha: opaque PNG, `1920×1080`, `alpha: none`
- source method: built-in image generation, then only a non-cropping resize from the generated `1672×941` 16:9 source to the contract FHD canvas.

## Included / excluded

Included only: left night-alley depth, rear timber wall, shelving recesses, subdued bottle silhouettes, trim, practical lights, and empty workspace continuity.

Excluded: staff/player/customer and all body parts; tower, nozzle, lever, station body, glass, rack, tray, drip tray; liquid, foam, overflow, finished product, food, VFX; UI, text, number, icon, button, ring, gauge, and watermark.

## Isolated and consumption verification

- checkerboard review: `review/review-bg-workspace-drink-isolated-fhd-r1.png`, SHA-256 `cd86e062e79347404e97d35a8f5eab8b8c8ef9977607f6e6224965f36012ee66`. The opaque candidate covers the checkerboard fully, as required for a complete background.
- FHD harness: `review/recomposition-bg-workspace-drink-fhd-r1.png`; camera `D1-DRINK-FIXED-V1`, asset rect `0,0,1920,1080`, interaction bounds `none`, receipt DOM safe rect `176,104,1568,144`.
- 720 harness: `review/recomposition-bg-workspace-drink-hd-r1.png`; same camera and logical canvas at `2/3 contain`, asset rect `0,0,1280,720`, interaction bounds `none`, receipt DOM safe rect `117,69,1045,96`.
- The prepared-item DOM safe rect remains reserved at FHD `104,872,1712,168` and 720 `69,581,1141,112`; it is not baked into the raster.

## Gate

This is the sole `BG-WORKSPACE-DRINK` R1 candidate. It is not user-approved as an image, is not optimized, and has no provenance/completion/finalizer/runtime handoff. Do not create `ST-DRINK-BEER-TIER-1` or any later drink asset until the user approves or rejects this candidate.

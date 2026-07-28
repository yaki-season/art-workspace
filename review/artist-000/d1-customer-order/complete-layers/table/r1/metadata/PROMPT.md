# Generation prompt record

Built-in imagegen was used once as a **background-extraction edit**. The user-approved Artist 009
customer screen was the reference image. It was used to reconstruct only the opaque table regions
hidden behind customers and dynamic order objects; it was not used to generate another full screen.

> Extract and reconstruct only the actual long wooden service table visible in the approved reference. Preserve its fixed frontal FHD camera, full-width span, tabletop perspective, edge thickness, dark vertical front panel, warm aged wood grain, restrained amber/brass highlights, dark ink pixel outlines, and pixel density. Remove every dynamic or non-table element: customers, hands, chairs, food, drinks, glasses, plates, trays, mats, camera, notes, matches, lights, doorway, alley, walls, UI, text, icons, gauges, and buttons. Put the one complete empty table on a perfectly uniform #00ff00 chroma-key background with no shadow, gradient, floor, reflection, or other scene.

Post-process: exact `#00ff00` chroma removal with soft matte and despill; alpha bounding-box crop;
nearest-neighbor FHD normalization; placement at the source table coordinate (`y=495`); low-alpha
fringe cleanup below alpha 12; isolated checkerboard review render.

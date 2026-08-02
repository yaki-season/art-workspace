# D1-TSUKIOKA-PARTIAL-BEER-WAITING R2 edit record

- runId: `ART3-D1-TSUKIOKA-PARTIAL-BEER-FURNITURE-FREE-20260802-R2`
- tool: built-in `image_gen`
- mode: `precise-object-edit`
- status: `pending-user-review`

Image 1 was the R1 partial-beer chroma edit target. Image 2 was approved furniture-free waiting R3, used only as the
canonical identity/camera/person-scale reference.

The edit instruction was to change only furniture: remove every chair backrest, post, seat, arm, support, leg and footrest
pixel and replace those regions with flat magenta. Tsukioka's face, gray hair, glasses, cardigan, shirt, trousers, shoes,
seated anatomy, lighting and pixel/ink/gouache texture had to remain unchanged. The state had to preserve exactly one upright
amber draft-beer mug with cream foam held at chest height in one hand, away from his mouth, while the other hand remained
empty. No negima, food, replacement furniture, floor/shadow, scene, counter, table, UI, text or watermark was allowed.

The generated chroma source was processed with the official helper using explicitly sampled key `#f107e6`,
`--auto-key none`, soft matte, transparent threshold `12`, opaque threshold `220` and despill. The furniture-free source
bbox `243,210..687,1390` was normalized with waiting R3's canonical scale to FHD `952,215..1212,905` (`260×690`),
correcting the edit model's +3 source-pixel vertical drift. No self-correction generation call was required.

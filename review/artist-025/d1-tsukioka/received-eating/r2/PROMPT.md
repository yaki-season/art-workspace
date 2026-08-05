# D1-TSUKIOKA-RECEIVED-EATING R2 furniture-free edit record

- runId: `ART3-D1-TSUKIOKA-RECEIVED-EATING-FURNITURE-FREE-20260803-R2`
- tool: built-in `image_gen`
- mode: `precise-object-edit`
- status: `approved-by-user`

Two separate built-in edit calls were used, one per frame. Each R1 chroma source was the only edit target for its call.
The request changed only furniture: remove every chair backrest, post, seat, arm, support, leg and footrest pixel and fill
those areas with the same flat magenta background. Tsukioka's identity, seated anatomy, frame-specific pose, palette,
lighting and pixel/ink/gouache texture were locked.

Frame A preserved exactly one negima skewer near/in the mouth in an active bite pose and forbade beer or other food/drink.
Frame B preserved exactly one amber draft-beer mug with cream foam at the lips in an active sip pose and forbade negima or
other food. Both prompts excluded replacement furniture, floor/shadow, scene, counter/table, other people, UI, text and
watermarks.

The generated backgrounds were removed with the official helper using explicitly sampled keys: `#ea0ae4` for eat-negima
and `#e70ae0` for drink-draft-beer, `--auto-key none`, soft matte, thresholds `12/220`, and despill. Each full
human-plus-action-prop crop was normalized to canonical FHD height `690`, top `y=215`, center `x=1086` using nearest-neighbor.
No correction image-generation call was required for either frame.

## Gate-1 approval

- status: `approved-by-user`
- date: `2026-08-03`
- basis: `사용자 응답: 승인`
- scope: `D1-TSUKIOKA-RECEIVED-EATING R2` two-frame furniture-free bundle only

This does not approve `BG-SEATING-6 R2`, a consumer-screen final, Gate-2/3, finalizer, promotion, runtime registration
or app binding.

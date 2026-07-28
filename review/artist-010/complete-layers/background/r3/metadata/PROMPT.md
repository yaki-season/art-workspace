# Artist 010 background complete R3 편집 프롬프트

- use case: `precise-object-edit`
- asset type: `YAKI SEASON customer-service complete background layer`
- source master: `CM-CUSTOMER-SERVICE-R1`
- spatial inference:
  `art-workspace/review/artist-010/preflight/background-spatial-inference.json`
- spatial inference SHA-256:
  `203dca117f43f25bb8f57be51cee962cd00839bbb9733069184caafa61aba7cc`
- generation unit: `background complete 한 장`

## 입력 이미지 역할

1. `art-workspace/review/artist-010/complete-layers/background/r2/background-complete-fhd-r2.png`
   - edit target
   - 천장·바닥·조명·색·수작업 픽셀 질감·고정 카메라는 유지한다.
   - 여러 개방 bay인 후면 구조만 중앙 단일 대문과 막힌 좌우 벽으로 수정한다.

## 최종 프롬프트

```text
Use case: precise-object-edit
Asset type: complete 2D game background layer for YAKI SEASON customer-service and post-closing screens
Input images:
- Image 1 is the edit target. Preserve its exact 16:9 framing, fixed frontal first-person camera, ceiling beams, pendant lamps, lower interior floor, warm amber versus deep indigo palette, hand-painted timber texture, and deliberate pixel-cluster style.

Primary request:
Change only the rear entrance architecture. Replace the current multiple open bays with exactly one single main gate centered on the horizontal centerline of the image. The centered gate is the only exterior opening. Build continuous solid closed wooden side walls from the left gate jamb all the way to the left frame edge and from the right gate jamb all the way to the right frame edge.

Scene/backdrop:
The centered gate may be open so the narrow indigo night alley is visible, but the alley must be visible only inside that one centered doorway. Use one coherent gate frame, two open door leaves if needed, and one continuous threshold. The left and right side walls are interior wall surfaces, not doors, windows, rooms, or exterior bays. They may contain restrained shallow wall details or warm lamps consistent with the existing image, but no openings.

Style/medium:
Preserve the existing YS-HANDCRAFTED-NIGHT-v1 appearance: visible hand-drawn irregularity, opaque gouache-like blocks, worn dark walnut, aged amber light, subtle paper texture, and warm deliberate pixel clusters. Do not restyle.

Composition/framing:
Full-bleed 16:9 landscape. One centered doorway occupying roughly the central 40–45% of the width, with balanced solid wall mass on both sides. Keep the existing camera height, horizon, floor depth, ceiling structure, and major lamp positions. No crop and no extra panel.

Constraints:
- Change only the rear entrance and adjacent wall architecture.
- Exactly one exterior opening, centered horizontally.
- Left and right side walls remain fully closed and extend to the image edges.
- Night alley visible only through the centered gate.
- Keep the complete background opaque with no holes.
- Preserve all existing style, lighting, materials, perspective, ceiling, and floor.
- No people, body parts, chairs, stools, counter, table, food, drink, gameplay props, UI, text, numbers, watermark, or logo.

Avoid:
off-center entrance, multiple entrances, side openings, open side bays, side windows showing the alley, three-bay facade, panoramic open storefront, sealed center gate, full-width bottle shelf, deep back room, second counter, new furniture, photorealism, glossy 3D, smooth vector art.
```

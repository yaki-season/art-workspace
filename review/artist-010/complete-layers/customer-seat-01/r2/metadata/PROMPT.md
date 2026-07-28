# Artist 010 customer-seat-01 complete R2 프롬프트 기록

- R2 변경 범위: complete alpha는 R1과 바이트 단위로 동일하다.
- R2 이미지 생성 호출: 없음
- R2 검수판 구성: complete alpha 하나를 고정 checkerboard 위에 결정론적으로 합성
- 원래 생성 use case: `identity-preserve`
- asset type: `seat-01 customer + wooden bar seat hidden-surface completion source`
- source master: `CM-CUSTOMER-SERVICE-R1`
- spatial inference:
  `art-workspace/review/artist-010/complete-layers/customer-seat-01/preflight/seat-01-spatial-inference.json`
- spatial inference SHA-256:
  `13ecedf419ed21a063dd0f89c836dfb2716b8c5a579c50287dff13ff93f96ed7`
- generation unit: `seat-01 손님+좌석 한 묶음`

## 입력 이미지 역할

1. `art-workspace/review/artist-010/complete-layers/customer-seat-01/preflight/refs/seat-01-visible-cutout.png`
   - identity·얼굴·머리·의상·상체 자세·수작업 픽셀 화풍 reference
   - 최종 complete alpha에서는 이 승인 visible 픽셀을 다시 그대로 덮어쓴다.
2. `art-workspace/review/artist-010/complete-layers/customer-seat-01/preflight/refs/seat-01-context.png`
   - 고정 정면 카메라에서의 손님 크기·호박색 조명·카운터 접촉 높이 reference
   - 배경·카운터·음식·잔·접시·UI는 출력에 복사하지 않는다.

## 원래 생성에 사용한 최종 프롬프트

```text
Use case: identity-preserve
Asset type: isolated hidden-surface completion source for one YAKI SEASON seat-01 customer and his wooden bar seat
Input images:
- Image 1 is the primary identity and style reference. Preserve this exact middle-aged Japanese man's face shape, tired drooping eyes, messy swept black hair, weary expression, dark navy suit jacket, white shirt, loosened dark tie, warm hand-painted skin tones, upper-body proportions, and hand-resting-on-cheek pose.
- Image 2 is the context reference only for the fixed frontal camera, character scale, warm amber light direction, and seated counter-height pose. Do not copy its background, counter, plate, skewers, drink glass, mat, speech bubble, or any UI.

Primary request:
Create exactly one complete full-body version of the referenced seat-01 customer, seated naturally on exactly one tall dark wooden counter chair with a short simple slatted back. Complete the waist, trousers, bent seated legs, shoes, chair seat, chair legs, and hidden structural overlaps that were covered by the bar counter in the references. Keep the approved upper-body identity and pose unchanged.

Subject:
One tired middle-aged Japanese office worker in the same dark navy suit, white shirt, and loosened tie. He sits front-facing with a slight weary slump. His screen-left fist supports his cheek and that elbow remains forward at counter-contact height; his other forearm stays low in front as in the reference. His lower body continues as matching dark navy trousers and plain dark work shoes. The chair is old dark walnut, narrow, practical, and correctly supports his seated weight.

Style/medium:
Match YS-HANDCRAFTED-NIGHT-v1: visible pencil underdrawing, slightly irregular ink, opaque gouache-like color blocks, worn material texture, warm gentle shape-explaining pixel clusters, and the same pixel density as Image 1. Original hand-drawn 2.5D game character asset, not glossy 3D and not smooth vector art.

Scene/backdrop:
Perfectly flat solid #ff00ff chroma-key background for local background removal. The background must be one exact uniform color with no shadows, gradients, texture, reflections, horizon, or floor plane.

Composition/framing:
Show the entire customer and chair from hair to shoes and all chair legs, centered with generous empty chroma padding on every side. Fixed frontal view at the same camera height as the references. No crop, no cut-off limbs, and no second panel.

Lighting/mood:
Preserve the same restrained warm amber light from above/front and readable dark navy midtones. Do not add a cast shadow or contact shadow onto the chroma background.

Constraints:
- Exactly one customer and exactly one wooden bar chair.
- Preserve face, hair, age, expression, outfit, body build, seated pose, and hand placement from Image 1.
- Complete only the previously hidden lower body and chair structure.
- Keep all subject edges crisp and fully separated from #ff00ff.
- Do not use #ff00ff anywhere in the customer or chair.
- No background fragment, counter, table, floor, food, skewer, plate, bowl, drink, glass, mat, receipt, camera, held prop, status icon, speech bubble, HUD, text, numbers, watermark, or logo.

Avoid:
multiple people, extra chair, standing pose, redesigned face, different hairstyle, clean tight tie, casual outfit, exaggerated anime face, malformed hands, extra fingers, fused limbs, floating body, wrong seated weight, glossy plastic skin, photorealism, smooth vector art, random pixel noise, magenta spill, background shadow.
```

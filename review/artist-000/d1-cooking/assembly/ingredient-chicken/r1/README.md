# Artist 000 — D1 생 닭다리살 모델 R1

- 상태: `approved-by-user` (2026-07-29)
- ID: `MDL-INGREDIENT-CHICKEN`
- 화면: `SCR-SVC-ASSEMBLY`
- 규격: `82 / 800 triangles` GLB + `192×192` nearest-sampled pixel albedo

`MDL-INGREDIENT-CHICKEN` R1은 D1 조립의 생 닭다리살 한 조각이다. 승인 D1 조립 전체 화면을 직접
시각 원본으로 삼아, 생 닭의 차분한 분홍갈색·짙은 픽셀 윤곽·마블링 음영·작은 지방 하이라이트를
pixel albedo로 보존한다.

## 런타임 계약

- 단위: meter, Y-up, +Z front
- 원점·결합 node: `skewerSocket`
- 절단면 UV: `pixel-material-plane`의 normalized UV
- 재질: `tex-ingredient-chicken-albedo-r1.png`, sRGB, nearest sampling
- 결합 순서: `닭 → 파 → 닭 → 파 → 닭` 중 닭 slot

런타임은 `MDL-SKEWER-BASE`의 지정 slot에 `skewerSocket`을 맞춰 이 모델을 배치한다. 이 bundle에는
꼬치·대파·완성 꼬치·jig·재료 통·상태별 PNG가 포함되지 않는다.

사용자가 R1을 승인했다. 검수판은 실제 GLB와 pixel albedo 한 bundle을 checkerboard 위에 렌더링한다.
앱 manifest와 runtime 등록은 이후 동적 조립 bundle 전체가 승인될 때까지 계속 금지다.

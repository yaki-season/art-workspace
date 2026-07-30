# Artist 000 — D1 빈 꼬치 모델 R2

- 상태: `approved-by-user` (2026-07-29)
- ID: `MDL-SKEWER-BASE`
- 화면: `SCR-SVC-ASSEMBLY`
- 규격: `146 / 500 triangles` GLB + `1024×64` nearest-sampled pixel albedo

`MDL-SKEWER-BASE` R2는 D1 조립 jig 위의 **빈 대나무 꼬치 한 개**다. 승인 D1 조립 전체 화면을 직접
시각 원본으로 삼아, 짙은 픽셀 윤곽·따뜻한 황갈색 나뭇결·어두운 손잡이 끝·밝은 대나무 하이라이트를
pixel albedo로 보존했다. GLB의 `pixel-material-plane` node가 이 albedo를 받고, 뒤쪽의 단순 bamboo
mesh가 비정면 조작 시 깊이를 제공한다.

## 런타임 계약

- 단위: meter, Y-up, +Z front
- 원점: 꼬치 길이축의 중앙
- 필수 node: `handle`, `tip`
- 재료 결합 anchor: `slot-01`~`slot-05`
- 재질: `tex-skewer-base-albedo-r2.png`, sRGB, nearest sampling
- 조립 순서: `닭 → 파 → 닭 → 파 → 닭`

런타임은 이 꼬치의 anchor에 승인된 닭·파 모델을 한 조각씩 붙인다. 따라서 이 bundle은 빈 꼬치만
검수하며, jig·재료 통·전달 tray·완성 꼬치·상태별 PNG는 포함하지 않는다.

사용자가 R2를 승인했다. 검수판은 실제 GLB와 pixel albedo 한 bundle을 checkerboard 위에 렌더링한다.
앱 manifest와 runtime 등록은 이후 동적 조립 bundle 전체가 승인될 때까지 계속 금지다.

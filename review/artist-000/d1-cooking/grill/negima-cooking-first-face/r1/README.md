# MDL-NEGIMA-GRILL-COOKING-FIRST-FACE R1

- 상태: `approved-by-user` (2026-07-30)
- ID: `MDL-NEGIMA-GRILL-COOKING-FIRST-FACE`
- 화면: `SCR-SVC-GRILL`
- 의미: 첫 면(`face 0`)이 `4초` 동안 익는 중인 네기마 한 꼬치

이 후보는 새 음식 이미지·GLB·albedo를 만들지 않는다. 승인된 `MDL-NEGIMA-GRILL-RAW` R1의 실제
Three.js 조합(`476 triangles`)을 그대로 불러온 뒤, 닭과 대파의 기존 nearest albedo를 샘플하는 fragment
shader에만 pixel-cell sear mask를 적용한다. 대나무 꼬치는 변경하지 않는다.

`0 <= elapsed < 8초`의 첫 면 pre-proper 범위에서 검수용 `4초`를 사용한다. face·시간·화력·품질·입력 잠금은
게임 도메인 책임이며, 이 모듈은 그 RenderSnapshot을 시각화할 뿐 상태를 전이시키지 않는다.

검수판은 checkerboard 위에 이 상태의 네기마 한 개만 표시한다. 그릴·숯·연기·집게·tray·UI·문자·판정은
포함하지 않는다. 사용자가 2026-07-30에 승인했으며, runtime 등록은 별도 승격 게이트 전까지 금지다.

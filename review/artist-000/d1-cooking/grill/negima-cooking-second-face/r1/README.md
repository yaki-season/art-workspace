# MDL-NEGIMA-GRILL-COOKING-SECOND-FACE R1

- 상태: `approved-by-user` (2026-07-30)
- ID: `MDL-NEGIMA-GRILL-COOKING-SECOND-FACE`
- 화면: `SCR-SVC-GRILL`
- 의미: 첫 180° 뒤집기 뒤 보이는 반대면(`face 1`)이 4초 동안 익는 중인 네기마 한 꼬치

승인된 raw 네기마 조합을 `flipPivot.rotation.y = π`로 둔다. 먼저 익힌 face 0의 `4초` 이력과 현재 보이는
face 1의 `4초` 이력은 서로 독립적으로 보존한다. 닭·대파의 기존 nearest albedo만 fragment shader가
샘플하고 면별 pixel-cell sear mask를 적용한다. 새 음식 그림·GLB·albedo·texture bake는 없다.

검수판은 checkerboard 위 이 상태의 네기마 한 개만 표시한다. 그릴·숯·연기·집게·tray·UI·문자·판정은
포함하지 않는다. 사용자가 2026-07-30에 승인했다. face·시간·화력·품질·0.3초 입력 잠금은 게임 도메인 책임이며 runtime 등록은 금지다.

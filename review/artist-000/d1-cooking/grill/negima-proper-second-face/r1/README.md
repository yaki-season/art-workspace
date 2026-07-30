# MDL-NEGIMA-GRILL-PROPER-SECOND-FACE R1

- 상태: `approved-by-user` (2026-07-30)
- ID: `MDL-NEGIMA-GRILL-PROPER-SECOND-FACE`
- 화면: `SCR-SVC-GRILL`
- 의미: 첫 180° 뒤집기 뒤 보이는 반대면(`face 1`)이 정확히 `8초` 적정 구간에 들어간 네기마 한 꼬치

승인된 raw 네기마 조합을 `flipPivot.rotation.y = π`로 둔다. 앞면과 반대면은 각각 `8초` 적정 이력을
독립적으로 보존한다. 승인된 raw GLB와 nearest albedo만 샘플하고, 닭에는 밝은 회갈색 익은 속살 tint와 드문
짙은 갈색 sear를, 대파에는 muted cooked olive와 최소 oil gloss를 shader로 적용한다. 첫 뒤집기 endpoint의
source backing은 승인 food/bamboo double-sided decal보다 먼저 렌더링된다. 새 음식 그림·GLB·albedo·texture bake는 없다.

검수판은 checkerboard 위 이 상태의 네기마 한 개만 표시한다. 그릴·숯·연기·집게·tray·UI·문자·판정은 포함하지
않는다. 사용자가 2026-07-30에 승인했다. face·시간·화력·품질·0.3초 입력 잠금은 게임 도메인 책임이며 runtime 등록은 금지다.

# CMP-GRILL-FINISHED-PROPER-NEGIMA R1

- 상태: `approved-by-user` (2026-07-30)
- ID: `CMP-GRILL-FINISHED-PROPER-NEGIMA`
- 화면: `SCR-SVC-GRILL`
- 의미: 양면이 정확히 `8초` 적정인 네기마 한 꼬치가 `grill.finished` 완성 tray에 회수된 상태

`ST-GRILL-FINISHED-TRAY`는 승인된 D1 그릴 마스터의 우측 상단 완성 tray를 food 없이 분리한 고정 레이어다.
그 위에 승인된 `MDL-NEGIMA-GRILL-PROPER-SECOND-FACE`를 조립한다. 꼬치는 첫 180° 뒤집기 `π`, face 0/1 각각
`8초`, `Perfect` 품질이며 그릴 접촉면은 `null`이다. 음식의 raw GLB·nearest albedo·밝은 회갈색 proper shader를
그대로 재사용하고, 새 음식 raster·texture·GLB는 만들지 않았다.

이 tray는 그릴의 완료품 보관소이며 이후 서빙 화면에서 선택하는 접시가 아니다. 검수판은 checkerboard 위 이 tray와
네기마 한 꼬치만 표시한다. 수량·품질 badge·주문서·손님·집게·그릴·숯·연기·서빙 UI는 포함하지 않는다.
사용자가 `ST-GRILL-FINISHED-TRAY`와 이 조합을 2026-07-30에 함께 승인했으며, 소비 화면
재조립·finalizer 전까지 runtime 등록은 금지다.

# ST-GRILL-WAITING-RACK R2

- 상태: `approved-by-user` (2026-07-29)
- ID: `ST-GRILL-WAITING-RACK`
- 화면: `SCR-SVC-GRILL`
- 출력: `assets/st-grill-waiting-rack-fhd-r2.png` — straight-alpha `1920×1080` PNG

R1의 평면적인 정면 구도를 폐기하고, 승인 D1 그릴 master의 좌측 대기 rack처럼 위에서 내려다보는 얕은
트레이 cavity와 가까운 쪽의 두꺼운 rim을 가진 R2다. master의 FHD 위치 `(85,265)`에 맞춰 놓았으며,
음식과 꼬치는 포함하지 않는다. 조립된 생 네기마의 수량과 쌓임은 승인된 조립 모듈을 runtime에서 합성하고,
D1의 단일 `네기마` 선택 제어는 DOM 책임이다.

검수판은 `review-st-grill-waiting-rack-isolated-fhd-r2.png`이며, checkerboard 위에 이 asset 하나만
표시한다. 네 모서리 alpha `0`, visible green `0`픽셀을 검증했다. runtime 등록은 계속 금지하며, 다음
단일 검수 대상은 그릴 위 생 네기마 상태다.

# Artist 000 — D1 연속 석쇠 그릴 R2

- 상태: `approved-by-user` (2026-07-29)
- ID: `ST-GRILL-TIER-1`
- 화면: `SCR-SVC-GRILL`
- 규격: straight-alpha `1920×1080` FHD PNG

R1 반려를 반영한 고정 그릴 layer다. 조리 칸을 나누지 않고, 한 장의 연속 charcoal bed 위에 넓은
격자형 금속 석쇠를 올렸다. 빈 석쇠는 한 번에 평행 꼬치 여섯 개를 올릴 물리적 폭을 가진다.

꼬치·음식·익힘 변화·불꽃·뒤집기·판정·대기/완성 tray·주문서와 UI는 이 래스터에 굽지 않는 별도 동적
또는 DOM 책임이다. 검수판은 checkerboard 위에 이 투명 layer 한 장만 표시한다.

새 raster는 built-in imagegen의 균일 `#00ff00` chroma source를 alpha로 제거한 뒤, subject bbox를
nearest-neighbor로 `1280×590`에 맞춰 FHD `(320, 245)`에 배치했다. runtime 등록은 사용자 승인 뒤에도
계속 금지다.

사용자가 R2의 연속 석쇠와 6꼬치 수용 폭을 승인했다. formal standalone-raster report는
`metadata/standalone-raster-report.json`이며 runtime 등록은 계속 금지다.

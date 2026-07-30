# ST-GRILL-FINISHED-TRAY R1

- 상태: `approved-by-user` (2026-07-30) — `CMP-GRILL-FINISHED-PROPER-NEGIMA` R1과 함께 승인
- 의미: 그릴에서 회수한 완성품을 보관하는 빈 완료 tray 고정 레이어
- 출력: `assets/st-grill-finished-tray-fhd-r1.png` (`1920×1080`, straight-alpha)

승인된 D1 그릴 마스터 우측 상단 tray를 시각 원본으로 사용해, 음식 없이 빈 검은 금속·황동 테두리만 분리했다.
이미지는 built-in imagegen의 `#00ff00` chroma 원본을 alpha로 제거하고 nearest-neighbor로 실제 FHD anchor에
배치했다. tray 위 음식은 별도 동적 상태이며 이 래스터에 굽지 않는다. 접시·서빙 UI가 아니라 `grill.finished`
완료품 보관소다. 사용자가 2026-07-30에 CMP 조합과 함께 승인했다. 소비 화면 재조립·finalizer 전까지
runtime 등록은 금지다.

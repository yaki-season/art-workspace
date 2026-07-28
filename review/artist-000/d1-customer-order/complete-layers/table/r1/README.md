# Artist 000 — 서비스 테이블 complete layer R1

- 상태: `approved-by-user` (2026-07-28)
- 프로필: `complete-layer`
- 기준 전체 화면: `artist-009/customer-screen/r3/customer-service-fhd-r3.png`
- 출력: `assets/service-table-complete-fhd-r1.png` (`1920×1080`, straight-alpha PNG)
- 검수판: `review-service-table-isolated-fhd-r1.png` (`1920×1080`, checkerboard)
- 하단 채움 검토: `review-table-with-station-nav-fhd-r1.png` — 테이블 위에 승인 Artist 009의
  공통 `손님·조립·그릴·드링크` DOM/CSS 전환 UI를 실제 좌표로 겹친 재조립 검토판

## 범위

이 레이어에는 Artist 009 승인 화면의 실제 긴 목재 서비스 테이블만 있다. 상판·모서리·전면
목재 패널을 포함하며, 동적으로 바뀌는 음식·음료·식기·매트와 손님·의자·배경·UI는 포함하지
않는다. 하단 UI가 놓일 영역은 투명으로 남긴다.

기준 전체 화면을 다시 그리지 않았다. 불투명 원본에서 손님과 주문 물체에 가려진 목재 부분은
동일한 원근·목재 질감으로 복원해 하나의 complete layer로 만들었다.

## 검수 항목

1. 기준 화면의 긴 테이블 폭·상판 원근·전면 패널이 명확히 유지되는가.
2. 손님·음식·음료·식기·매트·배경·UI가 전혀 섞이지 않았는가.
3. 카운터 상단과 하단 UI 영역의 투명 경계가 깨끗한가.
4. 목재 색·질감·광택·짙은 외곽이 Artist 009 승인 화면과 어울리는가.

2026-07-28 사용자가 앞서 제출한 테이블 분리 에셋을 사용한다고 승인했다. 이 승인은 테이블
complete layer 하나에만 해당하며, 다음 분리 에셋·재조립·runtime 등록은 계속 보류한다.

## 하단 전환 영역

기준 화면 하단 `y=920..1080`은 조리 작업대가 아니다. `UI-002`의 공통 인접 화면 전환과
Artist 009 R3의 승인 전환 DOM/CSS가 차지하는 전경 UI 영역이다. 따라서 테이블 래스터에는
텍스트·버튼·아이콘을 굽지 않고, 재조립 검토판에서 기존 승인 구조를 DOM/CSS로 겹친다.
조립·그릴·드링크의 실제 조작물은 각각 별도 화면 `SCR-SVC-ASSEMBLY`, `SCR-SVC-GRILL`,
`SCR-SVC-DRINK`에만 존재한다.

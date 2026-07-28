# Customer order-wait panel — R3

손님 머리 위에 고정되는 주문 대기 상태 UI의 승인 후보이다. 고정 래스터는 말풍선 외피뿐이며, 주문 아이콘·수량·완료 체크·대기 진행도는 웹 DOM/CSS로 조립한다.

- 검수 화면: [review-order-wait-panel-r3.html](review-order-wait-panel-r3.html)
- 투명 외피 에셋: [customer-order-wait-panel-skin-r3.png](assets/customer-order-wait-panel-skin-r3.png)
- CSS 계약: [customer-order-wait-panel-r3.css](css/customer-order-wait-panel-r3.css)
- 규격: `232×174`, straight alpha, 전체 외곽 투명
- 상태: `approved-by-user`; runtime 등록 금지

## 확정 반영 사항

- 손님 어깨 정도 폭의 둥근 직사각형, 완전 정면, 아래 중앙 말풍선 꼬리
- 어두운 반투명 인디고 바탕과 얇은 황동 테두리. 두꺼운 나무 간판·칸 분할·원근은 제외
- 상단 약 `60%`는 주문 아이콘/`xN` DOM 영역, 그 아래는 여백, 하단 약 `15%`는 하나의 연속 가로 게이지
- 미완료 주문은 음식 아이콘과 DOM 수량, 완료 주문은 같은 위치의 원형 체크와 DOM 수량으로 교체
- `--customer-x`, `--customer-y`가 손님 위치를 따라가며, `--wait-progress`가 게이지 너비를 연속으로 줄인다.

검수 화면의 꼬치·맥주 도형은 레이아웃 검증용 DOM 임시 표기다. 실제 음식 아이콘은 별도 승인된 단일 에셋으로 이 슬롯에 연결한다. 사용자가 `2026-07-27`에 말풍선 외피, 비율, 주문 묶음 간격, 주문/완료/게이지 CSS 배치와 연속 감소 계약을 승인했다. runtime 등록은 전체 UI·재조립 승인 전까지 금지한다.

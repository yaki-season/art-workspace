# Customer service-wait panel — R2

손님 주문이 접수된 뒤 꼬치·맥주가 제공될 때까지의 서빙 대기 시간을 표시하는 완결형 정면 패널이다.

- 검수 대상: [review-service-wait-panel-fhd-r2.png](review-service-wait-panel-fhd-r2.png)
- 실제 투명 에셋: [customer-service-wait-panel-r2.png](assets/customer-service-wait-panel-r2.png)
- 규격: `320×144`, straight alpha, 네 모서리 alpha `0`
- 표시 예: 5칸 중 왼쪽 3칸 amber, 오른쪽 2칸 empty
- 런타임: 시작은 5칸 amber, 오른쪽부터 한 칸씩 비워져 0칸에 도달한다. 실제 fill·초 단위·접근성 텍스트는 DOM 또는 동등 UI 계층이다.
- 상태: `superseded-by-r3`; runtime 등록 금지

사용자 피드백(5칸 기준과 과도한 가로 비율)을 반영해 후속 R3으로 교체했다. R2는 이력 보존용이며 승인 대상으로 사용하지 않는다.

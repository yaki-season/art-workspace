# D1 손님 주문 접수 전체 화면 R1 — 생성 프롬프트

- 도구: `built-in imagegen`
- 방식: `precise-object-edit`
- 참조 1: Artist 010 승인 complete background R3 (edit target)
- 참조 2: Artist 010 승인 seat-01 complete R2 (츠키오카 정체성 참조)
- 참조 3: Artist 009 승인 customer service R3 (화풍·카운터 재질 참조만 사용)

## 핵심 불변 조건

- 중앙 단일 대문·그 개구부 너머 밤 골목·막힌 좌우 측면 벽
- 왼쪽 seat-01의 단일 츠키오카, 단일 연속 바 카운터와 완전한 하체 가림
- 다른 손님·음식·생맥주·식기·UI·문자 없음
- 승인된 네기마/생맥주 주문 UI는 생성 이미지가 아닌 HTML/CSS로만 조립

## 사용 프롬프트

`background-complete-fhd-r3.png`을 고정 정면 바 안쪽 카메라와 공간 topology의 edit target으로,
`customer-seat-01-complete-fhd-r2.png`을 단일 츠키오카의 외형·자세 참조로, 기존 customer service
화면을 화풍·카운터 재질 참조로 지정했다. 중앙 대문과 밤 골목, 목재·황동 조명, 왼쪽의 피곤한
중년 남성 손님을 유지하고, 화면 전체를 가로지르는 하나의 목재 카운터가 하체·의자 다리를
완전히 가리게 요청했다. 주문 직후이므로 빨간 주문 매트 외 음식·맥주·잔·접시를 제거하고,
다른 손님·UI·문자·숫자·워터마크·다른 출입구·다른 카운터를 금지했다.

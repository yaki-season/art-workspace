# D2 모모 R1 — 최종 승인

D1에서 확정된 야키토리 톤을 기준으로 D2 모모의 조립, 양면 굽기, 주문 아이콘과
손님 제공 상태를 하나의 세트로 제작했다. 꼬치에는 닭다리살 다섯 조각만 사용하며
모든 굽기 단계가 같은 실루엣과 앵커를 유지한다.

## 승인 상태

- 상태: `approved-by-user`
- 승인일: `2026-08-10`
- 검토판: `review/review-d2-momo-five-stage-r1.png`
- 런타임 크기: 그릴·조립 `109×494`, 주문 아이콘 `256×256`, 제공 접시 `2048×1024`
- 앱 등록: `D2-MOMO-RUNTIME-SET@R1-B1`

## 단계 구분

- `raw`: 기름기 있는 분홍빛 닭다리살
- `cooking`: 불투명해진 살코기와 옅은 갈색 가장자리
- `proper`: 황금빛 살코기, 갈색 기름 그을음과 작은 직화 자국
- `overcooked`: 넓어진 진갈색 그을음과 짙어진 살코기
- `burnt`: 형태가 읽히는 검게 탄 표면

## 런타임 구성

- `spr-momo-grill-*-r1.png`: 그릴 단계별 교체 스프라이트
- `spr-momo-assembly-progress-0..5-r1.png`: 닭고기를 하나씩 꽂는 조립 진행
- `fd-momo-order-r1.png`: 주문·공용 준비 재고 카드
- `pr-served-momo-plate-r1.png`: 손님 테이블의 모모 제공 상태

2026-08-10 사용자 최종 승인에 따라 app의 정식 runtime build와 manifest 등록을 허용한다.

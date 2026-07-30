# `PR-SHOP-GATE-S0 / open` R6 — FHD/720 계약 재조립 검수

- 상태: `approved-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId / requiredAssetId / variant: `prologue.gate / PR-SHOP-GATE-S0 / open`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- camera / layer: `S0-EXTERIOR-FIXED-V1` / `architecture / 20`
- runtimeRegistrationAllowed: `false`

## 캡처 결과

| 출력 | PNG | SHA-256 | visualBounds | interactionBounds | DOM safe rect |
|---|---|---|---|---|---|
| FHD | `recomposition-pr-shop-gate-s0-open-fhd-r6.png` (1920×1080) | `db9a5cc02e9765fb89d31c276fa2021c48e13d6230d844dd3b14e28858e1fc48` | `656,176,608,704` | `720,224,480,624` | `128,936,1664,104` |
| 720 | `recomposition-pr-shop-gate-s0-open-hd-r6.png` (1280×720) | `9832a9542dc347ca97459de207ac6cde01a3b59c307e2f7eded474fce8da6ccc` | `437,117,405,469` | `480,149,320,416` | `85,624,1109,69` |

FHD는 계약의 논리 FHD rect와 정확히 일치했다. 720 캡처는 브라우저 1920×1080 logical stage가
`2/3` scale로 letterbox되어 화면 좌표에는 좌측 `320px`, 상단 `180px` offset이 더해진다. 표에는 그
offset을 제외한 Developer 2 계약 논리값을 기록했다.

## 포함 / 제외와 판정

- 포함: 승인된 R6 대문 alpha 한 장, `architecture / z20` visual rect, 상호작용 bounds, DOM safe rect.
- 제외: `BG-EXTERIOR-S0-CLOSED`, 골목·점포·실내, 열쇠·숯·노트·아키, 인물·손·팔·전신, runtime 등록.
- harness의 격자·텍스트·버튼은 DOM 검수용 overlay이며 대문 PNG에 포함되지 않는다.
- `BG-EXTERIOR-S0-CLOSED`는 Developer 2 계약 inventory에 component/bounds/layer 행이 없어 여전히
  `unassigned`다. 따라서 이 결과는 배치 계약만 증명하며 실제 외관 화면의 완성본이 아니다.

## 다음 단일 gate

versioned `BG-EXTERIOR-S0-CLOSED` Developer 2 binding 인계가 올 때까지 실제 exterior 조립, 최적화,
finalizer, runtime 등록으로 진행하지 않는다. 인계에는 `componentId`, `stateVariant`, FHD/720
`visualBounds`, `camera`, `layer/z-order`, `DOM safe rect`, KEY/GATE 양 상태의 소비 규칙이 모두 있어야
한다. 충족 시 첫 후보는 background 한 장으로 제한한다.

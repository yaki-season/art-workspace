# `PR-SHOP-GATE-S0 / open` R5 — FHD/720 계약 재조립 검수

- 상태: `superseded-by-r6-height-revision` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId / requiredAssetId / variant: `prologue.gate / PR-SHOP-GATE-S0 / open`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- camera / layer: `S0-EXTERIOR-FIXED-V1` / `architecture / 20`
- runtimeRegistrationAllowed: `false`

## 캡처 결과

| 출력 | PNG | SHA-256 | visualBounds | interactionBounds | DOM safe rect |
|---|---|---|---|---|---|
| FHD | `recomposition-pr-shop-gate-s0-open-fhd-r5.png` (1920×1080) | `423515c81251370931a51be0eaa90f60a6a065b21be4874812122eb453299b6c` | `656,176,608,704` | `720,224,480,624` | `128,936,1664,104` |
| 720 | `recomposition-pr-shop-gate-s0-open-hd-r5.png` (1280×720) | `9368bd4474ba69f6b5bf3f26d81e7fb80798d6f555455a2177e7f426fa9acf31` | `437,117,405,469` | `480,149,320,416` | `85,624,1109,69` |

FHD는 계약의 논리 FHD rect와 정확히 일치했다. 720 캡처는 브라우저 1920×1080 logical stage가
`2/3` scale로 letterbox되어 화면 좌표에는 좌측 `320px`, 상단 `180px` offset이 더해진다. 표에는 그
offset을 제외한 Developer 2 계약 논리값을 기록했다.

## 포함 / 제외와 판정

- 포함: 승인된 R5 대문 alpha 한 장, `architecture / z20` visual rect, 상호작용 bounds, DOM safe rect.
- 제외: `BG-EXTERIOR-S0-CLOSED`, 골목·점포·실내, 열쇠·숯·노트·아키, 인물·손·팔·전신, runtime 등록.
- harness의 격자·텍스트·버튼은 DOM 검수용 overlay이며 대문 PNG에 포함되지 않는다.
- `BG-EXTERIOR-S0-CLOSED`는 Developer 2 계약 inventory에 component/bounds/layer 행이 없어 여전히
  `unassigned`다. 따라서 이 결과는 배치 계약만 증명하며 실제 외관 화면의 완성본이 아니다.

R6가 사용자의 "문을 위아래로 더 높게" 요청을 반영해 이 검수본을 대체했다. R6 승인 전에는 추가 재조립,
실제 exterior 조립, 최적화 finalizer, runtime 등록으로 진행하지 않는다.

# `BG-EXTERIOR-S0-GATE-OPEN / gate-open-empty-interior` R1 — GATE FHD/720 계약 재조립 검수

- 상태: `approved-by-user` (2026-07-30)
- contract: Developer 2 state-specific exterior `v2.0.0`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- component / asset / variant: `prologue.exterior.background / BG-EXTERIOR-S0-GATE-OPEN / gate-open-empty-interior`
- sourceMaster / camera / layer: `CM-PROLOGUE-INHERITANCE-R1 / S0-EXTERIOR-FIXED-V1 / background z0`
- interactionBounds: `null`; bodyPartCount: `0`; runtimeRegistrationAllowed: `false`

| 출력 | SHA-256 | logical visualBounds | DOM safe rect | 판정 |
|---|---|---|---|---|
| `recomposition-bg-exterior-s0-gate-open-fhd-r1.png` (1920×1080) | `1f3d1a5a973a5eb9b675e517c93b441b2d085c86e40d74d6eca5b4ac3e2c7ed6` | `0,0,1920,1080` | `128,936,1664,104` | 통과 |
| `recomposition-bg-exterior-s0-gate-open-hd-r1.png` (1280×720) | `824527e6e493e1fe80a0917f721eb48943aedc137e2c3b32623ea8c9b9c37ca1` | `0,0,1280,720` | `85,624,1109,69` | 통과 |

검증 결과는 `approved` mode, contract `v2.0.0`, requiredAssetId exact match,
`S0-EXTERIOR-FIXED-V1`, `SCR-STORY-PROLOGUE:S0-STATE-GATE`, body `0`,
forbiddenAssetId `BG-EXTERIOR-S0-CLOSED`이다. 720의 physical screenshot은 1920×1080 logical
stage가 `2/3` scale로 letterbox되므로 좌측 `320px`·상단 `180px` offset이 추가된다. 표에는 그 offset을
제외한 계약 논리값을 기록했다.

Harness의 텍스트·버튼·하단 DOM safe overlay는 검수용 DOM이며 background PNG에는 포함되지 않는다.
이 검수는 GATE 배치 계약만 증명하며, key/gate 실제 전체 화면 finalizer나 runtime handoff가 아니다.

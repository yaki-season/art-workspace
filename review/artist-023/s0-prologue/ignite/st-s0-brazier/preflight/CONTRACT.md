# `ST-S0-BRAZIER` preflight — 픽셀 제작 전 계약

- 상태: `preflight-only`; 이미지·source·runtime bundle 없음
- semanticOwner: `artist-2.s0-prologue-story`
- 화면: `SCR-STORY-PROLOGUE / S0-STATE-CHARCOAL / ignite / S0-CHARCOAL-IGNITE`
- componentId: `prologue.brazier-and-charcoal`
- primary requiredAssetId / stateVariant: `ST-S0-BRAZIER / cold-to-ignited`
- companion requiredAssetId / stateVariant: `PR-CHARCOAL-IGNITION / off-to-stable`
- camera: `S0-BRAZIER-FIXED-V1`, fixed `16:9`, `contain`
- bodyPartCount: `0`; DOM은 raster 밖의 native DOM만 허용

## Developer 2 작업 007 확정 입력

| 대상 | FHD visual / interaction | 720 visual / interaction | layer / z | DOM safe |
|---|---|---|---|---|
| `prologue.brazier-and-charcoal` component envelope | `648,376,624,432` / `752,480,416,288` | `432,251,416,288` / `501,320,277,192` | architecture / 20 | FHD `128,936,1664,104`; 720 `85,624,1109,69` |
| `PR-CHARCOAL-IGNITION` companion | **unassigned** child visual bounds / component interaction을 공유하지 않음 | **unassigned** | VFX / 50 | parent DOM safe를 침범하지 않음 |

`624×432`은 `ST-S0-BRAZIER`와 향후 숯 companion을 함께 담는 component envelope다. Developer 2는
VFX child의 별도 visual bounds를 제공하지 않았으므로 이를 추측하지 않는다. 이번 preflight는 primary
`ST-S0-BRAZIER`의 한 단일 후보 준비만 허용하며 `PR-CHARCOAL-IGNITION`을 제작하거나 조립하지 않는다.

## 시각 범위와 제외

- 포함 예정: 차가운 화로 몸체, 숯 접촉 anchor, 숯이 들어갈 구조적 받침.
- 제외: 불씨·불꽃·연기·점화 VFX, 손·팔·전신·도구, 아키·노트·열쇠·대문, UI·문자·버튼·커서·게이지.
- 점화 interaction은 짧은 무실패 클릭 하나이며, hidden target·점수·실패·추가 클릭을 만들지 않는다.
- `sourceMasterId`와 primary/companion 개별 pixel 분할 규칙은 Developer 2 inventory에 명시되지 않아
  **unassigned**로 남긴다. pipeline bundle·finalizer는 그 versioned 입력이 오기 전까지 시작하지 않는다.

## 다음 단일 gate

사용자가 이 preflight의 **차가운 화로 단독 범위**를 승인하고 Developer 2가 `sourceMasterId` 및
`PR-CHARCOAL-IGNITION` child visual bounds를 versioned handoff로 확정한 뒤에만,
`ST-S0-BRAZIER / cold-to-ignited` 후보 한 장을 제작한다.

# Developer 2 요청서 v1.0.0 — `CH-AKI-STORY` story portrait binding

- 요청자: `artist-2.s0-prologue-story`
- 목적: 아사노 아키의 단일 story portrait 원본을 `SCR-STORY-BEAT`와 허용된 정산 화면에서만 안전하게
  소비할 수 있도록 versioned binding을 확정한다.
- 범위 밖: 영업·조리·S0 상호작용, 손·팔·전신, 플레이어 조작, `CH-OWNER-STORY` 재사용, manifest promotion.

## 요청 필드

하나의 versioned handoff에 아래를 모두 명시해 달라. 없는 값은 추정하지 말고 `unassigned`로 표기한다.

| 필드 | 요청 내용 |
|---|---|
| `componentId` | story portrait runtime component의 exact ID |
| `requiredAssetId` | 정확히 `CH-AKI-STORY`; `CH-OWNER-STORY`는 forbidden/legacy로 명시 |
| `stateVariant` | 피로·집중·실수·안도 소비 규칙. 단일 원본 + DOM dialogue로 충분하면 이를 명시하고, 새 pixel variant를 요구하지 않음 |
| screen/state scope | `SCR-STORY-BEAT`와 허용된 `SCR-POST-SETTLEMENT`만; `SCR-SVC-*` 및 S0 interaction은 forbidden |
| sourceMasterId | S0 story와 settlement가 다른 master를 쓸 경우, shared original의 provenance/소비 규칙을 명시 |
| FHD/720 visualBounds | portrait의 정확한 `x,y,width,height`와 contain/crop rule |
| interactionBounds | portrait direct-click 금지(`null`) 여부를 명시 |
| layer / zOrder | background·dialogue panel·DOM safe 영역과의 순서를 포함한 exact 값 |
| DOM safe rect | FHD/720 exact rect 및 portrait 비침범 규칙 |
| bodyPartCount | story portrait가 인물 초상으로 소비될 때의 contract 표현과, interaction에서 신체 `0`을 유지하는 guard |
| runtime guard | story/settlement 외 runtime registration·fallback·legacy ID fallback을 금지하는 규칙 |

## 수락 기준

Developer 2 contract가 portrait bounds·layer·DOM safe를 확정하고, user preflight가 외형/표정 범위와
story-only guard를 승인해야 한다. 두 gate 전 Artist 2는 `CH-AKI-STORY` 이미지, 표정 variant, optimization,
finalizer, runtime handoff를 만들지 않는다.

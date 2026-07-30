# `ST-S0-BRAZIER / cold-to-ignited` — 사용자 preflight 검수본 v1.0.0

- 상태: `pending-user-review` — **픽셀·합성·runtime bundle 없음**
- 단일 후보: `ST-S0-BRAZIER`의 차가운 화로 구조물 한 장만
- semanticOwner: `artist-2.s0-prologue-story`
- 정본 화면: `SCR-STORY-PROLOGUE / S0-STATE-CHARCOAL / ignite / S0-CHARCOAL-IGNITE`
- Developer 2 계약: `S0_BRAZIER_LAYER_CONTRACT v1.0.0` / 작업 011 `v1.1.0`
- sourceMasterId: `CM-PROLOGUE-INHERITANCE-R1` (읽기 전용; 픽셀·crop·runtime 복사 금지)

이 문서는 기존 `CONTRACT.md`와 Developer 2 요청서의 미확정 값을 수신 계약으로 해소해, 사용자에게
검수할 범위를 한 건으로 정리한 것이다. 기존 preflight와 요청서는 이력으로 보존하며 수정하지 않는다.

## 고정 배치 계약

| 항목 | `ST-S0-BRAZIER` primary (이번 검수 대상) | `PR-CHARCOAL-IGNITION` companion (이번 후보 제외) |
|---|---|---|
| component / asset / variant | `prologue.brazier-and-charcoal` / `ST-S0-BRAZIER` / `cold-to-ignited` | `prologue.ignitionVfx` / `PR-CHARCOAL-IGNITION` / `off-to-stable` |
| camera | `S0-BRAZIER-FIXED-V1`, fixed 16:9, contain | 동일 camera |
| FHD visualBounds | `648,376,624,432` | `736,408,448,224` |
| 720 visualBounds | `432,251,416,288` | `491,272,299,149` |
| interactionBounds | FHD `752,480,416,288`; 720 `501,320,277,192` | `null` |
| layer / zOrder | `architecture / 20` | `vfx / 50` |

DOM safe rect는 FHD `128,936,1664,104`, 720 `85,624,1109,69`이며, bodyPartCount는 `0`이다.
카메라·envelope·interaction은 기존 preflight에서 변경하지 않았다.

## 이번 단일 후보의 포함과 제외

- 포함: 차가운 화로의 몸체·테두리·손잡이·다리, 숯을 받치는 내부 구조, 비시각 contact anchor metadata.
- 제외: **보이는 숯 조각**, 불씨·발광·불꽃·연기·재·spark·ignition mask, 손·팔·전신·도구,
  아키·노트·열쇠·대문, UI·문자·버튼·게이지·커서.
- 이 후보는 primary 구조물만 만든다. `PR-CHARCOAL-IGNITION`은 이번에 제작·합성·승인 요청하지 않는다.

## 분리·소비 불변식

- primary에는 companion의 보이는 숯 또는 VFX 픽셀이 전혀 들어가지 않는다.
- companion에는 화로 몸체 픽셀이 들어가지 않으며, child bounds는 primary interactionBounds로부터 파생하지 않는다.
- runtime은 최대 두 시각 layer(`z20`, `z50`)만 소비한다. 어느 한 exact ID가 없으면 해당 layer만
  placeholder로 남기며, 가까운 승인 asset으로 대체하거나 중복 렌더하지 않는다.
- 점화는 `S0-CHARCOAL-IGNITE`의 짧은 무실패 클릭 한 번이며 hidden target·점수·실패·추가 클릭을 만들지 않는다.

## 사용자 승인 질문

위 고정 계약과 제외 범위로, **차가운 `ST-S0-BRAZIER` primary 한 장만** 다음 픽셀 후보로 제작해도 될까요?
승인 전에는 화로·숯·점화 VFX·아키의 새 픽셀과 runtime handoff를 만들지 않습니다.

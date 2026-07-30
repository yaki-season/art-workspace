# `BG-EXTERIOR-S0-GATE-OPEN / gate-open-empty-interior` R1 단일 후보

- 상태: `approved-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId / requiredAssetId / stateVariant: `prologue.exterior.background / BG-EXTERIOR-S0-GATE-OPEN / gate-open-empty-interior`
- Developer 2 state-specific exterior contract: `v2.0.0`
- sourceMasterId: `CM-PROLOGUE-INHERITANCE-R1`
- camera / layer: `S0-EXTERIOR-FIXED-V1` / `background / z0`
- interactionBounds: `null`; bodyPartCount: `0`; runtimeRegistrationAllowed: `false`
- styleProfile: `YS-HANDCRAFTED-NIGHT-v1`
- composition input: approved `PR-SHOP-GATE-S0 / open R6` geometry (`gate-open-screen-production-input`)

## 단일 후보와 상태 의미

`assets/bg-exterior-s0-gate-open-r1-pixel-fhd.png`은 승인된 closed R2와 같은 fixed camera·파사드·골목·
픽셀 팔레트를 유지한다. 중앙만 R6의 넓은 양개문 열림 기하로 교체했고, 개구부에는 비어 있고 차가운
작은 점포 내부가 보인다. 열린 문짝도 R2의 굵은 픽셀 군집·계단 윤곽·2~4단계 명암으로 다시 그렸다.

## 포함 / 제외와 open 판정

| 포함 | 제외 |
|---|---|
| 동일한 젖은 밤 골목·목조 파사드·접힌 노렌·무문자 꺼진 간판, R6 기하의 열린 양개문, 빈·차가운 실내와 카운터 실루엣 | 닫힌 대문 pixel, 열쇠·노트·숯·화로 불빛·아키, 인물·손·팔·전신, UI·문자·버튼·게이지·커서, 추가 phase |

**열림 판정: 통과.** 중앙 개구부는 문턱부터 lintel까지 비어 있으며, 두 문짝은 바깥으로 열려 좌우
jamb에 머문다. `BG-EXTERIOR-S0-CLOSED`의 닫힌 문 pixel은 남기지 않았다.

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/bg-exterior-s0-gate-open-r1-pixel-source.png` | 1672×941 opaque RGB | `ad90f608666614e59f15eb4cbbc5cbb416f8238925b7a590b5ac8c213d15dc14` | built-in imagegen edit 원본 |
| `assets/bg-exterior-s0-gate-open-r1-pixel-fhd.png` | 1920×1080 opaque RGB | `c97f4c435a2d5ab78e8603879dfbad79a5a4569963d939b9ae354aefb42d6f6a` | 사용자 승인 대상 |

- FHD visualBounds: `0,0,1920,1080`; DOM safe: `128,936,1664,104`.
- 720 visualBounds: `0,0,1280,720`; DOM safe: `85,624,1109,69`.
- GATE approved harness는 exact `BG-EXTERIOR-S0-GATE-OPEN`, `S0-EXTERIOR-FIXED-V1`, body `0`,
  `S0-STATE-GATE` DOM contract만 소비했다. 세부 캡처 SHA는
  [`recomposition/RECOMPOSITION-REPORT.md`](recomposition/RECOMPOSITION-REPORT.md)에 기록했다.

## 승인 후 다음 단일 gate

R1 background 승인 뒤에도 key/gate 실제 전체 화면 finalizer·최적화·runtime handoff를 시작하지
않는다. 그 다음 작업은 approved background 소비 규칙과 finalizer 범위의 별도 확인이다. 숯·화로·아키는
exterior cycle 완료 전 시작하지 않는다.

# `BG-EXTERIOR-S0-CLOSED / closed` R1 단일 후보

- 상태: `rejected-before-user-review-style-violation` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-KEY / exterior-key / S0-KEY-SELECT`
- componentId / requiredAssetId / stateVariant: `prologue.exterior.background / BG-EXTERIOR-S0-CLOSED / closed`
- Developer 2 state-specific exterior contract: `v2.0.0`
- sourceMasterId: `CM-PROLOGUE-INHERITANCE-R1` (읽기 전용 분위기·질감 참조)
- camera / layer: `S0-EXTERIOR-FIXED-V1` / `background / z0`
- interactionBounds: `null`; bodyPartCount: `0`; runtimeRegistrationAllowed: `false`

## 철회 사유

R1은 `YS-HANDCRAFTED-NIGHT-v1`의 2D 픽셀 배경 요구를 충족하지 못한 painterly 결과다. 특히 굵은
픽셀 군집·계단형 윤곽·제한 팔레트·무안티앨리어싱이 없어 사용자 검토 전 철회했다. 이 파일과 R1
재조립 SHA는 최종 후보·runtime·후속 style reference로 사용하지 않는다. 교체 후보는 R2다.

## 철회된 단일 후보

`assets/bg-exterior-s0-closed-r1-fhd-folded-noren.png`은 1920×1080 full-frame opaque RGB PNG다.
비 갠 밤의 젖은 골목에서 작은 목조 점포 정면을 고정 카메라로 바라본다. 중앙의 넓은 양개문은
문턱부터 lintel까지 완전히 닫혀 있고, 간판은 꺼져 있으며 문 위 노렌은 접혀 있다.

## 포함 / 제외와 닫힘 판정

| 포함 | 제외 |
|---|---|
| 젖은 돌바닥·억제된 반사, 닫힌 인접 점포, 작은 목조 파사드, 중앙 완전 닫힘 양개문, 무문자 꺼진 간판, 접힌 노렌 | 열쇠, 열린 대문·R6, 실내·열린 구멍, 숯·화로·노트·아키, 손·팔·전신, UI·문자·버튼·게이지·커서, 추가 phase |

**닫힌 대문 판정: 통과.** 중앙 문짝은 불투명 목재와 잠금부로 이어지며, 틈·창·실내광·실내 공간이
보이는 개구부가 없다. GATE 전용 ID `BG-EXTERIOR-S0-GATE-OPEN`과 승인 R6은 이 후보에 포함하지 않았다.

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/bg-exterior-s0-closed-r1-folded-noren-source.png` | 1672×941 opaque RGB | `33e292446410eaebd5465b6237ea7b8084e0c79ac46ad4d3c06ccbbe5b4fadfb` | built-in imagegen edit 원본 |
| `assets/bg-exterior-s0-closed-r1-fhd-folded-noren.png` | 1920×1080 opaque RGB | `fbfdd900bed14fc5304a5787aed9953fc28c2c6f2f32307253912635e3300a1d` | 사용자 승인 대상 |

- FHD visualBounds: `0,0,1920,1080`; DOM safe: `128,936,1664,104`.
- 720 visualBounds: `0,0,1280,720`; DOM safe: `85,624,1109,69`.
- KEY approved harness는 exact `BG-EXTERIOR-S0-CLOSED`, `S0-EXTERIOR-FIXED-V1`, body `0`,
  `S0-STATE-KEY` DOM contract만 소비했다. 세부 캡처 SHA는
  [`recomposition/RECOMPOSITION-REPORT.md`](recomposition/RECOMPOSITION-REPORT.md)에 기록했다.

## 사용자 승인 후 다음 단일 gate

R1 background 승인 뒤에만 같은 fixed camera의 `BG-EXTERIOR-S0-GATE-OPEN` 한 장을 두 번째 후보로
제작한다. 그 전에는 key/gate 실제 전체 화면 finalizer·최적화·runtime handoff 및 숯·화로·아키 작업을
하지 않는다.

# `BG-EXTERIOR-S0-CLOSED / closed` R2 단일 후보 — 픽셀 밤 골목

- 상태: `approved-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-KEY / exterior-key / S0-KEY-SELECT`
- componentId / requiredAssetId / stateVariant: `prologue.exterior.background / BG-EXTERIOR-S0-CLOSED / closed`
- Developer 2 state-specific exterior contract: `v2.0.0`
- sourceMasterId: `CM-PROLOGUE-INHERITANCE-R1` (읽기 전용 분위기·질감 참조)
- camera / layer: `S0-EXTERIOR-FIXED-V1` / `background / z0`
- interactionBounds: `null`; bodyPartCount: `0`; runtimeRegistrationAllowed: `false`
- styleProfile: `YS-HANDCRAFTED-NIGHT-v1`
- style reference: `docs/inbox/2.art-concept/01_shop_exterior_torikoyomi.png` (무드·픽셀 밀도만 참조; 구성·문자·열린 실내는 불사용)

## 단일 후보와 스타일 판정

`assets/bg-exterior-s0-closed-r2-pixel-fhd.png`은 1920×1080 full-frame opaque RGB PNG다. 의도적인
굵은 픽셀 군집, 계단형 지붕·문 윤곽, 2~4단계 명암 덩어리와 인디고 밤·호박빛 반사·짙은 목재의
제한 팔레트를 사용한다. 흐린 필터·사진/PBR 질감·부드러운 에어브러시 그라데이션은 사용하지 않았다.

## 포함 / 제외와 닫힘 판정

| 포함 | 제외 |
|---|---|
| 비 갠 밤의 젖은 골목, 닫힌 인접 점포, 작은 목조 파사드, 중앙 완전 닫힘 양개문, 무문자 꺼진 간판, 접힌 노렌 | 열쇠, 열린 대문·R6, 실내·열린 구멍, 숯·화로·노트·아키, 손·팔·전신, UI·문자·버튼·게이지·커서, 추가 phase |

**닫힌 대문 판정: 통과.** 중앙 문짝은 불투명 목재와 잠금부로 이어지고, 실내광·창·틈·열린
개구부가 없다. `BG-EXTERIOR-S0-GATE-OPEN` 및 R6은 포함하지 않았다.

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/bg-exterior-s0-closed-r2-pixel-source.png` | 1672×941 opaque RGB | `8f900f768ce4c6c7fc3c41815a75577b8ddf06e013a619fd947d485706c40856` | built-in imagegen 원본 |
| `assets/bg-exterior-s0-closed-r2-pixel-fhd.png` | 1920×1080 opaque RGB | `504bc88e874a53e6a69e7dcfaad11cc949b654166d17815cae15a9948e67be21` | 사용자 승인 대상 |

- FHD visualBounds: `0,0,1920,1080`; DOM safe: `128,936,1664,104`.
- 720 visualBounds: `0,0,1280,720`; DOM safe: `85,624,1109,69`.
- KEY approved harness는 exact `BG-EXTERIOR-S0-CLOSED`, `S0-EXTERIOR-FIXED-V1`, body `0`,
  `S0-STATE-KEY` DOM contract만 소비했다. 세부 캡처 SHA는
  [`recomposition/RECOMPOSITION-REPORT.md`](recomposition/RECOMPOSITION-REPORT.md)에 기록했다.

## 승인 후 다음 단일 gate

R2 background 승인 뒤에만 같은 fixed camera의 `BG-EXTERIOR-S0-GATE-OPEN` 한 장을 두 번째 후보로
제작한다. 그 전에는 key/gate 실제 전체 화면 finalizer·최적화·runtime handoff 및 숯·화로·아키 작업을
하지 않는다.

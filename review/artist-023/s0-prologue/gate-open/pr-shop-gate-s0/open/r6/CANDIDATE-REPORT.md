# `PR-SHOP-GATE-S0 / open` R6 단일 후보 — 높아진 불투명 목제 격자 양개문

- 상태: `approved-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId: `prologue.gate`
- requiredAssetId / stateVariant: `PR-SHOP-GATE-S0 / open`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- camera: `S0-EXTERIOR-FIXED-V1` — `exterior-key`와 같은 fixed 16:9
- runtimeRegistrationAllowed: `false`

## R5 대비 변경

- 문틀·기둥·두 문짝을 위아래로 확장하여 중앙 개구부의 세로 비례를 약 `25%` 키웠다.
- 가로 폭, 문이 양옆으로 열리는 방식, 각 문짝의 불투명 목재 격자와 바깥 경첩은 유지했다.
- 닫힘 때 각 문짝은 FHD visual width `608px`의 절반 `304px`를 덮고, 열림 때 문틀 안쪽 전체 폭이 열린다는
  topology는 변경하지 않았다.

## 포함 / 제외

| 포함 | 제외 |
|---|---|
| 세로로 높아진 넓은 양개문, 불투명 목제 backing 위 세로·가로 격자, 바깥 경첩, 최소 문틀·문턱 | 점포 외관·지붕·간판·제등·noren·실내·골목, 인물·손·팔·전신, 열쇠·노트·화로·숯, raster UI·문자·커서 |

`BG-EXTERIOR-S0-CLOSED`는 Developer 2 component/bounds/layer 행이 없어 `unassigned`다.

## 계약 적용 예정값

- FHD visual / interaction: `656,176,608,704 / 720,224,480,624`
- 720 visual / interaction: `437,117,405,469 / 480,149,320,416`
- layer/z-order: `architecture / 20`
- DOM safe rect FHD / 720: `128,936,1664,104 / 85,624,1109,69`

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/pr-shop-gate-s0-open-r6-chroma.png` | 1536×1024 PNG | `9deaed2821b4b614b0baa8a537829a1c628da672ff5bf8b877e38667d4b790ad` | built-in imagegen edit 원본 |
| `assets/pr-shop-gate-s0-open-r6.png` | 1536×1024 RGBA PNG | `db0bb8dde213b28f4cfccad9f6153a699174d06f7ede4e2082ab69a013f6b82f` | 사용자 검토 대상 |

`remove_chroma_key.py`의 border auto-key·soft matte·despill 처리 결과, 투명 1,037,357px·반투명
6,483px이다. 좌·우 격자판 내부 표본 alpha는 모두 `255`, 중앙 개구부 표본 alpha는 `0`이다.
문자·UI·인물·플레이어 신체는 없다.

## 재조립 상태와 다음 단일 gate

R6 alpha 자산 하나만 Developer 2 approved harness에서 FHD/720 재조립 캡처했다. 결과는
[`recomposition/RECOMPOSITION-REPORT.md`](recomposition/RECOMPOSITION-REPORT.md)에 기록했다.
이는 배치 계약 검수본이며 실제 외관 화면이 아니다. 배경·숯·아키 초상은 병행 생성하지 않았다.

다음 단일 gate는 사용자의 FHD/720 계약 재조립 승인이다.

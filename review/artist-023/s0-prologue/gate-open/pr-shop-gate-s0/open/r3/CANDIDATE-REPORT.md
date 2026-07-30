# `PR-SHOP-GATE-S0 / open` R3 단일 후보

- 상태: `superseded-by-r5` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId: `prologue.gate`
- requiredAssetId / stateVariant: `PR-SHOP-GATE-S0 / open`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- camera: `S0-EXTERIOR-FIXED-V1` — `exterior-key`와 같은 fixed 16:9
- runtimeRegistrationAllowed: `false`

## 문 동작·공간 계약

이 후보의 양쪽 목제 문짝은 **양개 여닫이문**이다. 닫힘 상태에서는 계약 visual width `608px`를 좌·우
각 `304px` 문짝이 반씩 덮어 중앙에서 맞물린다. 열림 상태에서는 양쪽 바깥 경첩을 축으로 외측 약 90°
회전하며, 문틀 안쪽의 폭 `608px` 전체가 빈 입구로 남는다.

따라서 닫힘이 가리는 것은 중앙 점포 개구부의 실내·후면 공간 전부이고, 열림이 보이는 것은 그 같은
`608px` 폭의 입구 전부다. 열린 문짝은 원근상 좌우로 물러나 보이지만, 작거나 별도인 문이 아니다.

## 포함 / 제외

| 포함 | 제외 |
|---|---|
| 같은 폭의 넓은 목제 문짝 2장, 바깥 경첩, 얇은 문틀·문턱, 완전히 비워진 중앙 개구부 | 배경·건물·지붕·간판·제등·noren·실내·골목, 인물·손·팔·전신, 열쇠·노트·화로·숯, UI·문자·커서 |

문틀은 문짝의 닫힘·열림 폭을 판단하기 위한 최소 구조이고, 점포 외관 배경은 포함하지 않는다.
`BG-EXTERIOR-S0-CLOSED`는 Developer 2 contract에 row가 없어 `unassigned`로 유지한다.

## 계약 적용 예정값

- FHD visual / interaction: `656,176,608,704 / 720,224,480,624`
- 720 visual / interaction: `437,117,405,469 / 480,149,320,416`
- layer/z-order: `architecture / 20`
- DOM safe rect FHD / 720: `128,936,1664,104 / 85,624,1109,69`

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/pr-shop-gate-s0-open-r3-chroma.png` | 1536×1024 PNG | `89546e6b478cfd2de29bfed4798c71226436902a578e3718908511d252d57cdf` | built-in imagegen chroma 원본 |
| `assets/pr-shop-gate-s0-open-r3.png` | 1536×1024 RGBA PNG | `b3fa7d9823acc9088aed442625b8f6b4c85654b18778fc94de9901983e80c5a2` | 사용자 검토 대상 |

`remove_chroma_key.py`의 border auto-key·soft matte·despill 처리 결과, 1,572,864px 중 투명
999,417px·반투명 5,929px이다. 문자·UI·인물·플레이어 신체는 포함하지 않는다.

## 사용자 승인 후 다음 단일 gate

R3가 승인되면 이 alpha 자산 하나만 Developer 2 approved harness에 FHD/720 재조립한다. 배경·숯·아키
초상은 병행 생성하지 않는다.

## 대체 기록

사용자 요청에 따라 문짝 표면에 격자형 목제 장식을 추가하는 revision을 진행했다. R4는 격자 사이가
투명으로 추출되어 닫힘 상태의 완전 차폐 조건에 맞지 않아 제출하지 않았다. R5는 같은 문폭·회전·개구부를
보존하고, 격자 모든 칸 뒤에 불투명 목재 backing을 둬 R3를 대체한다.

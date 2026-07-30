# `PR-SHOP-GATE-S0 / open` R5 단일 후보 — 불투명 목제 격자 양개문

- 상태: `approved-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId: `prologue.gate`
- requiredAssetId / stateVariant: `PR-SHOP-GATE-S0 / open`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- camera: `S0-EXTERIOR-FIXED-V1` — `exterior-key`와 같은 fixed 16:9
- runtimeRegistrationAllowed: `false`

## 동작·공간 불변식

- 닫힘: 같은 폭의 두 문짝이 FHD visual width `608px`를 좌·우 각 `304px`씩 완전히 덮는다.
- 열림: 두 문짝이 바깥 경첩을 축으로 회전해 문틀 양옆으로 물러나고, 문틀 안쪽 `608px` 전부가 열린다.
- 격자: 세로·가로 목제 rail은 장식이며, 모든 격자 칸 뒤에 불투명 짙은 목재 backing이 있다. 닫힘 때
  빛·배경·공간이 격자 사이로 새지 않는다.

## 포함 / 제외

| 포함 | 제외 |
|---|---|
| 넓은 양개문 2장, 불투명 목제 backing 위의 세로·가로 격자 장식, 바깥 경첩, 최소 문틀·문턱 | 점포 외관·지붕·간판·제등·noren·실내·골목, 인물·손·팔·전신, 열쇠·노트·화로·숯, raster UI·문자·커서 |

`BG-EXTERIOR-S0-CLOSED`는 Developer 2의 component/bounds/layer 행이 없어 `unassigned`다.

## 계약 적용 예정값

- FHD visual / interaction: `656,176,608,704 / 720,224,480,624`
- 720 visual / interaction: `437,117,405,469 / 480,149,320,416`
- layer/z-order: `architecture / 20`
- DOM safe rect FHD / 720: `128,936,1664,104 / 85,624,1109,69`

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/pr-shop-gate-s0-open-r5-chroma.png` | 1536×1024 PNG | `727ec9645d5e83ffa747caf24dd1efe7010f110e5885701c450b4d461ba9f6d5` | built-in imagegen edit 원본 |
| `assets/pr-shop-gate-s0-open-r5.png` | 1536×1024 RGBA PNG | `2b02e6a18fc9dd5fed80fbdce170e14e542fb455dc8a41b5340223d9f075e2e1` | 사용자 검토 대상 |

`remove_chroma_key.py`의 border auto-key·soft matte·despill 처리 결과, 1,572,864px 중 투명
1,000,265px·반투명 5,780px이다. 문짝 격자 중앙의 표본 pixel은 모두 alpha `255`로 확인했다.
문자·UI·인물·플레이어 신체는 없다.

## 재조립 상태와 다음 단일 gate

R5 alpha 자산만 Developer 2 approved harness에서 FHD/720 재조립 캡처했다. 결과는
[`recomposition/RECOMPOSITION-REPORT.md`](recomposition/RECOMPOSITION-REPORT.md)에 기록했다.
이는 배치 계약 검수본이며 실제 외관 화면이 아니다. 배경·숯·아키 초상은 병행 생성하지 않았다.

다음 단일 gate는 사용자의 FHD/720 계약 재조립 승인이다.

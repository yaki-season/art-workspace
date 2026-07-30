# `S0-STATE-KEY` 실제 소비 화면 R1 — 사용자 최종 검수 대기

- 상태: `pending-user-review`; `PR-SHOP-KEY` finalizer는 아직 금지
- 화면: `SCR-STORY-PROLOGUE / S0-STATE-KEY / exterior-key / S0-KEY-SELECT`
- 조립: `BG-EXTERIOR-S0-CLOSED R2` z0 + `PR-SHOP-KEY / placed R1` z40
- camera: `S0-EXTERIOR-FIXED-V1`; 신체 부위: `0`
- background harness: Developer 2 state-specific exterior binding `v3.0.0`
- action UI: harness의 native DOM `button`만 사용했고, 어느 raster에도 버튼·문자·커서·진행 UI를 추가하지 않았다.

| 입력·출력 | SHA-256 | 규격 |
|---|---|---:|
| CLOSED R2 승인 원본 | `504bc88e874a53e6a69e7dcfaad11cc949b654166d17815cae15a9948e67be21` | 1920×1080 |
| KEY R1 승인 원본 | `a8a22c3beaa6a4ffa1b45dad6eb4438eda729d325740ad9bcb265d3363229eeb` | RGBA |
| FHD DOM-harness 소비 검수 | `33d62caebc38c80cddc48431b227aadbb6785b27d699597e2e0a7f71ca7efa99` | 1920×1080 |
| 720 DOM-harness 소비 검수 | `e7cccf69c8208805d08a00ea51634d5963c6bc9a8319f94bd6f60c345c7f54e5` | 1280×720 |

## 계약 검증

- background exact ID는 `BG-EXTERIOR-S0-CLOSED`이고, `BG-EXTERIOR-S0-GATE-OPEN`은 없다.
- key exact ID는 `PR-SHOP-KEY`; FHD visual `256,650,224,150`, z40이다.
- FHD interaction `224,614,288,222`; 720 visual `171,433,149,100`, interaction `149,409,192,148`이다.
- DOM safe는 FHD `128,936,1664,104`, 720 `85,624,1109,69`이며 key visual은 safe rect와 겹치지 않는다.
- CLOSED와 KEY의 승인 파일만 소비했다. 새 생성·색보정·크롭·리사이즈·별도 이미지 레이어는 없다.

## 검수 질문과 다음 gate

이 화면의 **closed background 위 key 위치·가독성·DOM 비침범**을 최종 승인할지 확인한다.
승인 뒤에만 `PR-SHOP-KEY`의 lossless optimization·final approval·finalizer를 별도 bundle로 시작한다.

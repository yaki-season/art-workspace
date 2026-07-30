# `PR-SHOP-GATE-S0 / open` R2 단일 후보

- 상태: `superseded-by-r3` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- componentId: `prologue.gate`
- requiredAssetId / stateVariant: `PR-SHOP-GATE-S0 / open`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- camera: `S0-EXTERIOR-FIXED-V1` — `exterior-key`와 동일 fixed 16:9
- runtimeRegistrationAllowed: `false`

## 이번 교정

R1의 독립 성문 실루엣을 반려하고, 공유 `CM-PROLOGUE-INHERITANCE-R1`의 **작은 야키토리 점포 전면**
비례와 젖은 밤의 억제된 목재 색 관계만 style reference로 삼았다. master 자체는 수정·복사·runtime
source로 사용하지 않았다.

R2는 열린 점포 출입구 양끝으로 밀려난 두 장의 낮은 목제 미닫이문만 담는다. 중앙의 넓은 빈 영역은
별도 exterior background가 제공할 점포 내부·골목 개구부이며, 문틀·처마·기둥·간판은 background의
책임이다. 따라서 제단·성문·신사문이 아니라 작은 점포의 열린 미닫이문으로 읽혀야 한다.

## 포함 / 제외

| 포함 | 제외 |
|---|---|
| 좌우 끝의 짙은 목제 미닫이문 2장, 작은 검은 pull, 젖은 밤의 얇은 호박색 edge light | 건물·지붕·기둥·문틀·간판·제등·noren, 배경·실내·골목, 인물·손·팔·전신, 열쇠·노트·화로·숯, UI·문자·커서 |

`BG-EXTERIOR-S0-CLOSED`는 Developer 2의 component/bounds/layer 행이 없어 계속 `unassigned`다.

## 계약 적용 예정값

- FHD visual bounds: `656,176,608,704`
- FHD interaction bounds: `720,224,480,624`
- 720 visual / interaction: `437,117,405,469 / 480,149,320,416`
- layer/z-order: `architecture / 20`
- DOM safe rect FHD / 720: `128,936,1664,104 / 85,624,1109,69`

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/pr-shop-gate-s0-open-r2-chroma.png` | 1536×1024 PNG | `f923435f223df7d45e8350cd3fe3df7f73ac96112f42e94abec7c4453a36be31` | built-in imagegen chroma 원본 |
| `assets/pr-shop-gate-s0-open-r2.png` | 1536×1024 RGBA PNG | `5da0b19765254e39f113ec9322d9893bc5e805b881e0571adda5c9fc8f1b55a6` | 사용자 검토 대상 |

`remove_chroma_key.py`의 border auto-key·soft matte·despill 처리 결과, 1,572,864px 중 투명
1,127,576px·반투명 4,449px이다. 중앙과 모서리에는 배경 pixel이 남지 않았고 문자·UI·인물은 없다.

## 사용자 승인 후 다음 단일 gate

R2가 승인되면 이 alpha 자산 하나만 Developer 2 approved harness에 FHD/720 재조립한다. 배경·숯·아키
초상은 생성하지 않는다.

## 대체 기록

사용자 검토에서 닫힘 상태일 때 실제로 무엇을 가리고, 열림 상태에서 얼마나 넓은 공간을 보여 주는지가
불명확하다고 확인됐다. R2는 열린 문짝 폭만으로 닫힘의 전체 개구부를 덮을 수 없으므로 R3로 대체한다.

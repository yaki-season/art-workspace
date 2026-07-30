# `PR-SHOP-GATE-S0 / open` R1 단일 후보

- 상태: `rejected-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-GATE / gate-open / S0-GATE-OPEN`
- Developer 2 계약: 작업 007 `v1.1.0` / app binding contract `v1.0.0`
- componentId: `prologue.gate`
- requiredAssetId / stateVariant: `PR-SHOP-GATE-S0 / open`
- contract camera: `S0-EXTERIOR-FIXED-V1` — key phase와 동일 16:9 fixed camera
- runtimeRegistrationAllowed: `false`

## 포함

- 정면 중앙의 열린 짙은 목제 양문, 문틀, 문턱, 경첩, 짧은 남색 noren.
- 열쇠 phase와 동일한 중앙 출입구의 개구부를 유지하는 `gate-open` 단일 건축 레이어.
- alpha PNG 하나. FHD 시각 bounds `656,176,608,704`, interaction bounds `720,224,480,624`,
  layer/z `architecture / 20`은 재조립 시에만 적용한다.

## 제외

- 외관 배경, 젖은 골목, 실내, 인물·손·팔·전신, 열쇠, 노트, 화로·숯, 불꽃.
- raster 문자·버튼·진행 표시·커서·건너뛰기·워터마크.
- `BG-EXTERIOR-S0-CLOSED`는 Developer 2 계약에 component/bounds/layer가 없어 `unassigned`로 유지한다.

## 산출물과 검증

| 파일 | 규격 | SHA-256 | 용도 |
|---|---:|---|---|
| `source/pr-shop-gate-s0-open-r1-chroma.png` | 1024×1536 PNG | `c24c4433f3a88be6a45ec5df99341106e79478b3397f1f1df489ff417bd5e07e` | built-in imagegen 원본, 균일 chroma 배경 |
| `assets/pr-shop-gate-s0-open-r1.png` | 1024×1536 RGBA PNG | `c822903816f5b246ffcbbb9f68df817a679f94ce3dbb814218d2b9fe8bde0cc1` | chroma 제거 후 검토 대상 |

`remove_chroma_key.py`로 border auto-key·soft matte·despill을 적용했다. 결과는
1,572,864px 중 투명 991,307px, 반투명 8,236px이며 인물·UI·문자 요소를 포함하지 않는다.

## 사용자 승인 후 다음 단일 gate

이 후보가 승인되면 이 파일 하나만 Developer 2 approved harness에 넣어 FHD/720 재조립 검토를
한 건 만든다. 배경·숯·아키 초상은 병행 생성하지 않는다.

## 반려 기록

사용자 검토에서 독립된 성문·신사문처럼 보인다는 이유로 반려됐다. 이 R1은 runtime·재조립에
사용하지 않는다. R2는 점포 개구부 양끝에 밀려난 목제 미닫이문만 남기고, 지붕·기둥·문틀·간판을
제거해 배경 레이어와의 책임을 분리했다.

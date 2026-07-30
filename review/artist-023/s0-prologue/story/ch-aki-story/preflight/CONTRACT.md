# `CH-AKI-STORY` 무픽셀 preflight — 아사노 아키 이야기 초상

- 상태: `preflight-only`; 생성 source·raster·runtime bundle·manifest entry 없음
- semanticOwner: `artist-2.s0-prologue-story`
- stable ID: `CH-AKI-STORY` (Artist 2만 수정)
- 인물: 아사노 아키, 29세, 중성적 인상. 짧은 흑갈색 머리·피곤한 눈매·마른 체형·걷어 올린 셔츠·짙은 남색 앞치마.

## 소비 범위

| 허용 화면 | 현재 구현 식별자 | 역할 |
|---|---|---|
| 이야기 | `SCR-STORY-BEAT` / `SCN-S0-DECISION` 및 후속 story beat | 대사 화자·결심·집중의 story-only portrait |
| 정산 | `SCR-POST-SETTLEMENT` | 영업 뒤의 실수 반성·안도·다음 결심을 보조하는 story/settlement portrait |

영업·조리·S0 상호작용 화면에는 사용하지 않는다. 따라서 `S0-STATE-KEY`, `S0-STATE-GATE`,
`S0-STATE-CHARCOAL`에는 `CH-AKI-STORY` raster·손·팔·전신이 없다.

## 표정·연출 계약

`CH-AKI-STORY` 원본은 같은 외형과 제한 팔레트를 유지하며, 대사·DOM이 아닌 얼굴/자세의 미세한 변화로
다음 네 의미를 표현할 수 있어야 한다. 별도의 구형 인물 ID나 새 인물을 만들지 않는다.

| 의미 | 시각 의도 | 금지 |
|---|---|---|
| 피로 | 무거운 눈꺼풀·가라앉은 어깨, 과장 없는 기색 | 병색 과장, 눈물, 공포 연출 |
| 집중 | 시선이 정리되고 턱/어깨가 안정된 상태 | 조리 조작·손 동작·도구 |
| 실수 | 잠깐 굳은 눈매와 자책의 정지 | 코믹한 찡그림, 실패 UI, 점수 표식 |
| 안도 | 눈매가 약간 풀리고 긴장이 내려간 상태 | 과도한 미소, 승리 포즈, 보상 UI |

## Developer 2 계약이 확정해야 할 항목

아래 항목은 현재 앱의 글자형 placeholder(`秋`)에 pixel bounds/layer가 없으므로 **unassigned**다.
숫자·camera·layer를 추측하지 않는다.

| 필드 | 상태 |
|---|---|
| runtime `componentId`, `requiredAssetId=CH-AKI-STORY`, story stateVariant set | **unassigned** |
| story/settlement별 sourceMasterId 사용 규칙 | **unassigned** |
| FHD/720 portrait visualBounds | **unassigned** |
| portrait interactionBounds | story portrait는 비클릭 대상이므로 `null` 여부를 Developer 2가 확정 |
| layer / zOrder | **unassigned** |
| FHD/720 DOM safe rect | **unassigned** |
| runtime component의 story-only guard | **unassigned** |

`CH-OWNER-STORY`는 구형/비소비 ID로 취급한다. 이 preflight의 source·후보·runtime handoff·manifest에
재사용하거나 등록하지 않는다.

## 다음 gate

Developer 2의 versioned portrait binding과 사용자 preflight 승인이 모두 온 뒤에만, `CH-AKI-STORY`의
단일 원본 후보 한 장을 제작한다. 그 전에는 어떤 아키 pixel·표정 variant·runtime handoff도 만들지 않는다.

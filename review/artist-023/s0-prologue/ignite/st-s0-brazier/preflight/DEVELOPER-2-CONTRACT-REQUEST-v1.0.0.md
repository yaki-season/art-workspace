# Developer 2 요청서 v1.0.0 — `ST-S0-BRAZIER` 제작 전 binding 확정

- 요청자: `artist-2.s0-prologue-story`
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-CHARCOAL / ignite / S0-CHARCOAL-IGNITE`
- 목적: 사용자 preflight 승인 뒤 **차가운 `ST-S0-BRAZIER` 단일 후보 한 장**만 안전하게 제작할 수 있도록
  versioned binding을 확정한다.
- 이 요청은 이미지·source·runtime manifest를 만들거나 변경하지 않는다.

## 변경 불가인 기존 component envelope

| viewport | visualBounds | interactionBounds | DOM safe rect |
|---|---|---|---|
| FHD | `648,376,624,432` | `752,480,416,288` | `128,936,1664,104` |
| 720 | `432,251,416,288` | `501,320,277,192` | `85,624,1109,69` |

camera는 `S0-BRAZIER-FIXED-V1` fixed `16:9` / `contain`, semantic owner는
`artist-2.s0-prologue-story`, bodyPartCount는 `0`으로 고정한다. 이 envelope과 interaction bounds를
변경하거나 새로운 phase를 추가하지 않는다.

## Developer 2가 하나의 versioned handoff에 확정할 필드

| 필드 | 현재 상태 | 요청 값 또는 필요한 결정 |
|---|---|---|
| `sourceMasterId` | **unassigned** | `ST-S0-BRAZIER` 제작 provenance가 소비할 exact master ID 및 camera/topology 사용 범위 |
| primary/companion 분리 규칙 | **unassigned** | `ST-S0-BRAZIER`가 차가운 화로 몸체·숯 contact anchor까지만 소유하고, `PR-CHARCOAL-IGNITION`이 어떤 숯/발광/VFX pixel을 독점하는지. 겹침·중복 raster 금지 규칙 포함 |
| `PR-CHARCOAL-IGNITION` child visualBounds | **unassigned** | FHD와 720 각각의 `x,y,width,height`; parent interactionBounds를 child bounds로 추정하지 않음 |
| primary / companion layer + zOrder | component table에는 확인됨, version stamp 필요 | `ST-S0-BRAZIER`: `architecture / 20`; `PR-CHARCOAL-IGNITION`: `vfx / 50`을 그대로 재확인하거나 교체값을 명시 |
| runtime component / variant binding | component table에는 확인됨, version stamp 필요 | primary `prologue.brazier-and-charcoal / ST-S0-BRAZIER / cold-to-ignited`; companion `prologue.ignitionVfx / PR-CHARCOAL-IGNITION / off-to-stable` |

## 첫 후보 제한

인계와 사용자 preflight 승인 뒤 첫 후보는 `ST-S0-BRAZIER / cold-to-ignited`의 **차가운 화로 단독**이다.
불씨·불꽃·연기·점화 VFX·손·팔·전신·도구·UI·문자·커서·아키·노트·열쇠·대문은 포함하지 않는다.
`PR-CHARCOAL-IGNITION`은 별도 계약·후속 gate 전까지 만들거나 합성하지 않는다.

## 수락 기준

Developer 2 handoff에는 version, componentId, requiredAssetId, stateVariant, sourceMasterId, FHD/720
visualBounds, interactionBounds, layer/zOrder, DOM safe rect, bodyPartCount, primary/companion split 및
no-double-render rule이 모두 있어야 한다. 누락 필드는 `unassigned`로 유지되며 Artist 2는 추측하지 않는다.

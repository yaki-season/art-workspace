# `ST-S0-BRAZIER / cold-to-ignited` R1 — 사용자 반려 보존 기록

- 상태: `rejected-by-user; do-not-resubmit`
- asset: `ST-S0-BRAZIER`, source revision `1`, `standalone-raster`
- semanticOwner: `artist-2.s0-prologue-story`
- screen/state/phase/interaction: `SCR-STORY-PROLOGUE / S0-STATE-CHARCOAL / ignite / S0-CHARCOAL-IGNITE`
- component / variant: `prologue.brazier-and-charcoal / cold-to-ignited`
- sourceMasterId: `CM-PROLOGUE-INHERITANCE-R1` (읽기 전용 분위기·pixel-density 참조만 사용)

## 후보 파일과 배치 계약

- primary PNG: `assets/st-s0-brazier-cold-r1.png`
- SHA-256: `df043cca7d3672e36792e3db6705a88a83a89a4fd916021f34c023605998bcbb`
- 규격: `624×432`, RGBA straight alpha, `181557` bytes
- FHD visualBounds: `648,376,624,432`; interactionBounds: `752,480,416,288`
- 720 visualBounds: `432,251,416,288`; interactionBounds: `501,320,277,192`
- camera: `S0-BRAZIER-FIXED-V1`, fixed 16:9 / contain
- layer / zOrder: `architecture / 20`
- DOM safe: FHD `128,936,1664,104`; 720 `85,624,1109,69`
- bodyPartCount: `0`

## 시각 판정

차가운 팔각 철제 화로통·두 손잡이·네 다리·빈 내부 basin과 금속 받침만 표시한다. 짙은 남청색
outline과 절제된 청회색/갈색 반사광으로 기존 비 갠 밤 픽셀 외관의 조명 방향을 따른다.

- 포함: 화로 몸체·테두리·손잡이·다리, 빈 metal support grate, 숯 contact anchor의 구조적 의미.
- 제외: 보이는 숯 조각, 불씨·발광·불꽃·연기·재·spark·ignition mask, 손·팔·전신·도구,
  아키·노트·열쇠·대문, raster UI·문자·버튼·게이지·커서.
- companion `PR-CHARCOAL-IGNITION`은 이번 후보에 픽셀·합성·등록되지 않았다. 해당 child bounds와
  `vfx / z50` 계약은 후속 독립 gate에서만 소비한다.

## 생성·alpha 검증

- raw chroma source: `source/st-s0-brazier-cold-r1-chroma-source.png`
- raw SHA-256: `7ca345f13aacaaa747d6ef6bc873d0a8925832490fea00ed5b8b4b6442dc7ca8`
- 방식: built-in image generation → flat `#00ff00` chroma source → 624×432 contract canvas → soft-matte
  chroma removal / despill.
- alpha: PNG RGBA 확인. transparent pixels `172488 / 269568`, partially transparent edge pixels `1810`.
- 생성 후 색보정·추가 object 합성·crop은 하지 않았다. 이 R1로 optimizer·recomposition·final approval·
  finalizer·runtime handoff를 생성하지 않는다. `runtimeRegistrationAllowed=false`.

## 사용자 반려 확정

2026-08-02 사용자 최신 확정에 따라 이 R1은 과거 Artist가 강한 반려 피드백을 받은 산출물이며,
승인 후보로 다시 제출할 수 없다. 2026-08-01 PM이 이를 `pending-user-review`로 복구해 재승인 요청
대상으로 둔 것은 오류였으며 이 기록으로 철회한다.

R1의 primary PNG·raw chroma source·픽셀·SHA는 반려 경위와 중복 제작 방지를 위한 증거로만 보존한다.
optimizer·FHD/720 재조립·finalizer·runtime handoff·promotion·`PR-CHARCOAL-IGNITION` 제작의 입력이나
새 화로의 source·시각 reference로 재사용하지 않는다. 새 화로는 사용자·기획 방향이 확정되기 전까지
제작하지 않는다.

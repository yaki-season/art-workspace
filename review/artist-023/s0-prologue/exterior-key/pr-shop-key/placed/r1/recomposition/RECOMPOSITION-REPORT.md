# `PR-SHOP-KEY / placed` R1 FHD·720 재조립 검토

- 상태: `approved-by-user` (2026-07-30, 계약 재조립 기준)
- 대상: `SCR-STORY-PROLOGUE / S0-STATE-KEY / exterior-key / S0-KEY-SELECT`
- 입력: 사용자 승인 `PR-SHOP-KEY / placed` R1 하나
- harness: Developer 2 작업 007 `v1.1.0` / app `S0·D1 art binding contract v1.0.0`
- runtimeRegistrationAllowed: `false`

## 검토 결과

| viewport | capture | SHA-256 | 확인 |
|---|---|---|---|
| FHD `1920×1080` | `recomposition-pr-shop-key-placed-fhd-r1.png` | `43513a77f852fa7182f479afb75a88d5e3fb99cf96609d9f828a7472e256272d` | `assetRect=256,650,224,150`; interaction `224,614,288,222`; DOM safe `128,936,1664,104` |
| 720 `1280×720` | `recomposition-pr-shop-key-placed-hd-r1.png` | `03496adaa13912be5776c2c60eb673c705fa2634fea7dcc667a8772385af4b53` | FHD 논리 canvas의 `2/3 contain`; visual `171,433,149,100`; interaction `149,409,192,148`; DOM safe `85,624,1109,69` |

두 capture 모두 approved mode, `S0-EXTERIOR-FIXED-V1`, semantic owner
`artist-2.s0-prologue-story`, body-part count `0`으로 확인됐다. Harness의 DOM frame·문자·버튼은
재조립 검증용이며 key raster에 포함되지 않는다.

이 재조립은 계약 camera·DOM·bounds 검증용이다. 승인된 exterior background가 아직 없으므로
장면 배경을 새로 만들거나 기존 master를 runtime source로 사용하지 않았다.

사용자는 이 계약 재조립을 승인했으나, 실제 외관을 포함한 나머지 조립을 본 뒤 최종 판단하기를
요청했다. Developer 2 계약에는 `BG-EXTERIOR-S0-CLOSED`의 component/bounds/layer 행이 없으므로,
그 행이 배정되기 전에는 배경 생성·배치·최적화·finalizer를 진행하지 않는다. 현재 승인 범위는
`PR-SHOP-KEY / placed`의 계약 좌표 검증뿐이며 소비 화면 완성본 승격이 아니다.

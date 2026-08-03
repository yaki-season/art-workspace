# ST-DRINK-BEER-TIER-1 R4 approval source

- status: `approved-by-user` (2026-08-03)
- authoritative concept: `concept-masters/2026-07-26/06_drink-station-master.png`
- source type: imagegen review source
- source raster: `1672x941`, SHA-256 `f110c0d80ca2c0bd3f9cb1bc7ccb7396449f11b3cdb1bb3a60fc5af1e797adf9`
- approved meaning: 키가 큰 원통형 황동 탱크, 둥근 상부와 작은 캡, 전면 원형 밸브, 아래로 굽은 단일 탭, 세로 손잡이, 중앙 소형 타공 드립 트레이.
- excluded: 잔·맥주·거품·액체·VFX·사람·손·UI와 runtime 등록.

이 승인은 컨셉 정합 시각 source에만 적용한다. 다음 단계에서 station-only straight-alpha 자산으로 분리하고 정본 좌표의 FHD/720 소비 화면 및 v8 provenance를 검증한다.

## 분리·소비 화면 후보

- 투명 자산: `assets/st-drink-beer-tier-1-r4.png`; v8 FHD canvas alpha bounds `(826,258,268,505)`.
- FHD 배치: `(826,258,268,505)`; 720p는 같은 논리 좌표를 `2/3` 배율로 사용한다.
- 상태: `approved-by-user` (2026-08-03). FHD/720 소비 화면 최종 승인과 provenance/profile approval를 기록했다.
- lossless runtime build B1·finalizer·runtime handoff 완료. 개발자 promotion 전 app manifest 등록은 금지한다.

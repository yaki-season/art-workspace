# YAKI SEASON 아트 승인·runtime 인계 파이프라인

기계 판독 정본은 `pipeline-contract.json`이다. 이 문서는 사람이 작업 순서와 차단 이유를
빠르게 확인하기 위한 설명서다.

## 세 가지 제작 프로필

| 프로필 | 대상 | 개별 승인 증거 |
|---|---|---|
| `complete-layer` | FHD 장면 좌표를 유지하는 배경·인물·좌석·전경 layer | `completion-report.json` |
| `standalone-raster` | icon, UI skin, 음식·음료·소품 등 독립 PNG/WebP | `standalone-raster-report.json` |
| `bundle-model` | GLB, atlas, texture, JSON companion 등 원자적 다중 파일 묶음 | `bundle-model-report.json` |

제작과 개별 검수는 항상 `semanticOwner` 하나, 후보 자산 하나만 다룬다. 통합 검수에서는
이미 개별 승인된 자산만 한 소비 화면에 조립할 수 있다.

## 생성 규약(단일 자산)

생성은 언제나 **자산 1개 = 프롬프트 1개**다. 한 프롬프트는 한 자산의 한 상태만
만든다. 화면 전체를 한 장에 담아 나중에 조각내는 통짜 화면 마스터 방식은
폐기했다(deprecated). 이 방식이 아트가 계속 틀리게 나오고 하류 게이트에 반려만
쌓이게 만든 원인이었다.

- 한 프롬프트는 하나의 `semanticOwner`, 하나의 후보 자산만 대상으로 한다.
- 대상 하나만 그린다. 그 외 다른 요소·상태·UI·배경은 넣지 않는다.
- 검수는 checkerboard 위에 대상 한 자산만 격리해 확인한다.
- 화면을 통째로 생성해 사후 분리하지 않는다.

`concept-masters/`의 화면별 통짜 프롬프트는 톤·구도 참고용으로만 남긴다. 실제
생성에는 쓰지 않는다.

## 세 게이트

1. **단일 자산 생성과 격리 검수 사용자 승인** — 프로필·`semanticOwner`·자산 의미·
   원본 증거를 확인하고, 후보 자산 하나를 생성해 checkerboard 격리 검수로 사용자
   승인을 받는다. source/output SHA-256을 기록한다.
2. **소비 화면 맥락 최종 승인** — 이미 개별 승인된 자산만 한 소비 화면에 FHD/720p로
   재조립하고, anchor·occlusion·style 회귀와 runtime 최적화(loss 정책·시각 회귀·성능
   예산)를 확인한 뒤 소비 화면 단위 최종 사용자 승인을 받는다.
3. **runtime 등록** — finalizer가 `runtimeRegistrationAllowed=true`인 handoff를
   파생하고 app이 원자적으로 승격한다. 별도 dry-run 영수증이나 시간창은 없다.

개별 provenance와 프로필 보고서의 `runtimeRegistrationAllowed`는 항상 `false`다.
사람이 이를 `true`로 편집하지 않는다. 최종 승인에서만 finalizer가 파생한다.

## 해시와 버전

- `id`: revision을 붙이지 않는 안정된 의미 ID
- `sourceRevision`: 사용자가 승인하는 시각·의미 revision
- `runtimeBuild`: 같은 source revision의 압축·packing·기술 build
- `sha256`: 파일의 정확한 무결성 지문

spec 또는 승인 이미지의 해시가 바뀌면 즉시 차단하고 영향 분석을 기록한다. 의미·공간·
시각·runtime 동작이 바뀌면 사용자 재승인이 필요하다. 경로·문서 버전·저장소 경계처럼
비의미 변경만 있고 해시와 영향 분석이 남으면 재승인 없이 이관할 수 있다.

UI icon, alpha 자산, atlas는 무손실만 허용한다. 손실 압축은 불투명 배경에 한해 자동
회귀와 사용자 시각 승인을 모두 통과해야 한다.

## 스키마와 검증

v8 필수 스키마는 provenance, 세 프로필 보고서(completion·standalone-raster·
bundle-model), 최적화, 최종 승인, manifest entry template, runtime handoff다.
`REQUIRED` 같은 placeholder는 통과하지 못한다. topology, spatial inference,
visible-cutout, recomposition 스키마 파일은 삭제하지 않고 보존하되 v8 필수
목록에서는 제외한다(`deprecatedSchemas` 참고).

```bash
node art-workspace/pipeline/validate-pipeline.mjs
```

validator는 schema, 실제 경로, SHA-256, byte, PNG 치수·alpha 네 모서리·green spill,
격리 checkerboard 검수, standalone/bundle 보고서, spec 해시와 승인
provenance↔profile report 대응을 검사한다.

## 격리 검수판

standalone raster와 alpha complete layer는 checkerboard 위에 대상 한 자산만 표시한다.
다른 음식·손님·배경·상태 UI를 문맥용으로 섞지 않는다. 기존 승인 래스터의 격리 증거는
다음 결정론적 도구로 재현할 수 있다.

```bash
/path/to/python pipeline/render-isolated-raster-review.py \
  --input review/.../assets/asset.png \
  --output review/.../review-isolated-fhd.png \
  --scale 4
```

이 도구는 새 아트를 만들지 않고 입력 픽셀을 nearest-neighbor로 확대해 1920×1080
checkerboard 중앙에 놓는다.

## 최종 handoff 생성

소비 화면 재조립·최적화·최종 승인이 끝난 뒤에만 실행한다.

```bash
node art-workspace/pipeline/finalize-runtime-handoff.mjs \
  --provenance review/.../metadata/provenance.json \
  --profile-approval review/.../metadata/standalone-raster-report.json \
  --optimization review/.../metadata/optimization-report.json \
  --final-approval review/.../metadata/final-approval.json \
  --entry-template review/.../metadata/runtime-entry-template.json \
  --entry-output review/.../metadata/runtime-manifest-entry.json \
  --handoff-output review/.../metadata/runtime-handoff.json
```

`complete-layer`와 `bundle-model`은 `--profile-approval`에 각각 completion report와
bundle report를 전달한다. finalizer는 모든 파일과 해시를 다시 읽고 두 출력 파일을
원자적으로 생성한다. 기존 출력을 덮어쓰지 않는다.

app 승격은 단일 파일도 같은 bundle transaction을 쓴다. 반영 중 하나라도 실패하면
파일 묶음과 manifest를 전부 복구한다. 별도 dry-run 영수증이나 시간창은 없다.

## 보존과 비공개 Git LFS

`art-workspace`는 향후 별도 비공개 Git LFS 저장소로 만든다. 원격 생성·업로드는 별도
사용자 확인 전 수행하지 않는다.

- 원격 추적: 승인 자산, 필요한 생성 source, provenance, 검수 증거
- 로컬만 보존: `pending-user-review`
- 반려: binary를 삭제하고 `REJECTIONS.md`에 SHA-256과 사유만 보존
- 나중에 deprecated된 승인본: history에서 지우거나 rewrite하지 않음
- `app`: manifest에 등록된 활성 runtime build와 구현 검증용 고정 reference image만 보존

`.gitattributes`는 binary를 LFS 대상으로 준비하지만, 승인 상태가 추적 허용 여부를
결정한다.

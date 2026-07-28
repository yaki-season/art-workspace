# YAKI SEASON 아트 작업공간

YAKI SEASON의 콘셉트 마스터, 생성·분리 원본, 검수판, 승인 증빙, provenance와 런타임 인계 기록을 보관하는 비공개 Git LFS 저장소다.

`app` 저장소에는 실행 코드, 테스트와 승인된 최종 런타임 에셋만 둔다. `docs` 저장소에는 요구사항과 작업 계획을 둔다. 이 저장소의 검수용 원본·중간 산출물은 `app`에 직접 복사하거나 런타임에서 참조하지 않는다.

## 현재 기준

- 요구사항: `ART-002 v3.6.1`, `ART-003 v5.0.0`, `UI-002 v5.24.1`, `UI-003 v1.0.0`
- 시각 기준: `YS-HANDCRAFTED-NIGHT-v1`
- D1 첫 손님: `REGULAR_TSUKIOKA`의 네기마 3개와 생맥주 1잔
- 승인·등록 상태: D1 손님 화면의 complete layer, 상태별 손님 레이어, 테이블, 주문 UI를 검수·최종 승인했고 8개 런타임 항목을 `app/public/assets/manifest.json`에 등록했다.

## 디렉터리

| 위치 | 내용 |
| --- | --- |
| `concept-masters/` | 열 개 화면의 확정 전체 화면 콘셉트 마스터와 제작 기준 |
| `review/` | Artist별 생성 원본, 격리 검수, 재조립 결과, 승인·반려 이력 |
| `pipeline/` | 프로필 검증, provenance, runtime handoff 생성과 스키마 |
| `evidence/` | SCN-001 수직 슬라이스 검증 캡처 |
| `archive/` | 현재 런타임이나 제작 기준으로 사용하지 않는 과거 참고 파일 |
| `ASSET-CATALOG.md` | 자산 단위의 상태·근거·인계 카탈로그 |

## 승인과 런타임 인계

사용자 승인은 곧바로 runtime 등록을 뜻하지 않는다. `runtimeRegistrationAllowed`는 provenance에서 직접 변경하지 않으며, 다음 게이트를 순서대로 통과한 finalizer만 handoff를 만든다.

1. 화면·시나리오·승인 마스터를 해석하고 `spatial-inference.json`을 승인한다.
2. visible cutout과 가려진 면을 포함한 complete layer를 각각 검수·승인한다.
3. FHD와 720p 소비 화면 재조립, 최적화, 최종 승인을 검증한다.
4. `pipeline/finalize-runtime-handoff.mjs`로 manifest 항목과 handoff를 생성한다.
5. `app`에서 dry-run 영수증을 만든 뒤 해당 영수증으로만 원자적 승격을 수행한다.

```bash
# 작업공간 루트에서 실행
node art-workspace/pipeline/validate-pipeline.mjs

# app 저장소에서 실행
npm run assets:promote -- --handoff ../art-workspace/review/.../metadata/runtime-handoff.json
# dry-run이 출력한 30분 유효 영수증을 같은 handoff의 --write --receipt에 전달
```

## Git LFS

래스터 원본과 검수 이미지는 Git LFS로 추적한다. 최초 클론 후 LFS 객체를 받으려면 다음을 실행한다.

```bash
git lfs install
git lfs pull
```

`review/**/pending/`, `review/**/rejected/`, 임시 렌더링 파일과 OS 메타데이터는 커밋하지 않는다. 반려 이유와 승인 근거는 메타데이터·보고서로 보존한다.

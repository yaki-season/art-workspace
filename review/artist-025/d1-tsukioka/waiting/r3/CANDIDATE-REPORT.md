# `D1-TSUKIOKA-WAITING` R3 furniture-free Gate-1 후보

- runId: `ART3-D1-TSUKIOKA-FURNITURE-FREE-20260802-R3`
- 상태: `approved-by-user`
- owner: `Artist 3`
- runtimeRegistrationAllowed: `false`

승인 R2에서 인물은 유지하고 의자 등받이·기둥·좌판·팔걸이·다리·footrest를 모두 제거한 단일 인물 후보다.
실제 문맥에서는 `BG-SEATING-6 R2`가 가구를 독점하고, 승인 카운터가 하체를 가린다.

## 결과

- R3 alpha: `1920×1080 RGBA`, bbox `x957 y215 w258 h690`
- R2의 chair-inclusive bbox `x944 y215 w283 h690`과 동일한 소스→FHD 변환을 적용해 머리 위·발끝·중심·비율 drift 없음
- 인물 대형 alpha 연결요소 `1`, 가구 픽셀 `0`, 네 모서리 alpha `0`, magenta spill `0`
- 얼굴·회색 머리·안경·표정·가디건·셔츠·손·바지·양말·신발·앉은 자세 육안 비교 pass
- 실제 FHD/720: seat-04 등받이 하나만 뒤에 존재, duplicate chair 없음, 카운터 occlusion·눈높이 유지
- 첫 precise edit가 검수 통과하여 correction 호출은 사용하지 않음

## 츠키오카 기준 인체 공간 계약

R3를 이후 모든 성인 손님 캐릭터의 `1920×1080` / `1280×720` 고정 정면 카메라, 화면 스케일, 눈높이,
앉은 체형 비례, seat anchor와 counter occlusion 기준으로 사용한다. 일반 성인은 츠키오카 apparent seated scale의
`0.90–1.10`, eye line FHD `±24px`, shoulder line `±32px` 안에서 자연스러운 나이·체형 차이를 허용한다.
이를 벗어난 체격·시점·crop은 별도 캐릭터 디자인 승인이 필요하다. 가구는 `BG-SEATING-6` 전용이며 모든 character
layer에서 chair/stool/seat/arm/post/leg/footrest 픽셀은 `0`이어야 한다.

세부 측정값은 `metadata/character-scale-contract.json`에 기록했다. 이 계약은 candidate-local이며 docs/spec을 수정하지 않는다.

## 검토 파일

- `review/review-d1-tsukioka-waiting-isolated-fhd-r3.png`
- `review/review-d1-tsukioka-waiting-isolated-720-r3.png`
- `review/context-d1-tsukioka-waiting-fhd-r3.png`
- `review/context-d1-tsukioka-waiting-720-r3.png`

## Gate-1 사용자 승인

- date: `2026-08-02`
- basis: `사용자 응답: 승인`
- approved primary SHA-256: `9a77f3308ade6c2d8d5ed6c13f26a72fddbe775b94afddab962b86561a0c2ff3`
- reviewed context SHA-256: FHD `3842ecf522ffefdc7308f13dcaa84a59a92a1cb71747174ae42ba244723cacd7`,
  720 `8078cdffdc7abd93d6578407449050e8e904ce4529985b15b83e77630afe60f3`

승인 범위는 `D1-TSUKIOKA-WAITING R3` furniture-free Gate-1 하나뿐이다. `BG-SEATING-6 R2`, 최종 소비 화면,
다른 츠키오카 상태, Gate-2/3, finalizer, promotion, runtime 등록 또는 app binding 승인을 의미하지 않는다.
`runtimeRegistrationAllowed=false`를 유지한다.

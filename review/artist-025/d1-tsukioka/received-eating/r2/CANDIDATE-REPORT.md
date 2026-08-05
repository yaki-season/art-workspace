# `D1-TSUKIOKA-RECEIVED-EATING` R2 furniture-free Gate-1 bundle

- 상태: `approved-by-user`
- owner: `Artist 3`
- frames: `2` alternating frames of one received/eating state
- runtimeRegistrationAllowed: `false`

R1의 의자 픽셀만 제거하고 프레임별 행동을 보존한 츠키오카 2프레임 후보이다.

- `eat-negima`: 네기마 꼬치 정확히 1개를 입 근처에서 먹는 동작, 맥주·다른 음식 없음
- `drink-draft-beer`: 거품 있는 호박색 생맥주 정확히 1잔을 입에서 마시는 동작, 네기마·다른 음식 없음
- 두 프레임 FHD bbox 높이 `690`, 상단 `y215`, 중심 `x1086`; 승인 waiting R3 person-space 계약과 일치
- 두 프레임 모두 큰 human+prop alpha component `1`, furniture `0`, corner alpha `0×4`, magenta spill `0`
- 실제 FHD/720 문맥: `BG-SEATING-6` 좌석 하나만 뒤에 존재, duplicate chair 없음, 행동 소품이 counter 위에서 판독됨
- 얼굴·회색 머리·안경·가디건·의상·자세·프레임별 손/팔/소품 producer review pass
- 프레임당 첫 precise edit가 통과하여 correction 호출 미사용

검토 파일은 각 프레임의 isolated FHD/720 및 context FHD/720이다. 두 프레임은 함께 승인하거나 반려하는 단일 Gate-1
bundle이다.

## Gate-1 사용자 승인

- date: `2026-08-03`
- basis: `사용자 응답: 승인`
- approved primary SHA-256: eat `5a1e526672aad1eba9e50842ee4bdf0310f8564a9b6aa7c605aecd8fcac0525c`,
  drink `973d568259f25c1711e4924d3b063b59ba82962c1dfcaddc418d3735aeef6ee3`
- reviewed FHD context SHA-256: eat `927c9db43351c9cae32335131483295f0bd6236c1472fa4c95b4f875dd17b266`,
  drink `a5eb92ef2c408f136d5c3428a899b889e5233affe224ec691d6fa78eb24039f2`

승인 범위는 두 프레임을 함께 묶은 `D1-TSUKIOKA-RECEIVED-EATING R2` furniture-free Gate-1 하나뿐이다.
`BG-SEATING-6 R2`, consumer final, Gate-2/3, finalizer, promotion, runtime 등록 또는 app binding 승인을 의미하지 않는다.
`runtimeRegistrationAllowed=false`를 유지한다.

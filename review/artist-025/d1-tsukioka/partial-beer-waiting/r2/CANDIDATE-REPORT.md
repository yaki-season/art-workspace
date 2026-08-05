# `D1-TSUKIOKA-PARTIAL-BEER-WAITING` R2 Gate-1 후보

- 상태: `approved-by-user`
- owner: `Artist 3`
- runtimeRegistrationAllowed: `false`

R1의 의자 픽셀만 제거한 furniture-free 츠키오카 partial-beer 후보이다. 정확히 한 잔의 거품 있는 호박색
생맥주를 한 손으로 가슴 높이에 세워 들고 있으며 입과 떨어져 있다. 반대쪽 손은 빈손이고 네기마·음식은 없다.

- FHD alpha bbox: `x952 y215 w260 h690`; 승인 waiting R3 높이·머리 위·발끝과 일치
- 큰 alpha component `1`, furniture `0`, corner alpha `0×4`, magenta spill `0`
- 실제 FHD/720: BG-SEATING-6 seat-04 하나만 뒤에 존재, duplicate chair 없음, 맥주가 counter 위에서 판독됨
- identity/pose/state producer review: pass; correction 호출 미사용

검토 대상은 isolated FHD/720과 `review/context-d1-tsukioka-partial-beer-waiting-{fhd,720}-r2.png`다.

## Gate-1 사용자 승인

- date: `2026-08-03`
- basis: `사용자 응답: 승인`
- approved primary SHA-256: `590aba25dcf8ad897ebe13e85eb9db470f87a195bb9bb793cfc78d82163d9206`
- reviewed context SHA-256: FHD `2377ba3e1cd11e21c33b9bbe7b7985dae1620d3ebe1ea31918460ab6cb0fb3bc`,
  720 `f1ccef0cff89d682741db9fed6f9e3c1445c2c8efc3d067e91063e975a9c7242`

승인 범위는 `D1-TSUKIOKA-PARTIAL-BEER-WAITING R2` furniture-free Gate-1 하나뿐이다. `BG-SEATING-6 R2`,
consumer final, received/eating 상태, Gate-2/3, finalizer, promotion, runtime 등록 또는 app binding 승인을 의미하지 않는다.
`runtimeRegistrationAllowed=false`를 유지한다.

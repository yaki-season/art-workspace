# `D1-TSUKIOKA-PARTIAL-BEER-WAITING` R2 Gate-1 후보

- 상태: `pending-user-review`
- owner: `Artist 3`
- runtimeRegistrationAllowed: `false`

R1의 의자 픽셀만 제거한 furniture-free 츠키오카 partial-beer 후보이다. 정확히 한 잔의 거품 있는 호박색
생맥주를 한 손으로 가슴 높이에 세워 들고 있으며 입과 떨어져 있다. 반대쪽 손은 빈손이고 네기마·음식은 없다.

- FHD alpha bbox: `x952 y215 w260 h690`; 승인 waiting R3 높이·머리 위·발끝과 일치
- 큰 alpha component `1`, furniture `0`, corner alpha `0×4`, magenta spill `0`
- 실제 FHD/720: BG-SEATING-6 seat-04 하나만 뒤에 존재, duplicate chair 없음, 맥주가 counter 위에서 판독됨
- identity/pose/state producer review: pass; correction 호출 미사용

검토 대상은 isolated FHD/720과 `review/context-d1-tsukioka-partial-beer-waiting-{fhd,720}-r2.png`다.
다음 Gate는 사용자 시각 승인이다. Gate-2, finalizer, promotion, app/docs 변경은 수행하지 않았다.

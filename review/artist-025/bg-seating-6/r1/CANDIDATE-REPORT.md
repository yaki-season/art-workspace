# `BG-SEATING-6` R1 Gate-1 후보 — PM NO-GO

- runId: `ART3-D1-BG-SEATING-6-20260802-R1`
- 상태: `needs-revision; rejected-by-pm-context-review`
- semanticOwner: `Artist 3 / service artist-025`
- consumer: `SCR-SVC-CUSTOMERS / customers.seat[n]`
- profile: `complete-layer` alpha-cutout
- runtimeRegistrationAllowed: `false`

## 후보

카운터 뒤 손님측에 놓일 정확히 6개의 빈 월넛 좌석 후보다. 정면 눈높이, 동일 크기, 동일 수평 접지선으로 구성했고
6개 연결요소가 서로 분리되어 있다. 좌석 중심 간격의 최대 편차는 평균 대비 `4.92%`다. 전경 카운터가 하단을
가리는 context preview에서 PM NO-GO가 확인됐으므로 R1은 사용자 Gate-1에 제출하지 않는다.

포함: 닳은 월넛/에스프레소 등받이·스툴 6개, 호박색 상부광, 인디고 그림자, 연필·불규칙 잉크·불투명
과슈·종이결·계단형 edge.

제외: 손님·신체, 카운터/상판, 플레이어측 스툴, 음식·식기·도구, 벽·대문·바닥, UI·아이콘·숫자·문자·워터마크.

## 산출물

| 파일 | 규격 | SHA-256 |
|---|---:|---|
| `source/bg-seating-6-r1-chroma.png` | 1672×941 RGB PNG | `a8bdd2d2c8530ca1c0c5e646a4d6aaa48bf24346dfd151e09eb440231988a94c` |
| `assets/bg-seating-6-r1.png` | 1672×941 RGBA PNG | `d8bb83a6fe43e44293f07e27bc6869c925852f8bf1a514dc74cda53c255e6ea1` |
| `review/review-bg-seating-6-isolated-fhd-r1.png` | 1920×1080 RGB PNG | `11a6ffbd2c3b1aa5cb6081a2ad4ed6c600459109417df12a20c2d36facd48d05` |
| `review/review-bg-seating-6-isolated-720-r1.png` | 1280×720 RGB PNG | `79f27c8cf00242cbc48cd1d8e8050e4c31dace4724392563663ba1c26bdcf04b` |
| `review/context-bg-seating-6-fhd-r1.png` | 1920×1080 RGB PNG | `8b08700edc842e38f16beae33402d42cf71a4ee304ad49671ff8debbc764888e` |

## Gate-1 검증

- 좌석 수: 예상 6 / alpha 연결요소 6 — pass
- RGBA / straight alpha — pass
- 네 모서리 alpha: `0,0,0,0` — pass
- 녹색 잔류 픽셀: `0` — pass
- alpha: 투명 `1,280,796`, 반투명 `18,101`, 불투명 `274,455`
- 비투명 bbox: `x52 y316 w1566 h397`
- 원본 및 720 체크보드 육안검수: 좌석 수·실루엣·재질·광원·금지 요소 — pass
- 소비 구도 증거: 승인 background + 츠키오카 scale context + 승인 counter 위 preview 생성. 첫/마지막 좌석 중심을
  FHD `230.4 / 1651.2`, 공유 접지를 `y≈594`에 맞춰 중앙 출입구 가림과 실제 counter alpha occlusion을 확인했다.
  `context-bg-seating-6-fhd-r1.png`는 **composition evidence only**이며 approval artifact가 아니다.
- `final-approval.json`, optimization, finalizer, runtime handoff, promotion, app binding — 생성하지 않음

## PM 판정

`context-bg-seating-6-fhd-r1.png` 검수 결과 NO-GO:

- 6개가 compact bar-seat backrest가 아니라 높은 등받이 식탁의자로 읽힌다.
- 중앙 출입구와 승인 배경을 과도하게 막는다.
- 승인 츠키오카 착석 문맥 대비 등받이가 너무 크다.

이는 **PM context review 반려**이며 사용자 반려나 사용자 승인으로 기록하지 않는다. R1은 revision evidence로만 보존한다.
R2는 별도 follow-up brief 전까지 생성하지 않는다.

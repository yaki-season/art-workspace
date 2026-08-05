# `BG-SEATING-6` R2 Gate-1 후보

- runId: `ART3-D1-BG-SEATING-6-20260802-R2`
- 상태: `approved-by-user`
- owner: `Artist 3 / service artist-025`
- consumer: `SCR-SVC-CUSTOMERS / customers.seat[n]`
- runtimeRegistrationAllowed: `false`

R1의 높은 식탁의자 형태를 제거하고, 카운터 위로 낮게 보이는 월넛 허리 등받이 6개만 남긴 후보이다.
각 요소는 독립된 alpha 연결요소이며, 전경 카운터 아래의 다리·footrest·full stool geometry는 포함하지 않는다.

## 검증 결과

- 정확히 6개: alpha 연결요소 `6` — pass
- RGBA, 네 모서리 alpha `0`, green spill `0` — pass
- FHD 실제 문맥 좌석 중심: `210.1, 512.5, 809.2, 1108.7, 1404.8, 1710.1`
- 실제 문맥 visible bounds: `x90..1830 / y410..489`; 승인 카운터 상단 근처 `y500` 아래는 가림
- 중앙 출입구: 등받이 위·사이로 계속 읽힘 — pass
- 츠키오카 스케일: seat-04 등받이를 몸통이 대부분 덮음 — pass
- FHD/720: 낮은 등받이와 인물 우선 위계 유지 — pass
- 허용된 자가 교정: 사용하지 않음(첫 R2가 context pass)

## 산출물

| 파일 | 규격 | SHA-256 |
|---|---:|---|
| `source/bg-seating-6-r2-chroma.png` | 1672×941 RGB | `73e60ee65159fbe3bf34770bf612aaf97f0b2fa064a10081e69dac2dc3b6eb38` |
| `assets/bg-seating-6-r2.png` | 1672×941 RGBA | `10b1dd2692f61053ecce5a60645408ad0b15736b157ae6d31223efa21d80f908` |
| `review/review-bg-seating-6-isolated-fhd-r2.png` | 1920×1080 | `a948f4da7b40f1731fe4a50be69385647ee89f124ca4eb50c73a5f2fb8f25794` |
| `review/review-bg-seating-6-isolated-720-r2.png` | 1280×720 | `cb23efb80f10b26511b08028527c6803ed70d8d33dea127ab55714f9cc9cc208` |
| `review/context-bg-seating-6-fhd-r2.png` | 1920×1080 | `ba07e52e22414bef4133f0cd2d51b9c2f9680f831fcf55bb8e15a5709a0fa55b` |
| `review/context-bg-seating-6-720-r2.png` | 1280×720 | `923303e030d91b2216a1ad32ffa8d9b3a8c2bbf9e75e5855fc8f12c85d768b0d` |

Context 이미지는 승인 배경·츠키오카·카운터를 읽기 전용으로 합성한 composition evidence이며 approval artifact가 아니다.
사용자 Gate-1 승인 전에는 Gate-2, finalizer, runtime handoff, promotion 또는 app binding을 수행하지 않는다.

## 승인된 츠키오카 전체 상태 검토 증거

`대기 / 맥주만 수령 / 네기마 식사 / 맥주 음주` 네 상태를 동일한 2×2 무크롭 문맥 시트로 확인했다.
네 상태 모두 duplicate chair 없음, 좌석 중심 6개·중앙 출입구·카운터 occlusion·인물 스케일 일관성을 producer pass했다.

| 파일 | 규격 | SHA-256 |
|---|---:|---|
| `review/review-bg-seating-6-all-tsukioka-states-fhd-r2.png` | 1920×1080 | `20ed7c9668af4bac32ef22837546eae3c7c68d8fe96e26d04760d423163be101` |
| `review/review-bg-seating-6-all-tsukioka-states-720-r2.png` | 1280×720 exact 2/3 | `da85199dba4079708f856bcb0067e7beab5bc7b031478fd795954262ed0a41a6` |
| `metadata/all-states-review-evidence.json` | evidence map | `331c6ea9e5b9be722f0188c667e8def53c45cef17da47d448ea41bee88146176` |

네 츠키오카 상태와 `BG-SEATING-6 R2`는 각각 Gate-1 승인 상태다. 이 시트는 consumer final 승인 산출물이 아니며
`runtimeRegistrationAllowed=false`를 유지한다.

## Gate-1 사용자 승인

- date: `2026-08-03`
- basis: `사용자 응답: r2 승인`
- approved primary SHA-256: `10b1dd2692f61053ecce5a60645408ad0b15736b157ae6d31223efa21d80f908`
- reviewed all-states sheet SHA-256: FHD `20ed7c9668af4bac32ef22837546eae3c7c68d8fe96e26d04760d423163be101`,
  720 `da85199dba4079708f856bcb0067e7beab5bc7b031478fd795954262ed0a41a6`

승인 범위는 `BG-SEATING-6 R2` Gate-1 하나뿐이다. consumer-screen final, Gate-2/3, finalizer, promotion,
runtime 등록 또는 app binding 승인을 의미하지 않는다. `runtimeRegistrationAllowed=false`를 유지한다.

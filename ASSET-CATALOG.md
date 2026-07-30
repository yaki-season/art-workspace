# YAKI SEASON 에셋 카탈로그

- 상태: `D1 승인 runtime 자산 8항목 등록 완료, Artist 1·2·3 병렬 제작 체제로 전환`
- 기준: `ART-002 v3.6.1`, `ART-003 v5.9.0`, `UI-002 v5.25.0`, `UI-003 v1.2.0`, `YS-HANDCRAFTED-NIGHT-v1`
- 최종 갱신: `2026-07-30`

현재 app runtime에는 D1 소비 화면 승인 자산 8항목이 등록돼 있다. 사용자 승인에 따라 각 asset의
무손실 passthrough build·finalizer·dry-run 영수증·명시적 write를 통과했으며, 전량 수령 bundle의
동반 2파일을 포함한 10개 파일이 `../app/public/assets/core/customer/`와 `core/ui/`에 들어갔다.
이전 Artist 002 `p0-runtime-r1` 반려 패키지와 연결된 registry 28행은 계속 삭제 상태다.

전체 화면 마스터 세트는 `art-workspace/concept-masters/2026-07-26/`에 유지하며 런타임 개별 에셋이
아니다. 승인된 고객 화면 source는
`art-workspace/review/artist-009/customer-screen/r3/customer-service-fhd-r3.png`이다. Artist 010의
visible cutout 다섯 장은 사용자 승인됐다. 배경 complete R1은 손님측 바 테이블 바로 뒤의
대문을 막힌 후면벽으로 치환해 반려·삭제했고, R2는 측면 벽을 여러 개방 bay로 만들어
반려·삭제했다. R3는 화면 중앙의 단일 대문과 그 개구부 너머 골목, 화면 끝까지 막힌 좌우
측면 벽으로 교정해 사용자가 승인했다. R1 complete alpha는 문제가 없었지만 검수판에 다른 좌석의 음식·상태 UI·
전환 UI를 표시해 반려·삭제했다. R2는 동일한 complete alpha 하나만 checkerboard 위에
표시한다. 사용자가 R2를 승인했다. 손님·좌석은 좌석별 묶음으로 나눴으며 seat-02도
별도 단일 승인 단위로만 제작한다. 기존 `customer-ui/r1` 네 cutout은 주변 장면 조각과
잘린 실루엣 때문에 사용자 승인 대상에서 제외했다. 현재 승인 대상은 그 교체 첫 단위인
`art-workspace/review/artist-010/customer-ui/r2/considering/r1/review-considering-fhd-r1.png`였고 사용자가
승인했다. 대기 타이머 R1은 대기 대상·감소 방식·정면성이 불명확해 반려·삭제했다. R2의
5칸 track·과도한 가로 비율은 교체 대상으로 전환했다. 현재 승인 대상은
`art-workspace/review/artist-010/customer-ui/r2/wait-timer/r3/review-order-wait-panel-r3.png`였고 사용자가 승인했다.
R3은 손님 어깨폭의 둥근 반투명 말풍선 외피이며, 상단 약 60%는 DOM 음식 아이콘·`xN` 또는
완료 원형 체크·`xN`, 하단 약 15%는 `--wait-progress`가 연속으로 줄이는 단일 게이지다.
말줄임표·완전한 말풍선·꼬리만 담은 `192×144` 투명 에셋이며, 크림 종이·호박색·짙은 목재
색 관계를 승인 화면에 맞췄다. 문자·수량·좌석 번호·실시간 게이지는 DOM 계층의 책임이다.
해시와 실패 원인은
`art-workspace/review/artist-010/complete-layers/background/REJECTIONS.md`에만 남긴다.
새 배경의 화면 의미·카메라·대문·골목 연속면은
`art-workspace/review/artist-010/preflight/background-spatial-inference.json`에 기록했으며 사용자가
확인해 `approvedForGeneration=true`로 전환했다. 새 배경 complete R3는 정확한
`1920×1080`·불투명 PNG, `approved-by-user`다. seat-01 complete R2는 FHD straight-alpha,
네 모서리 투명, 승인 visible 상체 변경 0픽셀, 격리 검수판 오염 0픽셀,
`approved-by-user`다. 두 report 모두
재조립·최적화 전이므로 runtime 등록 허용은 `false`다.
고민 UI R1은 승인됐지만 registry 추가·runtime 등록은 전체 UI·재조립 승인 전까지 금지한다.
첫 음식 아이콘은 사용자 지정 네기마 꼬치 R1이며, `192×192` 단일 transparent PNG에 닭고기·파·온전한 대나무 꼬치만 담았다. 두 번째 [생맥주 주문 아이콘 R1](review/artist-010/customer-ui/r2/order-icons/draft-beer/r1/review-draft-beer-fhd-r1.png)은 황금 맥주·크림 거품·손잡이가 달린 맥주잔 하나만 담은 `192×192` transparent PNG다. 두 아이콘 모두 사용자가 승인했으며, `xN`과 완료 원형 체크는 DOM 책임이다. 다음 단계는 새 음식 생성이 아니라 사용자 지정 예시 상태의 주문 패널 통합 검수 한 장이다. 승인 UI 4종은 stable ID·source revision·실제 SHA/byte·standalone profile report로 이관했고, seat-02와 runtime 등록은 계속 금지한다.

<!-- asset-registry:start -->
| ID | 기존 ID | 상태 | 우선순위·pack | 종류·규격 | runtime 또는 review | source | provenance | 대표 사용 화면·콘텐츠 | SHA-256 |
|---|---|---|---|---|---|---|---|---|---|
<!-- asset-registry:end -->

## Artist 3인 소유권 ledger

이 표는 stable asset ID의 중복 제작을 막는 작업 배정 원본이다. 세부 파일 상태·SHA는 위 registry와
각 review report가 원본이며, 다른 Artist의 행은 읽기 전용으로 취급한다.

| 담당 | 태스크·namespace | 독점 semantic 범위 | 현재 순서 | 읽기 전용 공유 입력 |
|---|---|---|---|---|
| Artist 1 | `epic/artist/000`, `review/artist-000/` | D1 조립·고정 6칸 그릴, 꼬치·재료·네기마 model/shader, 대기·완료 tray와 해당 finalizer | 승인 empty base → 음식 없는 완료 tray R2 원근 검수 → 음식 station 소비 검수 → finalizer | 기존 승인 D1 손님 runtime 8개 |
| Artist 2 | `epic/artist/023`, `review/artist-023/` | S0 외관·대문·열쇠, 아사노 아키 이야기 초상과 S0 finalizer | `S0-STATE-KEY` topology → `PR-SHOP-KEY` 놓임 → 대문 → 이야기 | S0 KEY/GATE binding과 Developer 2 작업 012의 초상 계약; 숯 점화는 대사 처리 |
| Artist 3 | `epic/artist/025`, `review/artist-025/` | D1 드링크·서빙·좌석 정리·이름 없는 엑스트라·정산과 해당 finalizer. `BG-WORKSPACE-DRINK R2`는 좌우 실내 연속면·외부 개구부 없음 | `BG-WORKSPACE-DRINK R2` finalizer handoff → Developer 2 promotion 결과 대기 → 작업대 → 레버 → 잔/액체/VFX → 서빙 → 정리 → 엑스트라 → 정산 | Artist 1 음식 stable ID, Artist 2 아키 초상 ID, 기존 runtime 8개, 개발자 2 작업 007 inventory |

- `sourceMasterId`, stable asset ID, semantic state, finalizer bundle마다 owner는 한 명뿐이다.
- 공유 asset은 source 파일을 복사·수정하지 않고 manifest ID 또는 승인 review 입력으로만 합성한다.
- Artist 1 후속 `artist-026`은 D2 모모·D3 타레 음식 model/shader, Artist 3 후속
  `artist-024`는 D2·D3 서비스·이야기·정산을 맡는다.
- 각 Artist는 자기 owner 행의 상태·SHA만 갱신한다. 공용 registry 충돌이 예상되면 handoff report를
  먼저 만들고 catalog steward가 순차 병합한다.
- Artist 1 정본 소유권은 `Artist 1 / D1-ASSEMBLY-GRILL-FOOD-SHADER`, 기계 판독 owner ID는
  `artist-1.d1-assembly-grill-food-shader`다.
- `ST-GRILL-FINISHED-TRAY` R1과 `CMP-GRILL-FINISHED-PROPER-NEGIMA` R1은
  `2026-07-30` 사용자 승인 완료다. 두 항목은 소비 화면 재조립·finalizer 전까지
  `runtimeRegistrationAllowed: false`이며 runtime registry·manifest에는 아직 등록하지 않는다.
- `CM-GRILL-STATION-EMPTY-BASE R1`은 `2026-07-30` 사용자 승인 완료다. 기존 tray+food 소비 화면
  R2는 정면 원근·톤 때문에 superseded됐고, `ART-003 v5.9.0`에 따라 다음 단일 후보는 음식 없는
  `ST-GRILL-FINISHED-TRAY R2`다. tray 승인 전 음식 model/shader 보정·재합성·finalizer를 금지한다.

## 등록 규칙

- 사용자 승인 전에는 `approved`를 부여하지 않는다.
- 개별 provenance와 프로필 report는 `runtimeRegistrationAllowed: false`를 유지한다.
  소비 화면 재조립·최적화·최종 승인을 확인한 finalizer의 handoff만 app dry-run
  영수증과 원자적 승격 절차로 `../app/public/assets/`에 들어갈 수 있다.
- 실패·반려·교체된 산출물은 registry와 runtime 경로에 남기지 않는다.
- 단일 alpha 자산의 승인 검수판은 해당 자산만 checkerboard 위에 표시한다.
- 전체 화면 마스터는 스타일·구도 검수 기준이며 개별 runtime asset으로 간주하지 않는다.

## Artist 000 — D1 전체 화면 후보

첫 0차 후보는 [D1 주문 접수/모두 대기 R1](review/artist-000/d1-customer-order/all-waiting/r1/review-d1-customer-order-all-waiting-fhd-r1.png)이다.
단일 츠키오카·단일 연속 바 카운터·중앙 대문/밤 골목을 새 전체 장면으로 만들고, 승인된 주문
패널 R3·네기마·생맥주 아이콘은 HTML/CSS로 조립했다. 장면 source SHA-256은
`7dde79c41cecfa23547fc126179187d7ba9f51df6bc676d4d7e87985e846f119`, 검토판 SHA-256은
`55c0ee703f2781704459fb0fe5771e6bca4e8e073adf3cead40b5c6671aff510`이다. 상태는
`approved-by-user`이며, 개별 runtime asset 승인·다음 상태·runtime 등록은 아직 아니다. 다음
단계는 이 승인 화면에서 필요한 단일 자산을 분리해 격리 검수하는 것이다.

새 전체 화면 생성 전에는 기존 승인 전체 화면이 같은 screen ID·카메라·상태·필수 구성요소를
충족하는지 먼저 대조한다. 충족하면 재생성하지 않고 그 화면을 source로 분리·조립한다.

## Artist 000 — 기준 화면 변경

사용자가 [Artist 009 손님 화면 R3](review/artist-009/customer-screen/r3/customer-service-fhd-r3.png)를
향후 분리 작업의 기준 전체 화면으로 지정했다. D1 기준으로 만든 바 카운터 R1은 반려되어
후보 파일을 삭제했고, 해시와 사유만
`review/artist-000/d1-customer-order/complete-layers/bar-counter/REJECTIONS.md`에 남긴다.
다음 단일 단위는 이 기준 화면의 실제 긴 테이블 complete layer이며, 새 전체 화면은 생성하지
않는다.

## Artist 000 — 서비스 테이블 complete layer R1

[단독 검수판](review/artist-000/d1-customer-order/complete-layers/table/r1/review-service-table-isolated-fhd-r1.png)은
`1920×1080` checkerboard 위에 이 complete layer 하나만 표시한다. 사용자 지정 Artist 009
승인 전체 화면의 실제 긴 테이블을 source로 사용했으며, 인물과 동적 주문 물체에 가려진 목재만
같은 원근으로 복원했다. 테이블 상판·모서리·전면 패널만 포함하고 손님·음식·음료·식기·매트·
배경·UI는 포함하지 않는다. 출력 SHA-256은
`64ed1bb62a5d25100d2a64c040872f172476ea34833170f811c9bfe3aad2ed7c`, 검수판 SHA-256은
`c947caf1a1048cc70728130f55d688564cd82f2abb9e4fc8c1d5a03672c53361`이다. 네 모서리 alpha는
모두 `0`, 녹색 잔류는 `0`픽셀이다. 사용자가 테이블 단독 complete layer를 사용한다고
승인했으며 상태는 `approved-by-user`다. 재조립·runtime 등록은 계속 금지한다.

테이블 아래 `y=920..1080`은 래스터 빈 공간이 아니라 공통 스테이션 전환 전경이다. `UI-002`와
Artist 009 R3의 기존 승인 DOM/CSS에 따라 현재 `손님`과 인접 `조립·그릴·드링크`를 표시하며,
각 조작 화면은 별도 `SCR-SVC-*` 화면으로 전환한다. 이를 테이블 후보 위에 겹친
[결합 검토판](review/artist-000/d1-customer-order/complete-layers/table/r1/review-table-with-station-nav-fhd-r1.png)의
SHA-256은 `a335267827a7bbdf98938988ddc74bc686303ce18ec7736509bb3eddffb0989b`이다. 이 UI는
텍스트·상태·접근성·입력을 DOM/CSS로 유지하며 테이블 래스터에 굽지 않는다.

D1 `REGULAR_TSUKIOKA` 손님+좌석의 왼쪽 회사원 seat-01 R2 재사용 시도는 잘못된 인물 식별로
폐기했다. 원래 승인 자산은 보존하고, 해시와 사유만
`review/artist-000/d1-customer-order/reuse/customer-seat-01/REJECTIONS.md`에 남긴다. D1 츠키오카는
Artist 009 R3의 녹색 가디건·회색 머리·안경을 쓴 노인 손님으로 별도 complete layer를 만든다.

## Artist 000 — D1 츠키오카 대기 complete layer R2

[단독 검수판](review/artist-000/d1-customer-order/complete-layers/d1-tsukioka/waiting/r2/review-d1-tsukioka-waiting-isolated-fhd-r2.png)은
`1920×1080` checkerboard 위에 음식·음료를 수령하지 않은 녹색 가디건 츠키오카와 단일 목재
의자만 표시한다. 출력 SHA-256은
`0d825865988fab624c9153f4a1f453b12cea218809832bf3b0c10aec88669bc1`, 검수판 SHA-256은
`ce7f2fcb1fd4a61a44d87afa6b37fa190a2944acd2aaf6bc4605c13a0ccb853a`다. 의자는 정면 카메라를
똑바로 향하며, 네 모서리 alpha와
녹색·마젠타 잔류는 모두 `0`이다. 사용자가 승인했으며 runtime 등록은 계속 금지한다. 다음 단일
자산은 전량 수령 뒤 수령(식사) 상태다. R1은 옆을 향한 의자로 `superseded` 처리했다.

## Artist 000 — D1 츠키오카 수령(식사·음주) bundle R1

[격리 APNG 검수판](review/artist-000/d1-customer-order/complete-layers/d1-tsukioka/received-eating/r1/review-d1-tsukioka-received-eating-isolated-fhd-r1.png)은
`1920×1080` checkerboard 위에서 동일 츠키오카·정면 의자를 유지한 두 프레임을 1200ms마다 번갈아
표시한다. 첫 프레임은 네기마를 먹고, 두 번째 프레임은 생맥주를 마신다. bundle manifest SHA-256은
`218cf1a01a1d15795b48319f508596092e83e0b58f1660517482aac433418fa5`, APNG 검수판 SHA-256은
`b7cdd1e088a46a45e6866a7a9f7208cc024d59c8b2110e9c0aeb1bf3bb1a7f41`이다. 상태는
사용자가 승인했으며 재조립·runtime 애니메이션 연결·등록은 계속 금지한다. D1 기획상 생맥주만
부분 제공되고 네기마 3개는 미완료인 상태는 이 bundle과 별도 후보로 남는다.

## Artist 000 — D1 츠키오카 생맥주 부분 수령 대기 R1

[단독 검수판](review/artist-000/d1-customer-order/complete-layers/d1-tsukioka/partial-beer-waiting/r1/review-d1-tsukioka-partial-beer-waiting-isolated-fhd-r1.png)은
`1920×1080` checkerboard 위에 생맥주 한 잔을 가슴 높이에서 들고 있는 츠키오카와 정면 의자만
표시한다. 네기마·음식은 없으므로 네기마 3개가 아직 미완료인 부분 수령 대기 상태를 나타낸다.
출력 SHA-256은 `5fa4f5e257d54838aa22fe1403426808b71cd7bd9526730e666ea811ad5b1501`, 검수판
SHA-256은 `e8c9f77391597a0ddac448dbb3cb1fe45aff87014c19c343682df7a55f8e99c7`이다. 상태는
사용자가 승인했으며 runtime 등록은 계속 금지한다. D1의 대기·부분 수령·전량 수령 식사·음주
인물 상태가 모두 승인됐으므로 다음 단계는 승인 자산만 쓰는 소비 화면 재조립이다.

## Artist 000 — D1 소비 화면 모두 대기 재조립 R1

[FHD 검수판](review/artist-000/d1-customer-order/recomposition/all-waiting/r1/review-d1-all-waiting-fhd-r1.png)과
[720p 검수판](review/artist-000/d1-customer-order/recomposition/all-waiting/r1/review-d1-all-waiting-hd-r1.png)은
`D1-ORDER-001`의 네기마 `x3`·생맥주 `x1` 모두 대기 상태다. 배경·테이블·대기 츠키오카·주문
말풍선 외피·두 주문 아이콘의 승인 자산 6종만 사용하고, 수량·연속 게이지·하단 스테이션 전환은
DOM/CSS로 조립했다. FHD SHA-256은 `29e460c078a276ec3408009825f93b159deb44d5101bf776b4048f94570e432b`,
720p SHA-256은 `b8a6d534440eeb25197e380278e0862d220f2461da48c3c5b8dc5f2a6b41f9c5`다. 사용자가 승인했으며,
formal 기록은 `metadata/recomposition-report.json`에 있다. 당시 이 화면 단독 승인만으로는 runtime
등록이 허용되지 않았으며, 다음 검토 상태는 생맥주 부분 제공·네기마 3개 대기였다.

## Artist 000 — D1 소비 화면 생맥주 부분 제공 재조립 R1

[FHD 검수판](review/artist-000/d1-customer-order/recomposition/partial-beer-waiting/r1/review-d1-partial-beer-waiting-fhd-r1.png)과
[720p 검수판](review/artist-000/d1-customer-order/recomposition/partial-beer-waiting/r1/review-d1-partial-beer-waiting-hd-r1.png)은
생맥주만 수령하고 네기마 `x3`가 남은 D1 정본 상태다. 완료 생맥주 `x1`은 DOM 원형 체크, 남은
네기마는 승인 아이콘, 대기 게이지는 승인된 `62%` 예시값으로 조립했다. FHD SHA-256은
`5800a514588a7c930998c5ca5c50079ebf9d456c682e9eb2b79799dd17f60d46`, 720p SHA-256은
`ddbd8c0e6f62db9feb629a547a7c40a752609c6a5d5cea855d101350a88825ab`다. 사용자가 승인했으며 formal
기록은 `metadata/recomposition-report.json`에 있다. 당시 다음 검토는 전량 수령 식사·음주 bundle의
소비 화면 재조립이었다.

## Artist 000 — D1 소비 화면 전량 수령 식사·음주 재조립 R2

[FHD 2프레임 APNG](review/artist-000/d1-customer-order/recomposition/received-eating/r2/review-d1-received-eating-fhd-r2.png)와
[720p 2프레임 APNG](review/artist-000/d1-customer-order/recomposition/received-eating/r2/review-d1-received-eating-hd-r2.png)은
전량 수령 후 네기마 식사와 생맥주 음주를 `1200ms`마다 번갈아 표시한다. 완료 패널은 주문 수량이
아닌 주문 종류에 맞춰 네기마·생맥주 각각 하나, 총 두 개의 DOM 원형 체크를 승인된 두 칸 간격으로
표시한다. 게이지는 빈 연속 바이며 고객 퇴장 때 패널도 함께 사라진다. FHD SHA-256은
`058d19b840d99f0f3c67d7831667963e0c6476d4019a1c2b30aaad485d1ed960`, 720p SHA-256은
`80d76a5722dbab184d769cda10bdc0d3c6a9adf275e3b1d5222985b27a32ce13`이다. 사용자가 승인했으며 formal
기록은 `metadata/recomposition-report.json`에 있다. 반려 R1은 상위 `REJECTIONS.md`에 해시·사유만
남긴 뒤 삭제했다. 이후 세 D1 소비 화면 상태의 최종 승인과 무손실 runtime handoff를 거쳐 8개
관련 자산을 app manifest에 등록했다.

사용자가 D1 소비 화면 세 상태를 화면 단위로 최종 승인했고, 무손실 runtime build와 finalizer,
dry-run 영수증·명시적 `--write`까지 완료했다. `npm run assets:validate`는 manifest 8항목을 통과했다.
이후 구현은 manifest URL만 사용한다.

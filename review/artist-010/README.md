# Artist 010 — P0 손님 화면 레이어 분리·재합성

- 상태: `배경 complete R3·seat-01 complete R2·고민 UI R1·주문 대기 패널 R3·네기마·생맥주 아이콘 R1 및 주문 패널 통합 세 상태 승인, 다음 단일 UI/seat 과업 사용자 선택 대기`
- 최신 승인 검수판:
  [review-order-wait-panel-r3.png](customer-ui/r2/wait-timer/r3/review-order-wait-panel-r3.png)
- 최신 승인 통합 검수판:
  [review-order-panel-draft-beer-complete-fhd-r3.png](customer-ui/r2/order-panel-integration/r3/review-order-panel-draft-beer-complete-fhd-r3.png)
- 실제 규격: `1920×1080 PNG`
- source: Artist 009 승인 r3
- 공식 계약: [세 프로필 아트 파이프라인](../../pipeline/README.md)
- 생성 전 공간 추론 초안:
  [background-spatial-inference.json](preflight/background-spatial-inference.json)

## R1 반려 원인

가게의 확정 공간 순서는
`바 안쪽 주인공 → 단일 바 테이블 → 손님 좌석 → 바로 뒤 대문 → 밤 골목`이다.
R1은 대문을 막힌 목재 후면벽으로 바꿨으므로 전면 반려했다. 이미지·프롬프트·검수판은
삭제했고 [REJECTIONS.md](complete-layers/background/REJECTIONS.md)에 해시·실패 원인만
남겼다.

R2는 후면을 여러 개방 bay로 만들어 측면에서도 골목이 보였으므로 반려했다. 사용자의
직접 교정에 따라 대문은 화면 중앙의 하나뿐인 개구부이고 좌우는 화면 끝까지 막힌
측면 벽이어야 한다. R2 파일은 삭제했고 같은 반려 기록에 해시·실패 원인만 남겼다.

## 재착수 조건

1. 설정·시나리오·화면 설계·승인 마스터를 다시 읽는다.
2. `spatial-inference.json`에 카메라·바·좌석·대문·골목의 앞뒤 순서를 기록한다.
3. 대문을 후면벽·선반·별실·두 번째 카운터로 치환하지 않는 금지 규칙을 기록한다.
4. validator가 공간 계약을 통과한 뒤에만 새 이미지 프롬프트를 작성한다.
5. 새 배경 한 장만 다시 사용자에게 승인 요청한다.

사용자가 변경 범위와 공간 추론을 확인해 `approvedForGeneration=true`로 전환했다.
내장 imagegen의 단일 정밀 편집으로 새 배경 complete R3 한 장만 제작하고 최근접 보간으로 정확한
`1920×1080`에 맞췄고 사용자가 승인했다. 현재
[completion report](complete-layers/background/r3/metadata/completion-report.json)는
`approved-by-user`, runtime 등록 허용은 재조립·최적화 전이므로 `false`다.

손님·좌석 complete는 한 번에 다섯 손님과 여섯 좌석을 생성하지 않고
`seat-01`부터 `seat-06`까지 좌석별 묶음으로 분할한다. 현재는
[seat-01 공간 추론](complete-layers/customer-seat-01/preflight/seat-01-spatial-inference.json)을
통과한 뒤 첫 번째 피곤한 중년 남성 손님과 목재 좌석 한 묶음만 만들었다. 승인 visible
상체 49,542픽셀은 변경 0픽셀로 보존하고, 생성 픽셀은 카운터가 가릴 하체·좌석 영역에만
사용했다. R1의 complete alpha 자체는 문제가 없었지만 검수판에 다른 좌석 음식·상태 UI·
전환 UI를 합성한 잘못으로 사용자 반려됐다. R1은
[반려 기록](complete-layers/customer-seat-01/REJECTIONS.md)만 남기고 삭제했다.
[seat-01 R2 completion report](complete-layers/customer-seat-01/r2/metadata/completion-report.json)는
같은 complete alpha를 고정 checkerboard 위에 단독 표시하고, source 범위 밖 오염
0픽셀을 자동 검증한 `approved-by-user`다.

## 이미 승인된 visible cutout

접시 아래 상시 아이콘을 제거한 화면의 보이는 픽셀을 아래 다섯 alpha PNG에 한 번씩
배분했고 사용자가 승인했다.

1. [배경](customer-layers/r2/layers/00-background.png)
2. [손님·좌석](customer-layers/r2/layers/10-customers-seats.png)
3. [단일 카운터](customer-layers/r2/layers/20-single-counter.png)
4. [테이블 음식·음료](customer-layers/r2/layers/30-table-food-drink.png)
5. [전경·UI](customer-layers/r2/layers/40-foreground-ui.png)

cutout 단계는 이미지 생성 모델 없이 분리했다. complete 단계에서는 승인 cutout을
실루엣·화풍·원근 reference로 사용하고, 가려진 면과 교차 범주 흔적이 없는 자산을 별도
제작·승인한다.

기존 [customer UI visible R1](customer-ui/r1/)은 승인 화면을 잘라낸 결과라 주변 장면 조각과
실루엣 잘림이 있어 승인 대상으로 사용하지 않는다. 사용자 지시에 따라 이를 완결형 단일
에셋 순서로 교체한다. 첫 후보는 `...` 고민 상태 한 장만 다시 제작한
[considering R1](customer-ui/r2/considering/r1/)이다. 192×144 투명 PNG에는 말풍선·세 점·
꼬리만 있으며, 기존 화면의 크림 종이·호박색·짙은 목재 관계를 기준으로 보정했다.
문자·수량·좌석 번호·실시간 게이지는 이미지에 굽지 않고 DOM 또는 동등한 UI 계층에서
표시한다. 사용자가 고민 UI를 승인했고, 대기 타이머 R1은 대기 대상·감소 방식·정면성이
불명확해 반려·삭제했다. 이어 R2의 5칸 track과 과도한 가로 비율은 사용자 피드백으로 교체
대상이 됐다. 현재 R3은 손님 어깨폭의 둥근 반투명 인디고 말풍선 외피 하나와 CSS 조립 검수판이다.
상단 약 60%에는 미수령 음식 아이콘+DOM `xN`, 완료 시 원형 체크+DOM `xN`을 배치하고,
하단 약 15%의 단일 가로 게이지는 CSS `--wait-progress` 값으로 연속 감소한다. 다음 주문 아이콘
자체·시간/기분과 seat-02는 각각 별도 단일 승인 단위이며 runtime 등록은 계속 금지한다. 다음
네기마 주문 아이콘 R1은 음식 한 꼬치만 담은 `192×192` transparent PNG이며, 수량은 DOM `xN`,
완료 시에는 아이콘만 원형 체크 DOM으로 교체한다. 사용자가 승인했으며 전체 UI·재조립 승인 전에는 runtime 등록하지 않는다. 다음 단일 검토 대상은
[생맥주 주문 아이콘 R1](customer-ui/r2/order-icons/draft-beer/r1/review-draft-beer-fhd-r1.png)이다.
황금 맥주·크림 거품·손잡이가 달린 잔 하나만 담은 `192×192` transparent PNG이며, 사용자가
승인했다. 수량과 완료 체크는 같은 DOM 계약을 따른다. 이 네 standalone raster 승인본은
stable ID·source revision·실제 source/output SHA·byte와
`standalone-raster-report.json`으로 이관했고 v7 validator를 통과했다. R3 외피는 픽셀을
바꾸지 않고 해당 외피 하나만 보이는
[격리 검수판](customer-ui/r2/wait-timer/r3/review-order-wait-panel-isolated-fhd-r3.png)을
추가했다. 다음 단계는 새 음식 생성이 아니라 승인 패널·네기마·생맥주·DOM 수량/체크를
사용자가 지정한 예시 상태 한 장으로 통합 검수하는 것이다. 첫 통합 후보는 네기마·생맥주
모두 대기 중인 상태이며, 두 승인 PNG만 `object-fit: contain`·`image-rendering: pixelated`로
표시한다. 수량 `x1`과 연속 게이지는 DOM/CSS다. 사용자가 R1·R2·R3 세 상태를 모두 승인했다.
이것은 주문 패널 통합 승인이다. 시간/기분 UI·추가 주문 표시·재조리 요청 표시·주문서 상호작용 UI와
seat-02 이후 구성요소가 남아 있으므로, 전체 손님 화면 FHD/720p 재조립·소비 화면 최종 승인과
runtime 등록은 아직 진행하지 않는다. 다음 단일 과업은 사용자가 선택한다.

seat-02는 이 UI 묶음 승인 뒤 별도 공간 추론·단일 생성·단일 승인 단위로만 진행한다. complete 전체의
재조립 승인 전에는 runtime packing·asset registry 등록이나 Artist 011을 시작하지 않는다.

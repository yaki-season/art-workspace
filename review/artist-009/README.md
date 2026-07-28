# Artist 009 — P0 손님 서비스 기준 화면

- 상태: `사용자 승인 완료`
- 현재 검수본: [customer-service-fhd-r3.png](customer-screen/r3/customer-service-fhd-r3.png)
- 실제 규격: `1920×1080 PNG`
- 현재 승인 후보: `1장`
- 생성 모델 호출: `없음`

## 제작 방식

사용자 승인 concept master
`art-workspace/concept-masters/2026-07-26/03_customer-service-master.png`의 인물·음식·화풍은 재생성하지
않았다. r2에서 카운터 깊이와 하단 전환 구조를 고쳤고, r3에서는 그 배치를 유지하면서 하단 UI만
`YS-HANDCRAFTED-NIGHT-v1`의 따뜻한 픽셀 표면으로 교체했다.

- concept master: `1672×941`, SHA-256
  `102857b5b06c454c3c2d7c39f7fd113eec25606c326962037564d66d7cda8e0f`
- FHD base: `customer-screen/r3/customer-service-master-fhd.png`, SHA-256
  `a1e36cdd7013e0b99a7a3a51eae696c5dd5b3059eb25c13db1bd3b24ceae3ad4`
- r3: `1920×1080`, SHA-256 `cd7dff413b532dbbd4e96d28b2ec4c6746c995057f1830fe825787bb1c04263f`
- r3 합성 source: `customer-screen/r3/composite.html`
- resize X: `1.1483253589`
- resize Y: `1.1477151966`
- 축 비율 차이: `0.0532%`

교체된 r1·r2는 사용자 지시에 따라 삭제했다. 현재 검수 대상은 r3 한 장뿐이다.

## 시각 검수

- 단일 카운터 상판과 전면부만 존재한다.
- r1 대비 카운터 전면의 세로 깊이를 약 절반으로 줄였다.
- 다섯 손님은 카운터 뒤에 있으며 하체가 자연스럽게 가려진다.
- 맥주·꼬치·접시·인물의 비율과 접촉면은 승인 원본과 동일하다.
- 좌석별 상태 아이콘을 자르지 않고 보존했다.
- 상단 상태, 중앙 서비스, 공용 완성품 dock·좌우 전환을 유지했다.
- 하단에 `손님`(현재)·`조립`·`그릴`·`드링크` 전환 버튼을 추가했다.
- 하단 UI는 황동·짙은 목재·이끼색·버건디와 크림색 글자를 사용한다.
- 둥근 회색 벡터 패널 대신 각진 4~8px 테두리·디더 패턴·단단한 그림자를 사용한다.
- 화면 전체에 주황 tint를 씌우지 않아 얼굴·음식과 남색 밤의 중간 명도를 보존한다.
- 삭제된 `artist-002/p0-runtime-r1`은 입력·prompt·후처리 어느 단계에서도 사용하지 않았다.

사용자 승인 뒤 Artist 010의 비생성 레이어 분리 source로 인계했다.

# Artist 010 complete background 반려 기록

## R1 — 2026-07-26

- 상태: `반려·이미지 삭제`
- complete SHA-256:
  `43df6191a0b56e975f0165f3eb7fb5c6cf05e536a3e7fa89392f33daf9763667`
- review board SHA-256:
  `54a56de0a680c15e6a5b2f8d2ab8da6664c744d5976e6d6becf8df4e9c3dba5d`
- model source SHA-256:
  `c22f345419029a63a403c72225e583eceb83564ec008aee094b3014fce2df73f`

### 실패

가게는 `바 안쪽 주인공 → 단일 바 테이블 → 손님 좌석 → 바로 뒤 대문 → 골목` 구조인데,
R1은 손님 뒤 대문을 막힌 목재 후면벽과 선반으로 바꿨다. 이는 화풍 문제가 아니라 공간
설정을 읽고 추론하지 않은 구조 오류다.

### 직접 원인

- `background`라는 분리 이름을 이 화면의 실제 의미인 `손님 뒤 대문·밤 골목`으로
  해석하지 않고 일반적인 이자카야 후면 장식으로 처리했다.
- 최신 spec의 잘못된 `뒷벽·선반` 문장과 승인 마스터의 열린 대문 단서가 충돌했는데도
  이를 발견·중단하지 않았다.
- 설정·시나리오·상세 화면·승인 마스터를 함께 읽은 공간 추론 없이 프롬프트부터 작성했다.
- 검증이 PNG 규격·알파·해시·오염 여부만 확인하고 게임 설정·동선·화면 의미를 검사하지
  않아 구조적으로 틀린 결과를 기술적으로 통과시켰다.

### 재발 방지

- 생성 전 화면 ID·게임 상태·플레이어 행동·`semanticOwner`·자산 의미를 먼저 확정한다.
- 이미지 생성 전에 `spatial-inference.json`을 작성하고 topology validator를 통과한다.
- 대문·문턱·골목의 가려진 연속면을 먼저 확정한 뒤 prompt를 작성한다.
- 일반적인 이자카야 후면벽을 설정상의 대문 대신 사용하지 않는다.
- 새 배경 후보는 사용자에게 다시 승인받기 전까지 runtime·source 정본으로 취급하지 않는다.

## R2 — 2026-07-26

- 상태: `반려·삭제 대상`
- complete SHA-256:
  `4bada62b06522d5d2f8518d461c9ab4799210d060ab0cc4c9d3573d65e362978`
- model source SHA-256:
  `83b90d7862eca44497fa5e2c3012d649aa5c8f61bc90028542442219f72343dc`
- prompt SHA-256:
  `3a95254196ced7b8d1c76891e40b31231634a9e8aa9913a443687985cfc04198`
- completion report SHA-256:
  `ae38b647a1380e58d25b0e1ffea8b817040c5fc4ed6bf2d75fc6800867f7b464`

### 실패

R2는 후면 대부분을 여러 개방 bay처럼 열어 외부 골목을 좌우 측면에서도 보이게 했다.
사용자 교정에 따르면 문은 화면 가운데의 단일 대문이어야 하고, 대문 양옆은 화면 끝까지
막힌 벽이어야 한다.

### 재발 방지

- `entranceComposition=single-centered-main-gate-with-closed-side-walls`를 화면별
  topology 규칙과 공간 추론에 함께 기록한다.
- `sideWallsRelation=closed-from-centered-gate-to-left-and-right-frame-edges`를
  validator가 검사한다.
- 중앙 대문 외의 측면 개구부·외부 노출 bay를 금지한다.

# Customer seat-01 complete rejection log

## R1 — rejected 2026-07-26

- 사용자 반려 사유: 승인 검수판에 `seat-01` 자산 범위가 아닌 다른 좌석의 음식·음료,
  머리 위 상태 아이콘, 상단 제어 UI, 하단 주문·전환 UI가 그대로 표시되었다.
- 원인: complete alpha 자체는 한 손님과 의자 하나로 분리했지만, 검수판을 전체 게임 화면
  문맥으로 합성하면서 아직 승인 대상이 아닌 food/UI 레이어를 포함했다.
- 유지 판정: 얼굴·의상·자세·위치, 하체·의자 연결, 카운터 가림은 사용자 확인상 문제없다.
- 재발 방지: alpha-cutout 검수판은 고정 checkerboard와 해당 complete PNG만 사용하고
  validator가 source 밖 픽셀 오염 0을 전 픽셀 검사한다.
- 삭제된 complete SHA-256:
  `bfe372708fecaa4a97e66afa6ff9d1216c1ddf341bed8ceecd9bf36486193d22`
- 삭제된 오염 검수판 SHA-256:
  `bfd0a6c757a05e0f8268ca49212a0130e579a201515bf572263e4f0baa9c26a4`
- R1 이미지·프롬프트·보고서·model source는 R2 검수 패키지를 만든 뒤 삭제한다.

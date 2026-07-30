# CM-GRILL-STATION-EMPTY-BASE R1

`CM-GRILL-STATION-QUEUED-SELECTION R3`에서 카메라와 정적인 공간 배치를 그대로 파생한 D1 빈 그릴 base 후보다. 이 후보는 완료 tray나 음식 모델을 합성하기 전의 parity gate이며, runtime 등록 후보가 아니다.

## 검수 파일

- `review-cm-grill-station-empty-base-parity-r1.png`: 왼쪽은 승인 master, 오른쪽은 이 후보를 각각 원본 FHD 크기로 붙인 비교판이다.
- `review-cm-grill-station-empty-base-fhd-r1.png`: 후보 단독 FHD 검수판이다.
- `metadata/parity-validation-report.json`: FHD 크기·side-by-side 원본 크기·완료 tray 예약 영역 검증 기록이다.

## 포함과 제외

포함: master의 프레임, 남색 작업면, 빈 대기 rack, 연속 석쇠, 광원과 색조.

제외: 모든 꼬치와 음식 상태, 집게, 연기·불꽃, 좌우 tray, 대기 선택 pad, 폐기 버튼, 텍스트와 DOM UI.

완료 tray의 다음 합성 예약 좌표는 FHD `x=1534, y=130, width=218, height=342`이다. 이 base에는 해당 tray를 그리지 않는다.

## 상태

`approved-by-user` (2026-07-30, 사용자 응답: 둘 다 승인). 이 승인은 runtime 등록 허가가 아니다.
다음 단일 gate는 음식 없는 `ST-GRILL-FINISHED-TRAY R2`를 같은 upper-right station 원근·톤으로
보정한 FHD/720 소비 화면 검수다. tray 승인 전에는 네기마를 다시 합성하지 않는다.

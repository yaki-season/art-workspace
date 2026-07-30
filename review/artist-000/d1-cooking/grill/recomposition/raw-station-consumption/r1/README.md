# MDL-NEGIMA-GRILL-RAW R1 station consumption

사용자 승인 `MDL-NEGIMA-GRILL-RAW R1`을 승인 `CM-GRILL-STATION-EMPTY-BASE R1` 위의
Developer 1 slot0 visualRect에 한 꼬치만 소비하는 FHD·1280×720 검수 후보다.

원본 GLB 3종과 nearest albedo 파일은 다시 만들거나 바꾸지 않는다. renderer의 scene color
multiplier와 slot0-fit 얕은 transform만 raw R1의 기존 model에 적용한다. raw의 `frontElapsedSec=0`,
`backElapsedSec=0`, `contactFace=null`, 476 triangles와 local `+Y` `0→π→2π` flip 계약을 보존한다.

이 디렉터리는 새 stable asset을 만들지 않는 소비 검수다. `runtimeRegistrationAllowed=false`이며,
사용자 피드백으로 `superseded-by-user-feedback` 상태다. 292px slot 사각형에 맞춰 실제 석쇠 대비
꼬치가 너무 짧아 보였으므로, R2가 석쇠의 대부분을 쓰는 길이를 별도 검수한다. 다음 조리 상태·R6 mat
합성·finalizer·manifest 등록은 R2 승인 전에는 진행하지 않는다.

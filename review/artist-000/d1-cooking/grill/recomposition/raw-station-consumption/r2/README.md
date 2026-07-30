# MDL-NEGIMA-GRILL-RAW R1 station consumption R2

R1의 292px legacy visualRect fit은 실제 그릴에 비해 꼬치가 짧아 보인다는 사용자 피드백으로
superseded됐다. R2는 같은 승인 raw GLB·nearest albedo만 사용해, 고정 6칸 석쇠의 한 수직 lane에서
꼬치 한 개가 약 70% 이상을 차지하게 한다.

원본 음식 raster·GLB·texture·albedo는 만들거나 바꾸지 않았고, 새 stable ID도 없다. raw의
476 triangles, local `+Y` `0→π→2π` flip, 양면 elapsed `0`, `contactFace=null`은 그대로다.
R2는 사용자 피드백으로 `superseded-by-user-feedback` 상태다. 가로 폭은 유지하고 위아래 길이를
더 늘린 R3를 검수한다. R2 footprint는 legacy slot0 visualRect보다 크므로 최종 runtime 전 Developer 1의
layout 계약 확인이 필요하다. `runtimeRegistrationAllowed=false`; finalizer·manifest 등록은 금지다.

# MDL-NEGIMA-GRILL-RAW R1

- 상태: `approved-by-user` (2026-07-30)
- ID: `MDL-NEGIMA-GRILL-RAW`
- 화면: `SCR-SVC-GRILL`
- 형태: 승인된 GLB·nearest albedo만 연결하는 Three.js runtime model composition

이 후보는 새 음식 래스터나 새 GLB를 만들지 않는다. 승인된 `MDL-SKEWER-BASE` R2,
`MDL-INGREDIENT-CHICKEN` R1, `MDL-INGREDIENT-NEGI` R3을 `닭→파→닭→파→닭`으로 연결하고,
그릴 pose에서는 꼬치 길이축 local `+Y`를 수직으로 유지한다.

`flipPivot.rotation.y`는 첫 클릭에 `0→π`, 두 번째 클릭에 `π→2π`로 같은 방향으로 회전한다. 따라서
각 클릭은 180°이고 두 번째 클릭 뒤 원래 면으로 돌아오며 누적 시각 회전은 360°다. 면별 타이머·품질·입력
잠금은 도메인 책임이며 이 조합은 그 상태를 변경하지 않는다.

`review-mdl-negima-grill-raw-flip-fhd-r1.html`은 중앙의 꼬치를 클릭해 실제 Three.js 회전을 확인하는
격리 검수판이다. PNG 검수판은 초기 raw face 한 장만 담는다. runtime 등록은 계속 금지하며, 다음 단일 검수
대상은 첫 면이 익는 중인 네기마 상태다.

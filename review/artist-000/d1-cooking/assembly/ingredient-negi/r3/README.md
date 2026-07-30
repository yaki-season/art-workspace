# Artist 000 — D1 네기마용 대파 모델 R3

- 상태: `approved-by-user` (2026-07-29)
- ID: `MDL-INGREDIENT-NEGI`
- 규격: GLB + `256×192` nearest pixel albedo

R2의 승인 재질과 alpha는 바꾸지 않는다. 실제 `MDL-SKEWER-BASE` 부모의 수평 assembly pose에서 대파가
수직으로 서도록 pixel-material-plane 회전만 교정했다. 대파의 물리 긴 축은 `local X`, 꼬치 관통 축은
`local +Y`로 계속 직교한다.

검수판은 같은 부모 회전(`Z=-90°`)을 대파 한 모델에만 적용해, 실제 jig에서 보일 수직 방향을 검증한다.
사용자가 R3를 승인했다. 다음 게이트인 실제 jig 결합 검수까지 꼬치·닭·jig·조리·전달·UI·새 래스터는 포함하지 않으며 앱 manifest와 runtime 등록은 금지다.

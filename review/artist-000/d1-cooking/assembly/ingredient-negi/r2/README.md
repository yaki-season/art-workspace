# Artist 000 — D1 네기마용 대파 모델 R2

- 상태: `superseded` (2026-07-29, 실제 jig node 결합 불일치)
- ID: `MDL-INGREDIENT-NEGI`
- 규격: `42 / 800 triangles` GLB + `256×192` nearest pixel albedo

승인 D1 조립 화면 재료 통의 **큼직한 네기마용 대파 토막 한 개**를 직접 시각 원본으로 한 bundle이다.
R1의 재질은 바꾸지 않고 결합 좌표만 교정했다. 대파의 긴 축은 `local X`, 꼬치 관통 축은 `local +Y`이므로 두 축이 직교하고, 수평 꼬치가 대파 옆면 중심을 통과한다.
짙은 초록의 골진 외피와 한쪽의 층상 절단면을 보존하며, `skewerSocket`에서 빈 꼬치 slot과 결합한다.
꼬치·닭·완성 꼬치·jig·다른 음식은 포함하지 않는다. 사용자는 R2 격리 후보를 승인했으나, 실제 D1 jig node
결합에서 부모 회전과 decal 보정이 중복돼 대파가 수평으로 보였다. 승인 증거는 보존하고, 같은 재질의 R3에서
assembly pose 기준으로 수정한다. 앱 manifest와 runtime 등록은 계속 금지다.

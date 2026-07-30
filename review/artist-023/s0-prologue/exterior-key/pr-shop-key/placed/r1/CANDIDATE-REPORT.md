# `PR-SHOP-KEY / placed` R1 후보

- 상태: `approved-by-user` (사용자 승인: `2026-07-30`)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- runtimeRegistrationAllowed: `false`
- 계약: Developer 2 작업 007 `v1.1.0` / `S0·D1 art binding contract v1.0.0`

## 사용 위치·계약

- `SCR-STORY-PROLOGUE` / `S0-STATE-KEY` / `exterior-key` / `S0-KEY-SELECT`
- `componentId`: `prologue.key`
- `requiredAssetId`: `PR-SHOP-KEY`
- `stateVariant`: `placed`
- FHD visual / interaction: `256,650,224,150` / `224,614,288,222`
- 720 visual / interaction: `171,433,149,100` / `149,409,192,148`
- layer / z-order: `interactable / 40`
- DOM safe rect FHD / 720: `128,936,1664,104` / `85,624,1109,69`

## 후보 범위

포함: 둥근 bow와 단순 bit을 가진 낡은 황동 열쇠 하나, 투명 배경, 수작업 픽셀·잉크·과슈 마감.

제외: ledge·대문·골목·자물쇠·노트·성냥갑·화로·숯·사람·신체·손·커서·문자·버튼·진행 표시·그림자·UI.

## 생성·검수

- 도구: built-in image generation + `remove_chroma_key.py` (flat `#00ff00` chroma source)
- 스타일 지시: `YS-HANDCRAFTED-NIGHT-v1`; 절제된 황동 edge highlight, 짙은 인디고 outline,
  종이·과슈 질감과 의도적 pixel cluster. 생성 문자·워터마크 금지.
- source: `source/pr-shop-key-placed-r1-chroma.png`
  - SHA-256: `fc210dc5f9ac04fa90bc53743abc41d0b5b43288b582732f098a5e9bb0cc5a2b`
- alpha asset: `assets/pr-shop-key-placed-r1.png`
  - `1254×1254 RGBA`, 네 모서리 alpha `0`, alpha range `0..255`
  - SHA-256: `a8a22c3beaa6a4ffa1b45dad6eb4438eda729d325740ad9bcb265d3363229eeb`
- isolated FHD review: `review/review-pr-shop-key-placed-isolated-fhd-r1.png`
  - `1920×1080 RGB`
  - SHA-256: `ebbe82f0e9a8c57911bbb2960909a20eb4a741b27513c1414a2609991f89e77f`

이 승인으로 FHD/720 재조립 gate만 열렸다. 최적화·finalizer·runtime 등록과 다른 S0 이미지 생성은
FHD/720 재조립의 사용자 검토 뒤에도 별도 gate로 남긴다.

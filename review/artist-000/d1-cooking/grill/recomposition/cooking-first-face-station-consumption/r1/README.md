# MDL-NEGIMA-GRILL-COOKING-FIRST-FACE station consumption R1

승인 `MDL-NEGIMA-GRILL-COOKING-FIRST-FACE R1`을 승인 raw station R3와 동일한 D1 first-lane
anchor `(609.6,515)`, `scale(1.45,1.18,1)`, root rotation `(-0.035,0.055,0)`으로 소비한다.

게임 snapshot은 `status=front`, `orientationFaceDown=front`, `contactFace=front`, front 4초,
back 0초, `stage=cooking`이다. cooking shader의 승인 mask만 사용하며 GLB·nearest albedo·texture
파일과 alpha shape를 바꾸지 않는다.

FHD·720 소비 검수와 좌측 raw R3/우측 cooking-first 비교판은 `metadata/capture-review.mjs`가 만든다.
상태는 `approved-by-user` (`2026-07-30`); `runtimeRegistrationAllowed=false`이며
finalizer·optimization·handoff·manifest는 만들지 않는다.

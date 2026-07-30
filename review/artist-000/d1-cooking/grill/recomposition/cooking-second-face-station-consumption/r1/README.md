# MDL-NEGIMA-GRILL-COOKING-SECOND-FACE station consumption R1

승인 `MDL-NEGIMA-GRILL-COOKING-FIRST-FACE` 소비 화면 R1과 동일한 D1 slot0 anchor `(609.6,515)`,
`scale(1.45,1.18,1)`, root rotation `(-0.035,0.055,0)`으로 뒤집힌 반대면을 소비한다.

검수 snapshot은 첫 입력 뒤 `completedFlips=1`, `rotationY=PI`, `orientationFaceDown=back`,
`contactFace=back`, front/back 누적 각 4초, `stage=cooking`이다. 이 값은 뒤집기 가능 시점을
제한하는 규칙이 아니며, 면별 누적 시간과 입력은 gameplay 도메인이 소유한다.

FHD·720 소비 검수와 first/second 같은 station 위치 비교판은 `metadata/capture-review.mjs`가 만든다.
실제 화면에서 대파 단면과 재료 방향은 구별됐지만 반대면 부분 sear가 충분히 드러나지 않아, 이 R1은
사용자 승인 후보로 제출하지 않았다. 기존 GLB·albedo를 보존하는 최소 shader/face-signal R2 교정안의 PM
승인이 필요하다. `runtimeRegistrationAllowed=false`이며 finalizer·optimization·runtime handoff·manifest는
생성하지 않는다.

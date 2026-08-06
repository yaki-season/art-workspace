# ST-CLEANUP-OVERLAY R1

- 상태: 사용자 최종 승인
- 승인일: 2026-08-07
- runtime build: `ST-CLEANUP-OVERLAY R1-B1`
- source atlas: `st-cleanup-overlay-r1-atlas.png`
- SHA-256: `35a2cfc79cbd06eeab462ff8285d3ef9a3627b5c75286b4d068d41b09b714c0d`
- 형식: straight-alpha PNG sprite atlas, 1024×256, 2×1 frames
- clips: `wiping-left`, `wiping-right`

황토색 행주와 짧은 좌우 동세만 포함한다. `cleanupNeeded` 식기는 별도 `PR-EMPTY-DISH-SET`이 소유하며, 이 overlay는 실제 3초 홀드 중에만 180ms 간격으로 왕복한다. 진행 게이지·문구는 DOM이 소유한다.

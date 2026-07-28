# Artist 003 core station concept review

- spec 기준: `GPL-004 v1.1.0`, `UI-002/SYS-002 v3.0.0`, `ART-002/ART-003 v3.2.0`
- 상태: P0 핵심 스테이션 조작 컨셉 r1, 사용자 시각 검수 대기
- 공통 구조: 실제 좌석 순서의 상단 주문 카드, 중앙 조작대, 하단 공유 완성품 목록
- 공통 입력: 클릭/탭 우선, 드래그·스와이프는 동일 결과의 보조 입력

| 스테이션 | 컨셉 | 포함한 플레이 |
|---|---|---|
| `ST-ASSEMBLY-TIER-1` | [`assembly/r1`](station-concepts/assembly/r1/generated.png) | 레시피 순서, 5개 슬롯 꽂기, 오입력 자동 복귀, 마지막 재료 수정, 주문 태그 이송 |
| `ST-GRILL-TIER-1` | [`grill/r1`](station-concepts/grill/r1/generated.png) | 대기 트레이, 2개 시작 슬롯/잠금 확장, 열 유지, 앞뒤 독립 익힘, 뒤집기, 타레, 덜 익음 복귀, 탄 음식 폐기 |
| `ST-DRINK-BEER-TIER-1` | [`drink/r1`](station-concepts/drink/r1/generated.png) | 단일 레버·노즐, 자동 기울기, 맥주/거품 홀드, 목표선, 넘침·부족 복구, 주문 태그 이송 |
| `ST-SERVICE-COUNTER` | [`service/r1`](station-concepts/service/r1/generated.png) | 일반 주문 자동 연결, “아무거나” 선택, 부분 제공, 부적합 음식 거절, 빈 식기 회수와 좌석 정리 |

화면 안의 숫자·수량·상태는 조작 관계를 설명하는 컨셉용 예시다. 런타임 DOM 문구나 최종 밸런스 값을 이미지에 고정하지 않았다.

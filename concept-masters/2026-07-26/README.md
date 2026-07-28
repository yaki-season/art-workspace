# 2026-07-26 전체 시각 장면 콘셉트 마스터

- 스타일 프로파일: `YS-HANDCRAFTED-NIGHT-v1`
- 기준 화면: 데스크톱 `16:9`
- 원본 크기: `1672×941`
- 생성 방식: Codex 내장 이미지 생성
- 상태: 시각 장면 구성·톤앤매너 기준 마스터
- 런타임 상태: 미분리·미승인. 이 파일들을 런타임 manifest에 직접 등록하지 않는다.
- 참조 spec: `ART-002 v3.5.0`, `ART-003 v3.8.0`, `UI-002 v5.24.0`, `UI-003 v1.0.0`, `SYS-002 v3.0.0`

이 묶음은 여러 런타임 화면에서 재사용할 구성요소를 열 개 대표 장면에 모아 그린 뒤 배경·가구·캐릭터·음식·조작물·VFX·UI 에셋으로 분리 제작하기 위한 시각 기준이다. 마스터 장수는 런타임 화면 수가 아니며 실제 주화면·오버레이·phase와 전환은 `UI-003`을 따른다. 이미지 안 아이콘과 빈 패널은 위치·크기·대비 참고용이며, 의미 텍스트·수치·게이지는 DOM 또는 동등한 UI 계층으로 다시 만든다.

도구가 읽을 수 있는 파일·해시·분리 묶음 목록은 `master-catalog.json`, 재생성·파생 제작용 프롬프트는 `PROMPTS.md`에 있다.

손님 장면은 이미지의 빈 공간을 임의의 이자카야 장식으로 해석하지 않는다. 확정 공간
순서는 `바 안쪽 주인공 카메라 → 단일 바 테이블 → 손님 좌석 → 바로 뒤 가게 대문 →
밤 골목`이다. 손님에게 가려진 배경도 대문틀·문짝·문턱·골목으로 이어지며, 막힌
후면벽·전폭 선반·깊은 별실·두 번째 카운터로 치환하지 않는다.

## 시각 장면 마스터

| 순서 | `sourceMasterId` | 파일 | 시각 장면 역할 | SHA-256 |
|---:|---|---|---|---|
| 1 | `CM-PROLOGUE-INHERITANCE-R1` | `01_prologue-inheritance-master.png` | 폐점 외관, 열쇠·노트·성냥갑·숯 | `6ad2a283...7232f51` |
| 2 | `CM-PREOPEN-PLANNING-R1` | `02_preopen-planning-master.png` | 날짜·메뉴·예약·목표·직원·준비 상태 | `99d50b2f...d302455` |
| 3 | `CM-CUSTOMER-SERVICE-R1` | `03_customer-service-master.png` | 6석 손님·주문·식사·빈 식기·정리·공용 완성품 | `150e5c98...8fa1e5f` |
| 4 | `CM-ASSEMBLY-STATION-R1` | `04_assembly-station-master.png` | 재료통·빈 꼬치·조립 지그·전달 트레이 | `f85acb10...b84711` |
| 5 | `CM-GRILL-STATION-R1` | `05_grill-station-master.png` | 대기·6칸 그릴·면 상태·타레·부채·완성·폐기 | `fa3fbd79...d9b0da5` |
| 6 | `CM-DRINK-STATION-R1` | `06_drink-station-master.png` | 단일 레버·잔 상태·넘침 선택·직원 자동 제조 | `667e8f70...183ee2` |
| 7 | `CM-SETTLEMENT-R1` | `07_settlement-master.png` | 주문·품질·대기·매출·팁·명성·실패·보상 | `6643a256...22ea02` |
| 8 | `CM-GROWTH-PURCHASE-R1` | `08_growth-purchase-master.png` | 메뉴·스테이션·직원·인테리어 구매 | `cc195ceb...5cd958` |
| 9 | `CM-RECIPE-NOTE-R1` | `09_recipe-note-master.png` | 레시피 복원·취향·기록·힌트·다음 목표 | `b3d4a6bd...e0d833d` |
| 10 | `CM-PAUSE-SETTINGS-R1` | `10_pause-settings-master.png` | 입력·소리·진동·도움·초보 보조·접근성 | `b8b9e022...dfdb5c` |

## 공통 분리 순서

1. `background`: 화면별 설정에 맞는 골목·대문·문틀·문짝·문턱·창·측면 벽·천장
   조명처럼 상태 변화가 적은 2D 배경. 손님 장면의 대문을 일반 후면벽·선반으로
   치환하지 않는다.
2. `architecture`: 바 상판·작업면·의자·스테이션 몸체처럼 anchor와 가림선을 정하는 구조물.
3. `actors`: 손님·직원·이야기 인물. 캐릭터별 atlas와 하단 중앙 pivot으로 분리한다.
4. `interactables`: 음식·꼬치·잔·레버·집게·붓·부채·종이 카드처럼 직접 조작하거나 상태가 바뀌는 물체.
5. `state-overlays`: 잠금·예약·정리·품질·자동화처럼 물체에 부착되는 비문자 상태 표시.
6. `vfx`: 불씨·연기·기름·거품·넘침·판정 링. 논리 상태와 별도 atlas로 분리한다.
7. `foreground`: 전경 프레임·가림용 상판 모서리·modal dim veil.
8. `ui-art`: 의미 아이콘과 종이·목재 frame만 분리한다. 텍스트·수치·실시간 게이지·접근성 focus는 DOM/CSS로 만든다.

## 시각 장면별 분리 대상

| 화면 | 필수 분리 묶음 |
|---|---|
| 프롤로그 | 폐점 외관 base, 빈 간판·제등 decal 면, 접힌 노렌, ledge, 열쇠, 노트, 성냥갑, 화로, 숯, 점화 VFX, 목표·건너뛰기 UI frame |
| 영업 전 | 빈 6석 배경, 계획 folio, 날짜 카드, 메뉴 카드 3종, 좌석·예약 token, 목표 카드, 직원 카드, 준비물 token, 영업 시작 seal |
| 손님 | 대문·문틀·문짝·문턱·밤 골목 base, 6석 anchor, 손님 5종과 빈 좌석, 단일 바 상판, 좌석 mat, 음식·맥주·빈 식기, 머리 위 상태, 정리 overlay, 공용 완성품 band |
| 조립 | 작업 배경, 재료통 3개, 닭·대파, 빈 꼬치, 조립 지그, 단계별 조립 꼬치, 전달 tray, 주문서 frame, 공용 준비 band |
| 그릴 | 작업 배경, 6칸 grill body, coal layer, 잠금 slot, raw/cooking/turn/tare/over/burnt skewer, 대기·완성·폐기 tray, 집게, 붓·타레통, 부채, VFX, 경고·주문·준비 UI frame |
| 드링크 | 측면 배경, tower·단일 lever·nozzle·drip tray, 빈 잔 rack, 맥주·거품 layer, 잔 상태 6종, 완성 tray, 제공/폐기 선택 frame, 직원 자동 제조 overlay, 공용 진행 ring |
| 정산 | 마감 내부 base, 마지막 숯 VFX, ledger, 주문·품질·대기·수익·명성 module, 실패 strip, 영수증·coin·tip·보상 token, 확인·건너뛰기 seal |
| 성장 | 내부 base, catalog, 4 category tab, item card, lock·조건·보유·자동화 badge, selected detail, 비교 illustration, currency token, 구매 seal |
| 노트 | 내부 base, notebook cover·page, 얼룩·찢김 overlay, 재료·공정·완성 illustration, lock page, 복원 track, 취향 marker, memento pocket, 기록 영역, 다음 목표 card |
| 설정 | 일시정지 배경, dim veil, board frame, paper panel, 행별 icon, slider·toggle·shape preview, 재개·종료·도움 초기화 button, confirmation overlay |

## 분리 제작 규칙

- 마스터의 구도·소실점·광원 방향·상판 높이·물체 접촉면을 유지한다.
- 프롬프트 작성 전에 설정·시나리오·상세 화면과 마스터의 공간 단서를
  `spatial-inference.json`으로 기록하고 승인한다.
- 가려진 면은 분리 시 복원하되 원본 합성에서 보이지 않던 새 장식을 추가하지 않는다.
- 캐릭터·음식·도구는 배경보다 높은 대비와 정보 밀도를 유지한다.
- 빈 간판·빈 카드·빈 라벨 영역에 생성 문자를 추가하지 않는다.
- 분리본은 `sourceMasterId`, `styleRefs`, `finishPass`, pivot, anchor와 `1920×1080` 재합성 결과를 provenance에 기록한다.
- 이미지에 보이는 UI는 공간·크기 참고이며 기능 구현 시 `UI-003`의 상세 화면 ID·구성요소·전환과 `UI-002`의 입력·접근성 계약을 우선한다.
- 각 분리본은 `componentOwner`와 사용하는 모든 `screenIds`를 기록한다. 마감/정산, 성장 허브/구매, 노트/다음 목표, pause/settings를 마스터의 한 panel로 고정하지 않는다.
- 경계 상자는 이 마스터에서 실측해 companion metadata에 기록한다. 임의의 좌표를 선기입하지 않는다.

## 현재 검수 결과

- 10개 파일 모두 `1672×941`, 16:9 계열의 동일 캔버스다.
- 손님 화면은 주인공 몸과 조리 설비를 제거한 순수 손님 정보 화면이다.
- 조립·그릴·드링크는 손님 화면과 분리된 독립 작업 화면이다.
- 드링크는 단일 레버이며 직원 자동 제조 layer와 수동 영역이 겹치지 않는다.
- 설정 화면은 게임패드 대신 단일 포인터·터치 입력 아이콘을 사용한다.
- 런타임 분리, 알파 경계 복원, anchor 실측, `UI-003` 상세 화면별 FHD/720p 재합성은 후속 작업이다.

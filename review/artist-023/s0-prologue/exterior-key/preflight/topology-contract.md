# S0 `exterior-key` topology contract R2 — Developer 2 contract 반영 검토안

- 상태: `approved-by-user` (2026-07-30)
- semanticOwner: `Artist 2 / S0-PROLOGUE-STORY`
- 대상: `SCR-STORY-PROLOGUE` / `S0-STATE-KEY` / `exterior-key` / `S0-KEY-SELECT`
- Developer 2 입력: 작업 007 `v1.1.0`, `S0·D1 art binding contract v1.0.0`
- 다음 단일 후보(사용자 승인 후에만): `PR-SHOP-KEY` / 표시명 `놓임`, contract `stateVariant=placed`
- sourceMasterId: `CM-PROLOGUE-INHERITANCE-R1` (읽기 전용 시각·질감 참조만 허용)

## 확정할 공간·카메라 topology

1. 고정 `16:9` 외관 카메라는 비 갠 밤 골목의 맞은편에서 작은 목조 점포 정면을 바라본다.
   가게의 주 출입구는 화면 수평 중앙에 한 개만 두며, 양쪽 골목은 젖은 돌바닥과 닫힌 인접 점포의
   연속면으로 이어진다. 손님석·바 카운터·실내 조리 설비·플레이어 신체는 이 phase에 노출하지 않는다.
2. 중앙 출입구는 **완전히 닫힌 대문**이다. 문틀·문턱·두 문짝과 잠금부는 하나의 고정된 개구부로
   읽혀야 하며, 닫힘 상태에서 실내의 빈 6석·카운터·화로가 보이는 열린 창처럼 대체하지 않는다.
3. `PR-SHOP-KEY`의 `놓임`(`placed`) 상태는 중앙 대문보다 앞쪽인 화면 하단 왼쪽의 낮은 젖은 ledge 위에
   단독으로 놓인다. 대문·골목·바닥의 원근을 따르되, 노트·성냥갑·화로·숯·다른 소품과 묶지 않고
   커서·손·화살표가 위치를 설명하지 않는다.
4. `S0-STATE-GATE / gate-open`은 **동일한 카메라, 수평선, 점포 폭, 골목 원근, 문틀과 문턱 anchor**를
   유지한다. 변경 가능한 기하·가림은 중앙 대문의 열림과 그 개구부를 통해 보이는 빈 실내뿐이다.
   외관 카메라를 실내 카메라로 교체하거나 골목·점포·대문 위치를 재구성하지 않는다.
5. DOM은 이미지와 별도다. `prologue.progress`, `prologue.skip`, 단계 안내, focus, 버튼 문자와
   `S0-KEY-SELECT`의 접근 가능한 입력은 래스터에 굽지 않는다. Developer 2 contract가 고정한
   key visual·interaction·DOM safe 영역을 아래 표로 소비하며, 이 영역은 래스터에 표시하지 않는다.

## 불변·금지

- 무실패 단일 클릭만 허용하며 숨은 대상, 점수, 실패, 추가 클릭 단계는 만들지 않는다.
- 레시피 노트와 `CH-AKI-STORY`는 이 화면에 보이거나 클릭 대상이 되지 않는다.
- 손·팔·전신, 문자·버튼·진행표시·커서·건너뛰기 표식은 래스터에 포함하지 않는다.
- 공유 `CM-PROLOGUE-INHERITANCE-R1` master와 topology registry를 수정·덮어쓰지 않는다.

## 기존 master 판정

`CM-PROLOGUE-INHERITANCE-R1`은 밤 골목·목재·젖은 바닥의 분위기 참조에는 사용할 수 있으나,
`exterior-key`의 source topology를 충족하지 않는다 (`불충족`). 현재 master는 열린 점포 내부를 동시에
보여 주고, 하단에 열쇠·노트·성냥갑·화로·숯을 함께 두며, 커서와 UI frame·skip/pause 표식을 래스터에
포함한다. 또한 topology registry도 이 master를 여러 구형 phase가 섞인 `pending-user-review`로 기록한다.
따라서 본 계약의 사용자 승인 전에는 master 분리·이미지 생성·runtime 등록을 진행하지 않는다.

## Developer 2 작업 007 contract 값

| 항목 | 고정값 |
|---|---|
| contract | 작업 007 `v1.1.0` / `S0·D1 art binding contract v1.0.0` |
| `componentId` | `prologue.key` |
| `requiredAssetId` | `PR-SHOP-KEY` |
| `stateVariant` | `placed` |
| `semanticOwner` | `artist-2.s0-prologue-story` |
| 카메라 | `S0-EXTERIOR-FIXED-V1`, fixed `16:9`, `contain` |
| FHD `visualBounds` | `x=256, y=650, width=224, height=150` |
| FHD `interactionBounds` | `x=224, y=614, width=288, height=222` |
| 720 `visualBounds` | `x=171, y=433, width=149, height=100` |
| 720 `interactionBounds` | `x=149, y=409, width=192, height=148` |
| layer / z-order | `interactable / 40` |
| DOM safe rect FHD | `x=128, y=936, width=1664, height=104` |
| DOM safe rect 720 | `x=85, y=624, width=1109, height=69` |

FHD→720은 별도 crop 없이 정확한 `2/3 contain` 축소다. key의 FHD interaction 하단은 `y=836`으로
DOM safe rect 시작 `y=936`보다 위에 있어 겹치지 않는다.

## topology compatibility

- **충돌 없음.** `prologue.key`의 FHD visual bounds(`x=256~480`, `y=650~800`)는 하단 왼쪽 key ledge
  계약과 일치하고, 닫힌 중앙 대문·문틀·문턱을 재구성하지 않는다.
- `S0-EXTERIOR-FIXED-V1`은 `gate-open`도 같은 fixed `16:9`/`contain` exterior camera로 소비하므로,
  기존의 동일 카메라·수평선·점포 폭·골목 원근 불변식과 일치한다.
- contract가 제공하지 않은 note·charcoal·신체·raster UI/text 항목은 이 `exterior-key` component에
  추가하지 않는다. `gate-open`, `ignite`의 별도 component 계약이나 이미지 후보도 이번 revision의
  범위 밖이다.

사용자 topology 승인 후 단일 gate는 위 contract bounds를 소비하는 `PR-SHOP-KEY / placed` 한 개의
visible 후보 제작이다. 승인 전에는 이미지 생성·분리·재조립·finalizer·runtime 등록을 진행하지 않는다.

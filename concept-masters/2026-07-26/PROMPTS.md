# 전체 화면 콘셉트 마스터 프롬프트 세트

## 공통 프롬프트

```text
Use case: stylized-concept
Asset type: YAKI SEASON full-screen game scene master and future layer-separation source
Style/medium: YS-HANDCRAFTED-NIGHT-v1 original hand-drawn 2.5D game illustration. Visible pencil underdrawing, slightly irregular ink, opaque gouache blocks, paper grain, worn wood/brass/ceramic, and deliberate shape-explaining pixel clusters. No glossy 3D.
Composition/framing: one full-bleed 16:9 gameplay scene, not a concept sheet. Background, architecture, actors, interactables, state overlays, VFX, foreground, and UI art must have practical separable silhouettes and shared perspective.
Lighting/mood: warm amber task light and lanterns against deep but readable indigo night. Faces, food, and tools keep readable midtones. Background stays one detail step quieter.
Color palette: amber, burnt orange, deep indigo/navy, dark walnut, cream paper, aged brass, restrained moss and burgundy accents.
Constraints: no generated semantic text or numbers, no fake Japanese, no watermark, no border, no captions, no concept-sheet panels. Meaningful copy and live values are reserved for DOM UI.
Avoid: photorealism, smooth plastic skin, glossy PBR, uniform vector lines, full-screen orange tint, crushed blacks, random pixel noise, tiny dense UI, impossible perspective.
```

## 화면별 프롬프트

### 01 프롤로그

```text
Closed inherited storefront at blue hour, seen from the wet alley threshold. Unlit blank sign and lantern faces, folded noren, dim six-seat interior and cold grill. A foreground ledge clearly separates an old brass key, stained recipe notebook, aged matchbox, and cold charcoal brazier with an ignition point. Include only icon placeholders for objective, skip, and pause. Make storefront base, decals, noren, props, charcoal, ember VFX, ledge, and UI frame separable.
```

### 02 영업 전

```text
First-person pre-opening view from behind the bar with six empty seats. A grounded open planning folio contains separable date, menu, reservation, goal, staff assignment, and readiness modules. Show negima, momo, beer, six seat tokens, staff role silhouettes, charcoal/ingredient/glass/clean-seat tokens, and a large open-shop seal without text.
```

### 03 손님 정보

```text
True first-person view from the protagonist's position inside the bar, looking across one and only one bar counter. The spatial order is protagonist camera, single bar counter, customer seats, the shop's large main entrance immediately behind the customer side, then the narrow indigo night alley outside. Keep the entrance frame, door leaves, threshold, and alley readable between and behind the customers; hidden background surfaces must continue as those entrance and alley structures. Never replace the entrance with a sealed rear wood wall, a full-width bottle shelf wall, a deep back room, or a second counter. Show no player body or player-side kitchen equipment. Six seat zones: five varied customers and one empty cleanup seat. Align thinking, order, patience, eating, drinking, food, beer, empty dishes, and cleanup state by seat. Add a bottom shared completed-item band, station arrows, quick switch, pause, and clock placeholders.
```

### 04 조립

```text
Independent downward assembly workspace in the same bar. Include three ingredient containers, raw chicken, cut green onion, empty bamboo skewers, five-position alternating assembly jig, in-progress and invalid states, completed transfer tray, up to six receipt cards, table-view control, bottom prepared-item band, and navigation controls.
```

### 05 그릴

```text
Independent downward grill workspace. Include one six-slot grill body with four glowing active lanes and two unavailable dark lanes; waiting tray; raw, cooking, turn-ready, tare, overdone, and burnt skewer states; finished and discard trays; tongs; tare brush/pot; hand fan with cooldown ring; fire bar; restrained embers, smoke, oil sparks; receipts, prepared band, navigation, and three nonblocking warning locations.
```

### 06 드링크

```text
Independent side/down drink workspace. Include one aged-brass tower with one lever and nozzle, empty-glass rack, active glass, drip tray, finished tray, empty/beer-only/balanced/too-foamy/overflow/discard glass states, beer and foam indicators, equal serve-low-quality versus discard choices, and a separable rear staff-auto-production layer with one circular progress ring. Manual lever stays unobstructed.
```

### 07 정산

```text
Quiet post-service interior with empty seats and last embers. A grounded open ledger separates orders, four quality seals, waiting, income/tips, reputation, failure/cancellation, and reward modules. Include receipts, coins, tip bowl, recipe-page and reputation rewards, confirm seal, and skip icon without text.
```

### 08 성장·구매

```text
Tactile upgrade catalog in the same shop. Four icon-only tabs for menu, station, staff, and interior. Item cards cover food, grill, beer equipment, seat/lantern, hall staff, beer staff, and cooking skill. Reserve blank cost, reputation, effect, odds, owned, available, and locked areas. A large selected detail panel contains before/after illustration, effect icons, cost/condition badges, and purchase seal.
```

### 09 레시피 노트

```text
Inherited stained ring notebook on the counter. Left page diagrams negima ingredients, alternating assembly, charcoal turn, tare, and plated result. Right page separates restoration seal, locked/torn recipe pages, taste preferences, matchbox and reservation mementos, hint, blank personal record, restoration track, bookmarks, page controls, and a next-goal card.
```

### 10 설정·일시정지

```text
Customer scene frozen behind a separable indigo dim veil. Center a hanging wood-and-paper board with rows for single-pointer/touch input, master/music/effects sound, vibration, help reset, beginner assist with four sub-icons, brightness/contrast, and color-plus-shape feedback. Bottom buttons are resume, end/door with confirmation slot, and help reset. Use no gamepad icon.
```

## 기준 이미지 역할

- `art-workspace/review/artist-006/customer-types/r1/generated.png`: 캐릭터 다양성과 손그림 표면.
- `art-workspace/review/artist-002/customer-master/r7/generated.png`: 6석 공간과 손님 정보 밀도.
- `art-workspace/review/artist-003/station-concepts/assembly/r1/generated.png`: 조립 구성요소와 조작 가독성.
- `art-workspace/review/artist-003/station-concepts/grill/r1/generated.png`: 그릴 상태·도구·VFX 가독성.
- `art-workspace/review/artist-003/station-concepts/drink/r1/generated.png`: 단일 레버·잔 상태 가독성.
- `docs/inbox/2.art-concept/01_shop_exterior_torikoyomi.png`: 외관 구조 참고만 사용.
- `docs/inbox/2.art-concept/10_daily_gameplay_loop.png`: 화면 흐름 참고만 사용.
- `docs/inbox/2.art-concept/11_upgrade_and_menu_unlock.png`: 성장 화면 정보 위계 참고만 사용.
- `docs/inbox/2.art-concept/13_art_style_guide.png`: 초기 2D/3D 결합 방향 참고만 사용.

초기 이미지의 문자·수치·이전 상호·패널 구도는 재사용하지 않는다.

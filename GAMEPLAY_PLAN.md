# AI_GENERATED_RPG – Gameplay Roadmap (FF-VI flavour)

_Last updated: 2025-06-14_

---

## A. Inspiration – What made Final Fantasy VI compelling?

1. **Visual & audio style**
   * 16-bit SNES pixel art (32×32 field tiles, richly animated sprites, parallax battle backdrops).
   * Mode-7 style world-map rotation / zoom for the airship.
   * Character portraits during dialogue; highly emotive sprite poses.
   * Soaring, character-themed soundtrack; iconic victory fanfare.

2. **Core gameplay loop**
   1. Traverse overworld / towns / dungeons → RNG encounter check every step.
   2. Active-Time Battle (ATB) with a **party of up to 4** vs enemy formations.
   3. Each character chooses Command (Fight / Magic / Special / Item) when their gauge fills.
   4. Victory grants EXP, Gil, loot drops, and Magic AP; levelling raises stats.
 

3. **Narrative beats**
   * Ensemble cast – multiple protagonists with interweaving arcs.
   * Evil Empire vs Rogue outlaw heroes conflict; World of Balance → World of Ruin midpoint twist.
   * Set-piece moments (Opening march, Opera House, Floating Continent, Airship freedom).

4. **Juice & polish**
   * ATB gauges that fill in real time, flashing when ready.
   * Battle swirl transition; party victory poses.
   * Spell animations with screen flashes / shakes.
   * Cinematic mode-7 airship flight and tile-based Mode-7 map rotation.

---

## B. Technical Roadmap – Implementing the Design Refinement (2025-06-13)

_This replaces the legacy Phase 1-5 list with a development-ready plan that aligns with the **Design Evaluation & Refinement Roadmap**._

### Phase 0 – Completed
Elemental Resonance, cinematic, TitleScreen, palette pipeline, Risk meter & shrines, dynamic lighting filter, CI demo workflow.

### Phase 1 – Depth & Polish (current sprint)
| Track | Deliverable | Notes |
|-------|-------------|-------|
| Art   | Replace placeholder hero & enemy sprites | Create Aseprite source, export via pipeline |
| Narrative | Branching dialogue YAML & voice barks | Extend dialogue loader, implement voice stub |
| Audio | Dynamic soundtrack system | Layered Howler.js playback; intro 5 tracks |
| Mechanics | Risk FX tuning & shrine animation | FX when risk high; glow on shrine tiles |
| UI | Tooltip & auto-save prompt | Hover/click item descriptions, IndexedDB save |

### Phase 2 – Depth & Polish (target: 3 weeks)
| Track | Deliverable | Tech Notes |
|-------|-------------|------------|
| Art   | Expand sprite library; **dynamic lighting shader** | • GLSL normal-map material added to Pixi pipeline.<br>• Ambient light tween during day/night.
| Narrative & Dialogue | Branching dialogue YAML + voice barks | • Dialogue system parses `choices:` array and `flag:` conditions.<br>• Stubbed `audio/voice/` barks auto-selected per speaker.
| Mechanics | **Risk Meter** & Shrines | • `risk` field on party; UI bar beside ATB.<br>• Map tile property `shrineId`; shrine script grants passive.
| Audio  | 5-track adaptive soundtrack | • Howler.js layered tracks; cross-fade logic in `audioManager.ts`.
| Release | **Public Alpha** | • Itch.io web build + survey link.

### Phase 3 – Accessibility & Balance (target: 2 weeks)
| Track | Deliverable | Tech Notes |
|-------|-------------|------------|
| UI/UX | Inventory sort, cooldown icons, auto-save | • React menu components refactored for keyboard / gamepad nav.<br>• Auto-save trigger on map transition; store in IndexedDB. |
| AI & Balance | Tactician enemy scaling; difficulty curves | • Enemy `AIAdaptive` uses trend analysis of player commands.<br>• Balance spreadsheet → JSON import. |
| Accessibility | Screen-reader text export | • Add `aria-live` attributes where possible; ALT-log mode dumps battle text to console. |
| Release | **Beta Build** | • Feature-complete; invite closed testers.

### Phase 4 – Expansion & Community (ongoing)
| Track | Deliverable | Tech Notes |
|-------|-------------|------------|
| DLC Hooks | Rival path & post-game dungeon scaffolding | • Story flags reserved (`flag.rival_route`, `flag.postgame_dungeon`). |
| Modding | Data-driven systems exposed | • Document JSON schema for formations, YAML for scenes.<br>• CLI `modpack` validator. |
| Community | Fan-art & story contest pipeline | • Static site generator page pulling submissions from GitHub PRs.

---

## C. Immediate Sprint Backlog (next 7 days)
1. **Sprite Overhaul** – draw 8-frame walk cycle for hero, 2 enemy sprites; export via script; integrate into map & battle.
2. **Branching Dialogue Parser** – extend `sceneLoader` to support `choices`, flags; implement voice bark stub; write vitest tests.
3. **Dynamic OST** – implement `audioManager.ts` with layered tracks; swap battle theme when Risk > 66.
4. **Tooltip & Auto-save** – add React tooltip component; save to IndexedDB on map transition; unit tests.
5. **Risk FX polish** – add screen vignette red tint when Risk > 80.

> _We will continue to land small vertical slices so the game remains playable after each merge._ 
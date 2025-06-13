# TODO – Bridging Design ↔ Tech Gaps (generated 2025-06-14)

Derived from DESIGN_REFINEMENT_ROADMAP.md (v2025-06-14). Ordered roughly by dependency & impact.

## 1. Narrative & Dialogue
- [ ] Extend `sceneLoader.ts` to parse `choices`, `flags`, and `voice:` fields.  
  • Add Vitest coverage for YAML parsing edge-cases.  
  • Update `GameEngine.chooseOption()` to set / read boolean flags.
- [ ] Voice bark stub: `audio/voice/<actor>_*.ogg`; play via new `voiceManager.ts` when scene line has `voice:` key.
- [ ] Sample branching YAML: `scenes/forest_split.yaml` demonstrating flag gating.

## 2. Sprite Overhaul
- [ ] Produce 8-frame walk cycle for main hero (`hero_main.aseprite`); export via `scripts/aseprite_export.js` → `sprites/hero/main.png`.
- [ ] Two enemy sprites (Goblin, Slime) with 2-frame idle + hit flicker.
- [ ] Replace geometric placeholders in `MapScene` & `BattleScene` with sprite textures (PIXI.Sprite).
- [ ] Add Vitest render test with `@pixi/core` headless context to ensure textures load.

## 3. Audio: Dynamic OST + SFX
- [ ] Create `audioManager.ts` with Howler.js layered tracks (`field`, `battle`, `boss`, `victory`, `ambient`).
- [ ] Transition battle theme when `party.risk > 66` and back when < 33.
- [ ] Hook Elemental Resonance combos to play stinger SFX (`sfx/elemental/combo_aether.ogg`).

## 4. UI / UX Polish
- [ ] Tooltip component (`<Tooltip text="…" />`) rendered on hover for items/spells.
- [ ] Auto-save service: write/restore JSON payload to IndexedDB `ai_rpg_save_v1` on map transition & quit.
- [ ] Add ESC → pause menu with "Save", "Options", "Quit".

## 5. Mechanics Tuning
- [ ] Risk FX: red vignette shader when `risk > 80`; pulse opacity with GSAP.
- [ ] Shrine tile animation: pulsating glow (`@pixi/particle` or simple Graphics alpha tween).
- [ ] Enemy AI variety: introduce `AIType.PATTERN_CYCLE` (Sentinel), `AIType.RANDOM_SKILL`, plus combo reaction to player Resonance type.
- [ ] Add unit tests for AI decision tables.

## 6. Content Pipeline & Mod Support
- [ ] Document JSON/YAML schema in `docs/data_schema.md`.
- [ ] CLI `scripts/modpack.js` that validates and zips custom `sprites/`, `scenes/`, `formations.json` for drop-in loading.
- [ ] Load external mod packs via query param `?mod=path/to/zip` (future).

## 7. Art Polish / Parallax Backgrounds
- [ ] Design layered parallax for Windridge Trail (`bg_windridge_far.png`, `mid.png`, `near.png`).
- [ ] Use GSAP to offset layers based on camera scroll.

## 8. Dynamic Lighting Enhancements
- [ ] Animate day/night by lerping `DynamicLightFilter` radius & global tint over `time` state.
- [ ] Optional torch item increases radius.

## 9. QA & CI Improvements
- [ ] Add Playwright e2e test: load page → create party → trigger first battle; assert ATB gauges render.
- [ ] Add `demo.yml` step to upload Playwright trace.

---
Keep each task PR-sized (<300 LOC) and ensure `npm test` & `pytest` stay green after every merge. 
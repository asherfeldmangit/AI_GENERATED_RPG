# AI_GENERATED_RPG – Design Evaluation & Refinement Roadmap

_Last updated: 2025-06-14_

---

## 1. Executive Summary
AI_GENERATED_RPG already demonstrates technical momentum—procedural map loading, nascent ATB combat, and data-driven content. To elevate it from proof-of-concept to a memorable, **original** JRPG, we must clarify its creative identity, deepen its core loop, and polish its presentation. The following evaluation grades each pillar, then proposes a phased roadmap that balances quick wins with long-term differentiation.

| Pillar            | Current Grade | Critical Issues                                   | High-Level Goal                             |
|-------------------|---------------|---------------------------------------------------|---------------------------------------------|
| Presentation      | B-           | Logo & cinematic implemented, UI still placeholder| Polish HUD & dialog panels                  |
| Gameplay Loop     | B            | Resonance, Risk & Shrines live; pacing tuning     | Deepen combo interactions & enemy AI        |
| Art Style         | B-           | Palette locked, dynamic lighting; sprites WIP     | Replace temp sprites, add parallax BGs      |
| Story             | C            | Minimal plot; high-level FF-VI notes only         | Draft Chapter 1 with fresh themes           |
| Characters        | C            | Archetypes sketched, not nuanced                  | Relatable party with personal stakes        |
| Dialogue          | C            | Functional text box; no voice or branching        | Engaging, branching, voice-compatible lines |


## 2. Detailed Pillar Evaluation & Recommendations

### 2.1 Presentation
**Strengths**: Modular scene system; roadmap awareness of parallax, camera, and dialogue portraits.
**Weaknesses**: No title screen, interim logo, or opening cinematic; UI feels programmer-centric.
**Recommendations**:
1. Design a title logo evoking "retro-futurist" crystal motifs.
2. Build an opening 30-second in-engine cinematic (parallax scroll ➜ hero silhouette ➜ looming "Eclipse Citadel").
3. Replace default fonts with pixel-hinted bitmap font; adopt 3-tone UI palette.

### 2.2 Gameplay Loop
**Strengths**: ATB framework, multi-enemy formations, equipment bonuses.
**Weaknesses**: Lacks signature mechanic; progression shallow; exploration unrewarding.
**Recommendations**:
1. Introduce **Elemental Resonance** – each action deposits "Aether" or "Void" charges on the timeline; combos trigger buffs/debuffs.
2. Layer a **Risk meter** that rises with powerful skills, encouraging rotation.
3. Reward overworld exploration via hidden shrines that grant passive Resonance perks.

### 2.3 Art Style
**Strengths**: Commitment to 32×32 grid; SNES inspiration.
**Weaknesses**: Placeholder sprites, inconsistent color ramps.
**Recommendations**:
1. Lock a 28-color master palette (emulating CRT vibrancy).
2. Hand-animate 8-frame walk cycles; exaggerate silhouettes for readability.
3. Backgrounds: painterly parallax layers with subtle hue-shift to separate planes.

### 2.4 Story
**Strengths**: FF-VI style ensemble goal; world-state shift concept.
**Weaknesses**: No inciting incident or thematic twist yet.
**Recommendations**:
1. Premise: An eclipse locks magic into dual forms—Aether (creation) vs Void (entropy).
2. Chapter 1: Heroes escort a **living relic** across Windridge Pass while Empire agents pursue.
3. Foreshadow betrayal through environmental clues (burnt Esper shrines).

### 2.5 Characters
**Strengths**: Party slot logic exists.
**Weaknesses**: Personal motives undefined; villains generic.
**Recommendations**:
1. Protagonist: Ex-imperial cartographer haunted by lost maps.
2. Antagonist: Empire tactician whose strategies adapt to player patterns (AI difficulty scaling).
3. NPCs: Implement micro-stories that reflect and question party choices.

### 2.6 Dialogue
**Strengths**: Text box groundwork.
**Weaknesses**: Static, linear.
**Recommendations**:
1. Author branching dialogue YAML with flag-gated responses.
2. Inject character quirks (e.g., cartographer speaks in coordinates).
3. Record placeholder voice grunts for UI feedback.

---

## 3. Prioritized Improvement List (by Impact → Effort)
1. **Branching Dialogue & Voice Barks** (High I / Med E)
2. **Cohesive Pixel Sprite Overhaul** (High I / High E)
3. **Dynamic Soundtrack + Battle SFX pass** (High I / Med E)
4. **UI/UX Polish & QoL (auto-save, tooltips, inventory sort)** (Med I / Low E)
5. **Enemy AI Variety & Combo Reactions** (Med I / Med E)
6. **Community Hooks & Mod Support** (Low I / Low E)

(Key: I = Impact, E = Effort)

---

## 4. Phased Roadmap

### Phase 0 – Completed ✅ _(2025-06-14)_
• Elemental Resonance + gauges
• TitleScreen + 30-sec cinematic
• Palette + tileset pipeline script
• Risk meter & shrine mechanic

### Phase 1 – Depth & Polish _(in progress)_
• Expand sprite library; **replace placeholder hero/enemy sprites**.
• Tune Risk meter curve & FX; add shrine healing animation.

### Phase 2 – Accessibility & Balance _(2 weeks)_
• Refine UI (inventory sort, cooldown icons, auto-save prompts).
• Difficulty scaling for AI tactician; playtest balance curves.
• Implement screen-reader-friendly text export.
• **Milestone**: Beta content-complete build.

### Phase 3 – Expansion & Community _(ongoing)_
• DLC hooks: optional rival path, post-game dungeon.
• Expose data-driven systems for modding (JSON formations, YAML scenes).
• Host monthly art/story contests; feature winners in credits.
• **Milestone**: Version 1.0 launch & roadmap for free updates.

---

## 5. Actionable Task Breakdown

1. **Combat**
   * Code Resonance stacks: enum `EnergyType { AETHER, VOID }` + combo resolver.
   * Visual: overlay colored sparks when combo triggers.
   * Balancing: Vitest unit tests for Resonance chain calculations.

2. **Art**
   * Palette approval gate before production.
   * Use Aseprite tags for animation timing; export to `sprites/{character}/{state}.png`.

3. **Narrative**
   * Scene YAML schema: `actors`, `camera`, `dialogue`, `flags`.
   * Establish writing style guide (tone, contractions, prohibited clichés).

4. **UI/UX**
   * Implement input buffering to reduce menu lag.
   * Tooltip system that parses `description` fields from item JSON.

5. **Audio**
   * Use FMOD or Howler.js layering for adaptive tracks.
   * SFX naming convention: `sfx/elemental/{aether_hit_01.ogg}`.

6. **Testing & QA**
   * Automated end-to-end test: random 5-minute playthrough script.
   * Community beta forum with upvote tagging for bug priority.

---

## 6. Creative Constraints & Differentiators
• No direct homages—replace classic elements with **Aether/Void** energy, **Eclipse Citadel**, **Airship Monolith**.
• Mix pixel art with subtle parallax & dynamic lighting to modernize the retro look.
• Moral ambiguity: allow players to side with the Empire or relic cult; endings branch accordingly.

---

> "A map is a promise of discovery—let us chart a course no hero has walked before." — **Eamon, Ex-Cartographer Protagonist**

---

**Next Commit**: Integrate Phase 1 tasks into trello backlog and assign owners. 
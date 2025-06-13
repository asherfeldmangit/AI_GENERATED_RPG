from __future__ import annotations

import random
from typing import List

from .party import Party
from .party_battle import PartyBattle
from .player import Player
from .enemy import Enemy
from .data_enemies import ENEMIES
from .data_story import STORY, StoryScene, StoryOption
from .story import story_event, skill_check_event  # reuse healing search options if needed

Phase = str  # 'story' | 'battle' | 'skill' | 'end'


class GameEngine:
    """Pure Python game engine (no IO)."""

    def __init__(self, party: Party, rng: random.Random | None = None):
        self.party = party
        self.enemies: List[Enemy] = [e for e in ENEMIES]
        self.rng = rng or random.Random()

        self.scene_id = "start"
        self.phase: Phase = "story"
        self.enemy_index = 0
        self.battle: PartyBattle | None = None
        self.log: list[str] = []
        self.log.append(self.current_scene().get("text", ""))

    # ---------------- Data helpers -----------------
    def current_scene(self) -> StoryScene:
        return next(s for s in STORY if s["id"] == self.scene_id)

    def current_enemy(self) -> Enemy | None:
        if self.enemy_index < len(self.enemies):
            return self.enemies[self.enemy_index]
        return None

    # ---------------- Phase transitions ------------
    def next_phase(self) -> None:
        if not self.party.alive:
            self.phase = "end"
            self.log.append("The party has fallen.")
            return
        if self.enemy_index >= len(self.enemies):
            self.phase = "end"
            self.log.append("All enemies defeated! Victory!")
            return
        if self.phase == "story":
            self.battle = PartyBattle(self.party, self.current_enemy(), rng=self.rng)
            self.phase = "battle"
            self.log.append(f"A wild {self.current_enemy().name} appears!")
        elif self.phase == "battle":
            self.phase = "skill"
        elif self.phase == "skill":
            self.enemy_index += 1
            self.phase = "story"
            if self.enemy_index < len(self.enemies):
                self.scene_id = "start"  # simple loop back; extend as needed
                self.log.append(self.current_scene()["text"])

    # ---------------- Story ----------------
    def choose_option(self, idx: int) -> None:
        if self.phase != "story":
            return
        options = self.current_scene()["options"]
        if idx < 0 or idx >= len(options):
            return
        option: StoryOption = options[idx]
        cons = option.get("consequence")
        if cons:
            if cons.get("heal"):
                for m in self.party.members:
                    m.hp = min(m.max_hp, m.hp + cons["heal"])
            if cons.get("damage"):
                for m in self.party.members:
                    m.hp = max(0, m.hp - cons["damage"])
            if cons.get("potion"):
                for m in self.party.members:
                    m.potions += cons["potion"]
        self.log.append(option["label"])
        nxt = option["next"]
        if nxt == "battle":
            self.next_phase()
        elif nxt == "skill":
            self.phase = "skill"
        else:
            self.scene_id = nxt
            self.log.append(self.current_scene()["text"])

    # ---------------- Battle ----------------
    def perform_battle_round(self, actions: List[str]):
        if self.phase != "battle" or not self.battle:
            return
        self.battle.perform_round(actions)
        self.log.extend(self.battle.log)
        self.battle.log.clear()
        if not self.battle.enemy.alive or not self.party.alive:
            self.log.append("Enemy defeated!" if self.battle.enemy.alive is False else "Retreat!")
            self.next_phase()

    # ---------------- Skill ----------------
    def perform_skill_check(self, hero_idx: int):
        if self.phase != "skill":
            return
        skill_check_event(self.party, rng=self.rng)
        self.next_phase() 
from __future__ import annotations

import random
from typing import Callable

from .enemy import Enemy
from .party import Party
from .types import DamageType


class PartyBattle:
    """Battle system for a party of heroes against a single enemy."""

    def __init__(
        self,
        party: Party,
        enemy: Enemy,
        rng: random.Random | None = None,
    ) -> None:
        self.party = party
        self.enemy = enemy
        self.rng = rng or random.Random()

    def hero_turn(self, hero, action: str) -> str:
        action = action.lower()[:1]
        if action in {"s", "a"}:
            dmg = hero.physical_attack()
            self.enemy.receive_damage(dmg, DamageType.PHYSICAL)
            return f"{hero.name} strikes for {dmg} physical damage!"
        elif action == "m":
            dmg = hero.magic_attack()
            self.enemy.receive_damage(dmg, DamageType.MAGIC)
            return f"{hero.name} casts a spell for {dmg} magic damage!"
        elif action == "h":
            try:
                healed = hero.heal()
                return f"{hero.name} drinks a potion and recovers {healed} HP!"
            except RuntimeError as err:
                return f"{hero.name}: {err}"
        elif action == "d":
            hero.defending = True
            return f"{hero.name} assumes a defensive stance!"
        else:
            return f"{hero.name} hesitates and loses their turn."

    def enemy_turn(self) -> str:
        if not self.enemy.alive:
            return "The enemy is defeated!"
        target = self.rng.choice(self.party.get_alive())
        dmg = self.enemy.attack()
        target.receive_damage(dmg)
        return f"The {self.enemy.name} hits {target.name} for {dmg} damage!"

    def play(self, action_callback: Callable[["PartyBattle", str], str]) -> bool:
        """Run the party battle.

        The callback is called for each hero's action with signature
        `callback(battle, hero_name) -> str` returning the chosen action code.
        """
        print(self.enemy.ascii_art)
        print(f"A menacing {self.enemy.name} emerges!")
        while self.party.alive and self.enemy.alive:
            print()
            print(self.party.full_status())
            print(self.enemy.full_status())

            # Initiative order: each hero roll + speed vs enemy roll + speed
            order = []
            enemy_init = self.rng.randint(1, 20) + self.enemy.speed
            for hero in self.party.get_alive():
                hero_init = self.rng.randint(1, 20) + hero.effective_speed
                order.append((hero_init, hero))
            # Add enemy as tuple with its initiative value and None placeholder
            order.append((enemy_init, None))
            order.sort(reverse=True, key=lambda x: x[0])

            for _, actor in order:
                if actor is None:
                    # Enemy acts
                    print(self.enemy_turn())
                    if not self.party.alive:
                        break
                else:
                    action = action_callback(self, actor.name)
                    print(self.hero_turn(actor, action))
                    if not self.enemy.alive:
                        break
        print("\nBattle Over!")
        if self.party.alive:
            print("The party is victorious!")
            xp_each = self.enemy.exp_reward // len(self.party.get_alive())
            for hero in self.party.get_alive():
                hero.gain_experience(xp_each)
            print(f"Each surviving hero gains {xp_each} XP!")
        else:
            print("The party has fallen...")
        return self.party.alive 
from __future__ import annotations

import random
from textwrap import indent

from .enemy import Enemy
from .player import Player


class Battle:
    """Handles a battle between a player and an enemy."""

    def __init__(self, player: Player, enemy: Enemy, rng: random.Random | None = None) -> None:
        self.player = player
        self.enemy = enemy
        self.rng = rng or random.Random()

    def player_turn(self, action: str) -> str:
        if action == "a":
            dmg = self.player.attack()
            self.enemy.receive_damage(dmg)
            return f"You strike the {self.enemy.name} for {dmg} damage!"
        elif action == "h":
            try:
                healed = self.player.heal()
                return f"You quaff a potion and regain {healed} HP!"
            except RuntimeError as err:
                return str(err)
        else:
            return "Invalid action. You hesitate and lose your turn!"

    def enemy_turn(self) -> str:
        if not self.enemy.alive:
            return f"The {self.enemy.name} is defeated!"
        dmg = self.enemy.attack()
        self.player.receive_damage(dmg)
        return f"The {self.enemy.name} strikes you for {dmg} damage!"

    def play(self, player_action_callback) -> bool:
        """Run the battle loop.

        player_action_callback should be a function that takes the current battle
        instance and returns the player's chosen action ('a' or 'h').
        """
        print(self.enemy.ascii_art)
        print(f"A wild {self.enemy.name} appears!")
        while self.player.alive and self.enemy.alive:
            print()
            print(self.player.full_status())
            print(self.enemy.full_status())
            action = player_action_callback(self)
            print(self.player_turn(action))
            if self.enemy.alive:
                print(self.enemy_turn())
        print("\nBattle Over!")
        if self.player.alive:
            print("You are victorious!")
            if not self.enemy.alive:
                xp = self.enemy.exp_reward  # type: ignore[arg-type]
                self.player.gain_experience(int(xp))
                print(f"You gain {xp} XP!")
        else:
            print("You have been defeated...")
        return self.player.alive 
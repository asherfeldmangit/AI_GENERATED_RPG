from __future__ import annotations

import random
from pathlib import Path

from .battle import Battle
from .enemy import Enemy
from .player import Player

ASCII_ARTS = {
    "Slime": r"""
      _
    _( )_
   (_   _)
     (_)  """,
    "Goblin": r"""
     ,      ,
    /(.-""-.)\
    |\  \/  /|
    | \ / =/ |
    \_/`"`\_/
    """,
    "Dragon": r"""
           / \  //\\
    |\___/|      \\//
    /O  O  \     //  \\
   /     /|\\_  //   ||
   \_^_\'/ \\__/    //
   //_^_/     /    /
 ( //) |      /    |
 (/ /)        (   /
  / /          \ (  
 """,
}


def build_enemies(rng: random.Random) -> list[Enemy]:
    return [
        Enemy("Slime", max_hp=30, attack_min=5, attack_max=10, ascii_art=ASCII_ARTS["Slime"], rng=rng),
        Enemy(
            "Goblin",
            max_hp=50,
            attack_min=8,
            attack_max=15,
            ascii_art=ASCII_ARTS["Goblin"],
            rng=rng,
        ),
        Enemy(
            "Dragon",
            max_hp=120,
            attack_min=15,
            attack_max=25,
            ascii_art=ASCII_ARTS["Dragon"],
            rng=rng,
        ),
    ]


def get_player_action(_: Battle) -> str:
    return input("[A]ttack or [H]eal? ").strip().lower()[:1]


def main() -> None:
    rng = random.Random()
    print("Welcome to ASCII Quest!")
    name = input("What is your name, hero? ").strip() or "Hero"
    player = Player(name, rng=rng)
    enemies = build_enemies(rng)

    for enemy in enemies:
        if not player.alive:
            break
        battle = Battle(player, enemy, rng=rng)
        battle.play(get_player_action)
        if player.alive:
            print(f"You take a moment to catch your breath before moving on...\n")
    print("Game Over!")


if __name__ == "__main__":
    main() 
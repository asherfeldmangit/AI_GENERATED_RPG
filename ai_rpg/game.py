from __future__ import annotations

import random
from pathlib import Path

from .battle import Battle
from .enemy import Enemy
from .player import Player
from .story import story_event, skill_check_event
from .types import DamageType
from .party import Party
from .party_battle import PartyBattle

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
        Enemy(
            "Slime",
            max_hp=30,
            attack_min=5,
            attack_max=10,
            ascii_art=ASCII_ARTS["Slime"],
            weak_to=DamageType.MAGIC,
            rng=rng,
        ),
        Enemy(
            "Goblin",
            max_hp=50,
            attack_min=8,
            attack_max=15,
            ascii_art=ASCII_ARTS["Goblin"],
            weak_to=DamageType.PHYSICAL,
            rng=rng,
        ),
        Enemy(
            "Dragon",
            max_hp=120,
            attack_min=15,
            attack_max=25,
            ascii_art=ASCII_ARTS["Dragon"],
            weak_to=DamageType.MAGIC,
            rng=rng,
        ),
        Enemy(
             "Ice Golem",
             max_hp=80,
             attack_min=10,
             attack_max=18,
             ascii_art="(Ice Golem ASCII)",
             weak_to=DamageType.FIRE,
             rng=rng,
         ),
        Enemy(
             "Necromancer",
             max_hp=70,
             attack_min=12,
             attack_max=20,
             ascii_art="(Necromancer ASCII)",
             weak_to=DamageType.PHYSICAL,
             rng=rng,
         ),
    ]


def get_player_action(_: Battle) -> str:
    return input("[S]trike, [M]agic, [D]efend, or [H]eal? ").strip().lower()[:1]


def build_party(rng: random.Random) -> Party:
    # Create three distinct heroes
    warrior = Player("Warrior", attack_min=12, attack_max=18, magic_min=4, magic_max=7,
                      strength=16, intelligence=8, dexterity=12, rng=rng)
    mage = Player("Mage", attack_min=4, attack_max=7, magic_min=12, magic_max=18,
                  strength=8, intelligence=16, dexterity=10, rng=rng)
    ranger = Player("Ranger", attack_min=8, attack_max=14, magic_min=6, magic_max=9,
                    strength=12, intelligence=10, dexterity=16, rng=rng)
    return Party([warrior, mage, ranger])


def main() -> None:
    rng = random.Random()
    print("Welcome to ASCII Quest!")
    name = input("What is your name, hero? ").strip() or "Hero"
    party = build_party(rng)
    # Rename first hero to player's chosen name
    party.members[0].name = name or party.members[0].name

    enemies = build_enemies(rng)

    retries_left = 3

    for enemy in enemies:
        if not party.alive:
            break

        while True:
            battle = PartyBattle(party, enemy, rng=rng)

            def party_action_callback(btl: PartyBattle, hero_name: str) -> str:
                return input(f"{hero_name}'s action [S/M/D/H]: ")

            survived = battle.play(party_action_callback)

            if survived:
                # proceed to next enemy
                break

            # defeated
            if retries_left > 0:
                retries_left -= 1
                print(f"\nA mysterious power restores the party! Retries remaining: {retries_left}\n")
                for hero in party.members:
                    hero.hp = hero.max_hp
                    if hero.potions == 0:
                        hero.potions = 1
                enemy.hp = enemy.max_hp
                continue
            else:
                print("You have exhausted all retries. Your quest ends here.")
                break

        if not party.alive:
            break

        if enemy is not enemies[-1]:
            # Present narrative choice before the next encounter (use first alive hero)
            lead_hero = next((h for h in party.members if h.alive), party.members[0])
            story_event(lead_hero, rng)
            skill_check_event(party, rng)
            print(f"The party regroups before continuing...\n")

    print("Game Over!")


if __name__ == "__main__":
    main() 
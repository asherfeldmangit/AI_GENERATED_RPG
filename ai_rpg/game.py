from __future__ import annotations

import random
from pathlib import Path

from .battle import Battle
from .enemy import Enemy
from .player import Player
from .story import story_event, skill_check_event
from .types import DamageType

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


# Party modules
from .party import Party
from .party_battle import PartyBattle

CLASS_TEMPLATES = {
    "warrior": dict(
        attack_min=12,
        attack_max=18,
        magic_min=4,
        magic_max=7,
        strength=16,
        intelligence=8,
        dexterity=12,
    ),
    "mage": dict(
        attack_min=4,
        attack_max=7,
        magic_min=12,
        magic_max=18,
        strength=8,
        intelligence=16,
        dexterity=10,
    ),
    "ranger": dict(
        attack_min=8,
        attack_max=14,
        magic_min=6,
        magic_max=9,
        strength=12,
        intelligence=10,
        dexterity=16,
    ),
}


def interactive_party_creation(rng: random.Random) -> Party:
    print("\n=== Party Creation ===")
    print("Available classes: Warrior, Mage, Ranger")
    try:
        count = int(input("How many party members? (1-3, default 3): ") or 3)
    except ValueError:
        count = 3
    count = max(1, min(count, 3))

    members: list[Player] = []
    for idx in range(count):
        name = input(f"Enter name for hero {idx+1}: ").strip() or f"Hero{idx+1}"
        cls = input("Choose class (Warrior/Mage/Ranger): ").strip().lower() or "warrior"
        if cls not in CLASS_TEMPLATES:
            print("Unknown class, defaulting to Warrior.")
            cls = "warrior"
        stats = CLASS_TEMPLATES[cls]
        members.append(Player(name, rng=rng, **stats))
    return Party(members)


def main() -> None:
    rng = random.Random()
    print("Welcome to ASCII Quest!")
    name = input("What is your name, hero? ").strip() or "Hero"
    # Interactive party setup
    party = interactive_party_creation(rng)

    print("\n=== Prologue ===")
    print(
        "After years of darkness, rumours speak of a dragon's curse spreading across the realm. "
        "Your newly formed party sets out from the village gate, hearts full of courage and packs "
        "full of supplies. The road ahead will test your mettle...\n"
    )

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
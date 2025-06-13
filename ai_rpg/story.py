from __future__ import annotations

import random
from typing import Callable

from .player import Player
from .party import Party


ChoiceCallback = Callable[[str], str]


def default_choice_callback(prompt: str) -> str:
    return input(prompt)


def story_event(
    player: Player,
    rng: random.Random | None = None,
    choice_callback: ChoiceCallback | None = None,
) -> None:
    """Present a story choice to the player and apply the outcome.

    Parameters
    ----------
    player
        Current player instance.
    rng
        Random number generator for deterministic testing.
    choice_callback
        A function that takes a prompt string and returns the player's choice.
        Defaults to built-in :pyfunc:`input`.
    """
    rng = rng or random.Random()
    choice_callback = choice_callback or default_choice_callback

    print("\n=== Fork in the road ===")
    print(
        "After the battle, you come upon a clearing with a crackling campfire "
        "and a dark forest path leading away."
    )
    print("What will you do?")
    print("[R]est by the fire (restore some HP)")
    print("[S]earch the forest (chance to find a potion)")
    print("[C]ontinue on the main path")

    choice = choice_callback("Choose (R/S/C): ").strip().lower()[:1]

    if choice == "r":
        heal_amt = min(30, player.max_hp - player.hp)
        player.hp += heal_amt
        print(f"You rest and regain {heal_amt} HP.")
    elif choice == "s":
        # 50% chance to find a potion
        if rng.random() < 0.5:
            player.potions += 1
            print("You scour the underbrush and discover a potion! +1 potion.")
        else:
            print("You search for a while but find nothing of value.")
    else:
        print("You decide not to dally and travel onward.")

    print(player.full_status())


def skill_check_event(party, rng=None, choose_hero_callback=None):
    if rng is None:
        import random as _random
        rng = _random.Random()
    if choose_hero_callback is None:
        choose_hero_callback = lambda prompt, heroes: input(prompt)
    scenarios = [
        {
            "desc": "A rickety rope bridge sways over a deep chasm.",
            "attr": "dexterity",
            "dc": 12,
            "success": "You cross safely.",
            "fail": "The bridge snaps! You scramble back, scraped and bruised.",
        },
        {
            "desc": "A heavy stone blocks your path.",
            "attr": "strength",
            "dc": 14,
            "success": "With a heroic heave, the stone is moved!",
            "fail": "It won't budge; your muscles ache afterward.",
        },
        {
            "desc": "Ancient runes glow on a sealed door.",
            "attr": "intelligence",
            "dc": 13,
            "success": "You decipher the glyphs and the door slides open.",
            "fail": "The puzzle eludes you, and the runes flare angrily, singeing you.",
        },
    ]
    scene = rng.choice(scenarios)
    print("\n=== Skill Challenge ===")
    print(scene["desc"])
    heroes = [h for h in party.members if h.alive]
    hero_names = ", ".join(h.name for h in heroes)
    prompt = f"Who will attempt the challenge? ({hero_names}): "
    chosen_name = choose_hero_callback(prompt, hero_names).strip()
    hero = next((h for h in heroes if h.name.lower() == chosen_name.lower()), heroes[0])

    roll = rng.randint(1, 20)
    attr_val = getattr(hero, scene["attr"])
    total = roll + attr_val // 2
    print(f"{hero.name} rolls {roll} + {attr_val // 2} = {total} (DC {scene['dc']})")

    if total >= scene["dc"]:
        print(scene["success"])
        # reward: small heal
        healed = min(15, hero.max_hp - hero.hp)
        hero.hp += healed
        print(f"{hero.name} feels invigorated and recovers {healed} HP!")
    else:
        print(scene["fail"])
        hero.receive_damage(10)
        print(f"{hero.name} takes 10 damage!") 
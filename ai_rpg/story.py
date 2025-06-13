from __future__ import annotations

import random
from typing import Callable

from .player import Player


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
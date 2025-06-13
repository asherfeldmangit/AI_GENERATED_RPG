import random

import pytest

from ai_rpg.player import Player


def test_attack_within_range() -> None:
    rng = random.Random(0)
    p = Player("Tester", attack_min=1, attack_max=3, rng=rng)
    damages = {p.physical_attack() for _ in range(100)}
    assert damages <= {3, 4, 5}


def test_receive_damage_and_alive() -> None:
    p = Player("Tester")
    p.receive_damage(50)
    assert p.hp == 50 and p.alive
    p.receive_damage(60)
    assert p.hp == 0 and not p.alive


def test_heal_consumes_potion_and_restores_hp() -> None:
    p = Player("Tester")
    p.receive_damage(30)
    healed = p.heal()
    assert healed == 20  # heal amount capped
    assert p.hp == 90
    assert p.potions == 2


def test_heal_without_potions_raises() -> None:
    p = Player("Tester", potions=0)
    with pytest.raises(RuntimeError):
        p.heal()


def test_gain_experience_and_level_up() -> None:
    p = Player("Tester", attack_min=1, attack_max=1)
    # Give enough XP to level twice
    p.gain_experience(250)  # 100 to reach level2, 125*? etc.
    assert p.level >= 2
    assert p.attack_min >= 3  # increased by 2 per level-up 
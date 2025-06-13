from ai_rpg.enemy import Enemy
from ai_rpg.player import Player
from ai_rpg.types import DamageType
from ai_rpg.battle import Battle
import random


def test_enemy_weakness_multiplier() -> None:
    rng = random.Random(0)
    enemy = Enemy("Weakling", max_hp=40, attack_min=0, attack_max=0, weak_to=DamageType.MAGIC, rng=rng)
    player = Player("Mage", magic_min=10, magic_max=10, attack_min=1, attack_max=1, rng=rng)
    battle = Battle(player, enemy, rng=rng)
    msg = battle.player_turn("m")
    # magic attack does 10*1.5 = 15 damage
    assert enemy.hp == 25
    assert "magic" in msg


def test_player_defend_reduces_damage() -> None:
    rng = random.Random(1)
    player = Player("Tank", rng=rng)
    enemy = Enemy("Puncher", max_hp=10, attack_min=10, attack_max=10, rng=rng)
    battle = Battle(player, enemy, rng=rng)

    # player defends
    battle.player_turn("d")
    # enemy hits
    battle.enemy_turn()
    # damage should be 5
    assert player.hp == 95 
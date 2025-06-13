import random

from ai_rpg.battle import Battle
from ai_rpg.enemy import Enemy
from ai_rpg.player import Player


def test_player_attack_reduces_enemy_hp() -> None:
    rng = random.Random(1)
    player = Player("Tester", attack_min=10, attack_max=10, rng=rng)
    enemy = Enemy("Dummy", max_hp=30, attack_min=0, attack_max=0, rng=rng)
    battle = Battle(player, enemy, rng=rng)
    message = battle.player_turn("s")
    assert "10 physical" in message
    assert enemy.hp == 20


def test_player_heal_increases_hp() -> None:
    rng = random.Random(2)
    player = Player("Tester", rng=rng)
    player.receive_damage(50)
    enemy = Enemy("Dummy", max_hp=1, attack_min=0, attack_max=0, rng=rng)
    battle = Battle(player, enemy, rng=rng)
    msg = battle.player_turn("h")
    assert "regain" in msg
    assert player.hp == 70


def test_enemy_attack_reduces_player_hp() -> None:
    rng = random.Random(3)
    player = Player("Tester", rng=rng)
    enemy = Enemy("Dummy", max_hp=1, attack_min=5, attack_max=5, rng=rng)
    battle = Battle(player, enemy, rng=rng)
    msg = battle.enemy_turn()
    assert "5 damage" in msg
    assert player.hp == 95 
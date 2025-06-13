import random

from ai_rpg.player import Player
from ai_rpg.story import story_event


def test_story_event_rest_heals_player(monkeypatch):
    rng = random.Random(0)
    p = Player("Tester", rng=rng)
    p.receive_damage(40)  # HP 60/100

    # patch choice callback to always choose 'r'
    choice_cb = lambda prompt: "r"

    story_event(p, rng=rng, choice_callback=choice_cb)
    assert p.hp == 90  # healed 30 HP


def test_story_event_search_finds_potion(monkeypatch):
    rng = random.Random(1)  # rng.random()=0.134 < 0.5, guarantee find potion
    p = Player("Tester", potions=0, rng=rng)

    choice_cb = lambda prompt: "s"

    story_event(p, rng=rng, choice_callback=choice_cb)
    assert p.potions == 1 
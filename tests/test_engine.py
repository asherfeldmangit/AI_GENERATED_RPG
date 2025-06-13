from ai_rpg.engine import GameEngine
from ai_rpg.player import Player
from ai_rpg.party import Party
from ai_rpg.data_enemies import ENEMIES


def test_story_heal_consequence() -> None:
    party = Party([Player("Tester", attack_min=1, attack_max=1, magic_min=1, magic_max=1)])
    party.members[0].hp = 80
    engine = GameEngine(party)
    # choose forest path (option 0) then spring heal (option 0)
    engine.choose_option(0)  # to forest
    engine.choose_option(0)  # heal 15
    assert party.members[0].hp == 95 
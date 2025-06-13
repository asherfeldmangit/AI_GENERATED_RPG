from __future__ import annotations

from typing import TypedDict, List

class Consequence(TypedDict, total=False):
    heal: int
    damage: int
    potion: int

class StoryOption(TypedDict):
    label: str
    next: str
    consequence: Consequence | None

class StoryScene(TypedDict):
    id: str
    text: str
    options: List[StoryOption]

STORY: List[StoryScene] = [
    {
        "id": "start",
        "text": "Your party leaves the village and arrives at a fork in the road.",
        "options": [
            {"label": "Take the forest path", "next": "forest", "consequence": None},
            {"label": "Take the mountain pass", "next": "mountain", "consequence": None},
        ],
    },
    {
        "id": "forest",
        "text": "The forest is calm but eerie. A healing spring glimmers nearby.",
        "options": [
            {"label": "Drink from the spring (heal)", "next": "battle1", "consequence": {"heal": 15}},
            {"label": "Ignore and move on", "next": "battle1", "consequence": None},
        ],
    },
    {
        "id": "mountain",
        "text": "Cold winds batter you. Loose rocks fall from above.",
        "options": [
            {"label": "Dodge (DEX check)", "next": "skill", "consequence": {"damage": 5}},
            {"label": "Shield up and push forward", "next": "battle1", "consequence": None},
        ],
    },
    {
        "id": "battle1",
        "text": "You encounter hostile creatures ahead!",
        "options": [
            {"label": "Prepare for battle", "next": "battle", "consequence": None},
        ],
    },
] 
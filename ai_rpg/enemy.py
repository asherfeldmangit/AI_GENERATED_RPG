from __future__ import annotations

import random
from dataclasses import dataclass, field


@dataclass
class Enemy:
    """Represents an enemy in the game."""

    name: str
    max_hp: int
    attack_min: int
    attack_max: int
    ascii_art: str = ""  # optional ASCII art string
    rng: random.Random = field(default_factory=random.Random, repr=False)

    hp: int = field(init=False)

    def __post_init__(self) -> None:
        self.hp = self.max_hp

    @property
    def alive(self) -> bool:
        return self.hp > 0

    def attack(self) -> int:
        return self.rng.randint(self.attack_min, self.attack_max)

    def receive_damage(self, amount: int) -> None:
        self.hp = max(self.hp - amount, 0)

    def full_status(self) -> str:
        return f"{self.name}: HP {self.hp}/{self.max_hp}" 
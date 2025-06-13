from __future__ import annotations

import random
from dataclasses import dataclass, field
from .types import DamageType


@dataclass
class Enemy:
    """Represents an enemy in the game."""

    name: str
    max_hp: int
    attack_min: int
    attack_max: int
    ascii_art: str = ""  # optional ASCII art string
    weak_to: DamageType | None = None
    speed: int = 10
    exp_reward: int | None = None  # XP given when defeated
    rng: random.Random = field(default_factory=random.Random, repr=False)

    hp: int = field(init=False)

    def __post_init__(self) -> None:
        self.hp = self.max_hp
        if self.exp_reward is None:
            # Basic formula: roughly proportional to enemy toughness
            self.exp_reward = self.max_hp // 2 + self.attack_max

    @property
    def alive(self) -> bool:
        return self.hp > 0

    def attack(self) -> int:
        return self.rng.randint(self.attack_min, self.attack_max)

    def receive_damage(self, amount: int, dmg_type: DamageType = DamageType.PHYSICAL) -> None:
        multiplier = 1.5 if self.weak_to is not None and dmg_type == self.weak_to else 1.0
        true_damage = int(amount * multiplier)
        self.hp = max(self.hp - true_damage, 0)

    def full_status(self) -> str:
        return f"{self.name}: HP {self.hp}/{self.max_hp}" 
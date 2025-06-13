from __future__ import annotations

import random
from dataclasses import dataclass, field


@dataclass
class Player:
    """Represents the player character."""

    name: str
    max_hp: int = 100
    attack_min: int = 10
    attack_max: int = 20
    potion_heal_amount: int = 20
    potions: int = 3
    rng: random.Random = field(default_factory=random.Random, repr=False)

    hp: int = field(init=False)

    def __post_init__(self) -> None:
        self.hp = self.max_hp

    @property
    def alive(self) -> bool:
        return self.hp > 0

    def attack(self) -> int:
        """Calculate player's attack damage."""
        damage = self.rng.randint(self.attack_min, self.attack_max)
        return damage

    def receive_damage(self, amount: int) -> None:
        self.hp = max(self.hp - amount, 0)

    def heal(self) -> int:
        if self.potions <= 0:
            raise RuntimeError("No potions left!")
        self.potions -= 1
        healed = min(self.potion_heal_amount, self.max_hp - self.hp)
        self.hp += healed
        return healed

    def full_status(self) -> str:
        return (
            f"{self.name}: HP {self.hp}/{self.max_hp} | "
            f"Potions: {self.potions}"
        ) 
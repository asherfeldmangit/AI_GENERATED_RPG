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
    level: int = 1
    experience: int = 0
    exp_to_next: int = 100
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
        base = self.rng.randint(self.attack_min, self.attack_max)
        return base + (self.level - 1)

    def receive_damage(self, amount: int) -> None:
        self.hp = max(self.hp - amount, 0)

    def heal(self) -> int:
        if self.potions <= 0:
            raise RuntimeError("No potions left!")
        self.potions -= 1
        healed = min(self.potion_heal_amount, self.max_hp - self.hp)
        self.hp += healed
        return healed

    def gain_experience(self, amount: int) -> list[int]:
        """Add XP and handle level-ups.

        Returns a list of levels gained (can be multiple if excess XP).
        """
        self.experience += amount
        leveled_up: list[int] = []
        while self.experience >= self.exp_to_next:
            self.experience -= self.exp_to_next
            self.level_up()
            leveled_up.append(self.level)
        return leveled_up

    def level_up(self) -> None:
        self.level += 1
        self.exp_to_next = int(self.exp_to_next * 1.25)
        self.max_hp += 10
        self.attack_min += 2
        self.attack_max += 2
        self.hp = self.max_hp
        print(f"*** {self.name} leveled up to {self.level}! Stats increased. ***")

    def full_status(self) -> str:
        return (
            f"{self.name} Lv{self.level} | HP {self.hp}/{self.max_hp} | "
            f"XP {self.experience}/{self.exp_to_next} | Potions: {self.potions}"
        ) 
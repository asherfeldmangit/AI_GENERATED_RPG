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
    speed: int = 10
    potion_heal_amount: int = 20
    potions: int = 3
    rng: random.Random = field(default_factory=random.Random, repr=False)

    magic_min: int = 8
    magic_max: int = 15

    defending: bool = field(default=False, init=False)

    hp: int = field(init=False)

    # Attributes
    strength: int = 10
    intelligence: int = 10
    dexterity: int = 10

    def __post_init__(self) -> None:
        self.hp = self.max_hp

    @property
    def alive(self) -> bool:
        return self.hp > 0

    def physical_attack(self) -> int:
        base = self.rng.randint(self.attack_min, self.attack_max)
        attr_bonus = self.strength // 4
        return base + attr_bonus + (self.level - 1)

    def magic_attack(self) -> int:
        base = self.rng.randint(self.magic_min, self.magic_max)
        attr_bonus = self.intelligence // 4
        return base + attr_bonus + (self.level - 1)

    def receive_damage(self, amount: int) -> None:
        if self.defending:
            amount = int(amount * 0.5)
            self.defending = False  # reset after damage mitigation
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
        # Attribute gains
        self.strength += 1
        self.intelligence += 1
        self.dexterity += 1
        print(f"*** {self.name} leveled up to {self.level}! Stats increased. ***")

    def full_status(self) -> str:
        return (
            f"{self.name} Lv{self.level} | HP {self.hp}/{self.max_hp} | "
            f"STR {self.strength} INT {self.intelligence} DEX {self.dexterity} | "
            f"XP {self.experience}/{self.exp_to_next} | Potions: {self.potions}"
        )

    @property
    def effective_speed(self) -> int:
        return self.speed + self.dexterity // 4 
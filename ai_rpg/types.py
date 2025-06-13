from __future__ import annotations

from enum import Enum, auto


class DamageType(str, Enum):
    """Enumeration of elemental/attack damage types."""

    PHYSICAL = "physical"
    MAGIC = "magic"
    FIRE = "fire"
    ICE = "ice"

    def __str__(self) -> str:  # pragma: no cover
        return self.value 
from __future__ import annotations

from typing import Iterable, List

from .player import Player


class Party:
    """Represents the group of heroes controlled by the player."""

    def __init__(self, members: Iterable[Player]):
        self.members: List[Player] = list(members)

    @property
    def alive(self) -> bool:
        return any(m.alive for m in self.members)

    def get_alive(self) -> list[Player]:
        return [m for m in self.members if m.alive]

    def full_status(self) -> str:
        return " | ".join(m.full_status() for m in self.members) 
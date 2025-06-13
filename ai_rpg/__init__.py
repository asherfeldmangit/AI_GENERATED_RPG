from importlib.metadata import version

__all__ = [
    "Player",
    "Enemy",
    "Battle",
]

from .player import Player  # noqa: E402 F401
from .enemy import Enemy  # noqa: E402 F401
from .battle import Battle  # noqa: E402 F401

try:
    __version__ = version("ai_rpg")
except Exception:
    # Package not installed, fallback
    __version__ = "0.1.0" 
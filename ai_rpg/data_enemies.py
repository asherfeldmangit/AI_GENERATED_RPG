from __future__ import annotations

from .enemy import Enemy
from .types import DamageType

ENEMIES: list[Enemy] = [
    Enemy("Slime", max_hp=30, attack_min=3, attack_max=6, weak_to=DamageType.MAGIC),
    Enemy("Goblin", max_hp=45, attack_min=6, attack_max=10, weak_to=DamageType.PHYSICAL),
    Enemy("Wolf", max_hp=40, attack_min=5, attack_max=9, weak_to=DamageType.PHYSICAL),
    Enemy("Bandit", max_hp=50, attack_min=7, attack_max=11, weak_to=DamageType.MAGIC),
    Enemy("Skeleton", max_hp=35, attack_min=4, attack_max=8, weak_to=DamageType.PHYSICAL),
    Enemy("Orc", max_hp=60, attack_min=9, attack_max=14, weak_to=DamageType.MAGIC),
    Enemy("Harpy", max_hp=55, attack_min=8, attack_max=13, weak_to=DamageType.PHYSICAL),
    Enemy("Troll", max_hp=90, attack_min=10, attack_max=16, weak_to=DamageType.FIRE),
    Enemy("Ice Golem", max_hp=80, attack_min=10, attack_max=15, weak_to=DamageType.FIRE),
    Enemy("Fire Elemental", max_hp=70, attack_min=11, attack_max=17, weak_to=DamageType.ICE),
    Enemy("Necromancer", max_hp=70, attack_min=12, attack_max=18, weak_to=DamageType.PHYSICAL),
    Enemy("Shadow", max_hp=50, attack_min=9, attack_max=14, weak_to=DamageType.MAGIC),
    Enemy("Giant Spider", max_hp=65, attack_min=8, attack_max=12, weak_to=DamageType.FIRE),
    Enemy("Sand Worm", max_hp=85, attack_min=9, attack_max=15, weak_to=DamageType.ICE),
    Enemy("Dark Knight", max_hp=100, attack_min=12, attack_max=18, weak_to=DamageType.MAGIC),
    Enemy("Wyvern", max_hp=95, attack_min=11, attack_max=17, weak_to=DamageType.ICE),
    Enemy("Stone Guardian", max_hp=110, attack_min=10, attack_max=16, weak_to=DamageType.MAGIC),
    Enemy("Vampire", max_hp=75, attack_min=10, attack_max=15, weak_to=DamageType.FIRE),
    Enemy("Lich", max_hp=105, attack_min=13, attack_max=19, weak_to=DamageType.PHYSICAL),
    Enemy("Dragon", max_hp=120, attack_min=12, attack_max=20, weak_to=DamageType.MAGIC),
] 
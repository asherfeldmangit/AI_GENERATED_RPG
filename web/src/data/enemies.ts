import { Enemy } from '../logic/enemy';
import { DamageType } from '../logic/types';

export const ENEMIES: Enemy[] = [
  new Enemy({ name: 'Slime', maxHp: 30, attackMin: 3, attackMax: 6, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Goblin', maxHp: 45, attackMin: 6, attackMax: 10, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Wolf', maxHp: 40, attackMin: 5, attackMax: 9, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Bandit', maxHp: 50, attackMin: 7, attackMax: 11, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Skeleton', maxHp: 35, attackMin: 4, attackMax: 8, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Orc', maxHp: 60, attackMin: 9, attackMax: 14, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Harpy', maxHp: 55, attackMin: 8, attackMax: 13, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Troll', maxHp: 90, attackMin: 10, attackMax: 16, weakTo: DamageType.FIRE }),
  new Enemy({ name: 'Ice Golem', maxHp: 80, attackMin: 10, attackMax: 15, weakTo: DamageType.FIRE }),
  new Enemy({ name: 'Fire Elemental', maxHp: 70, attackMin: 11, attackMax: 17, weakTo: DamageType.ICE }),
  new Enemy({ name: 'Necromancer', maxHp: 70, attackMin: 12, attackMax: 18, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Shadow', maxHp: 50, attackMin: 9, attackMax: 14, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Giant Spider', maxHp: 65, attackMin: 8, attackMax: 12, weakTo: DamageType.FIRE }),
  new Enemy({ name: 'Sand Worm', maxHp: 85, attackMin: 9, attackMax: 15, weakTo: DamageType.ICE }),
  new Enemy({ name: 'Dark Knight', maxHp: 100, attackMin: 12, attackMax: 18, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Wyvern', maxHp: 95, attackMin: 11, attackMax: 17, weakTo: DamageType.ICE }),
  new Enemy({ name: 'Stone Guardian', maxHp: 110, attackMin: 10, attackMax: 16, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Vampire', maxHp: 75, attackMin: 10, attackMax: 15, weakTo: DamageType.FIRE }),
  new Enemy({ name: 'Lich', maxHp: 105, attackMin: 13, attackMax: 19, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Dragon', maxHp: 120, attackMin: 12, attackMax: 20, weakTo: DamageType.MAGIC }),
]; 
import { Monster } from '../logic/monster';
import { DamageType } from '../logic/types';

export const MONSTERS: Monster[] = [
  new Monster({ name: 'Slime', maxHp: 30, attackMin: 3, attackMax: 6, element: DamageType.MAGIC, catchRate: 75, expYield: 8, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Goblin', maxHp: 45, attackMin: 6, attackMax: 10, element: DamageType.PHYSICAL, catchRate: 60, expYield: 12, weakTo: DamageType.PHYSICAL }),
  new Monster({ name: 'Wolf', maxHp: 40, attackMin: 5, attackMax: 9, element: DamageType.PHYSICAL, catchRate: 55, expYield: 11, weakTo: DamageType.PHYSICAL }),
  new Monster({ name: 'Bandit', maxHp: 50, attackMin: 7, attackMax: 11, element: DamageType.PHYSICAL, catchRate: 50, expYield: 15, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Skeleton', maxHp: 35, attackMin: 4, attackMax: 8, element: DamageType.PHYSICAL, catchRate: 65, expYield: 10, weakTo: DamageType.PHYSICAL }),
  new Monster({ name: 'Orc', maxHp: 60, attackMin: 9, attackMax: 14, element: DamageType.PHYSICAL, catchRate: 45, expYield: 20, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Harpy', maxHp: 55, attackMin: 8, attackMax: 13, element: DamageType.MAGIC, catchRate: 40, expYield: 18, weakTo: DamageType.PHYSICAL }),
  new Monster({ name: 'Troll', maxHp: 90, attackMin: 10, attackMax: 16, element: DamageType.PHYSICAL, catchRate: 30, expYield: 28, weakTo: DamageType.FIRE }),
  new Monster({ name: 'Ice Golem', maxHp: 80, attackMin: 10, attackMax: 15, element: DamageType.ICE, catchRate: 25, expYield: 26, weakTo: DamageType.FIRE }),
  new Monster({ name: 'Fire Elemental', maxHp: 70, attackMin: 11, attackMax: 17, element: DamageType.FIRE, catchRate: 25, expYield: 26, weakTo: DamageType.ICE }),
  new Monster({ name: 'Necromancer', maxHp: 70, attackMin: 12, attackMax: 18, element: DamageType.MAGIC, catchRate: 20, expYield: 30, weakTo: DamageType.PHYSICAL }),
  new Monster({ name: 'Shadow', maxHp: 50, attackMin: 9, attackMax: 14, element: DamageType.MAGIC, catchRate: 35, expYield: 17, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Giant Spider', maxHp: 65, attackMin: 8, attackMax: 12, element: DamageType.PHYSICAL, catchRate: 40, expYield: 18, weakTo: DamageType.FIRE }),
  new Monster({ name: 'Sand Worm', maxHp: 85, attackMin: 9, attackMax: 15, element: DamageType.PHYSICAL, catchRate: 30, expYield: 24, weakTo: DamageType.ICE }),
  new Monster({ name: 'Dark Knight', maxHp: 100, attackMin: 12, attackMax: 18, element: DamageType.PHYSICAL, catchRate: 15, expYield: 40, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Wyvern', maxHp: 95, attackMin: 11, attackMax: 17, element: DamageType.ICE, catchRate: 20, expYield: 38, weakTo: DamageType.ICE }),
  new Monster({ name: 'Stone Guardian', maxHp: 110, attackMin: 10, attackMax: 16, element: DamageType.PHYSICAL, catchRate: 10, expYield: 42, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Vampire', maxHp: 75, attackMin: 10, attackMax: 15, element: DamageType.MAGIC, catchRate: 25, expYield: 30, weakTo: DamageType.FIRE }),
  new Monster({ name: 'Lich', maxHp: 105, attackMin: 13, attackMax: 19, element: DamageType.MAGIC, catchRate: 8, expYield: 45, weakTo: DamageType.PHYSICAL }),
  new Monster({ name: 'Dragon', maxHp: 120, attackMin: 12, attackMax: 20, element: DamageType.FIRE, catchRate: 5, expYield: 60, weakTo: DamageType.MAGIC }),
  new Monster({ name: 'Sentinel', maxHp: 120, attackMin: 8, attackMax: 12, element: DamageType.FIRE, catchRate: 0, expYield: 25, weakTo: DamageType.ICE }), // boss sentinel
];

// Temporary backward-compat export until the rest of the code migrates
export { MONSTERS as ENEMIES }; 
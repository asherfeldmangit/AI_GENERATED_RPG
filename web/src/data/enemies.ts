import { Enemy } from '../logic/enemy';
import { DamageType } from '../logic/types';

export const ENEMIES: Enemy[] = [
  new Enemy({ name: 'Slime', maxHp: 30, attackMin: 3, attackMax: 6, weakTo: DamageType.MAGIC }),
  new Enemy({ name: 'Goblin', maxHp: 45, attackMin: 6, attackMax: 10, weakTo: DamageType.PHYSICAL }),
  new Enemy({ name: 'Dragon', maxHp: 120, attackMin: 12, attackMax: 20, weakTo: DamageType.MAGIC }),
]; 
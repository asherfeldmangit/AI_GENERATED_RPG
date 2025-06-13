import { Enemy } from './enemy';
import { DamageType } from './types';

export interface MonsterInit {
  name: string;
  maxHp: number;
  attackMin: number;
  attackMax: number;
  element: DamageType;
  catchRate: number; // 0-100 probability basis for now
  expYield: number;
  weakTo?: DamageType;
}

/**
 * Monster extends Enemy, adding JRPG-style metadata used for capture & XP.
 */
export class Monster extends Enemy {
  element: DamageType;
  catchRate: number;
  expYield: number;

  constructor(init: MonsterInit) {
    super(init);
    this.element = init.element;
    this.catchRate = init.catchRate;
    this.expYield = init.expYield;
  }
} 
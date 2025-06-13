import { DamageType } from './types';

export class Enemy {
  name: string;
  maxHp: number;
  hp: number;
  attackMin: number;
  attackMax: number;
  weakTo?: DamageType;

  constructor(init: ConstructorParameters<typeof Enemy>[0]) {
    Object.assign(this, init);
    this.hp = this.maxHp;
  }

  get alive() {
    return this.hp > 0;
  }

  attack() {
    return randomInt(this.attackMin, this.attackMax);
  }

  receiveDamage(amount: number, type: DamageType) {
    const mult = this.weakTo === type ? 1.5 : 1;
    this.hp = Math.max(this.hp - Math.floor(amount * mult), 0);
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
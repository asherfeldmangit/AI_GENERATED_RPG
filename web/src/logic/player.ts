import { DamageType } from './types';

export class Player {
  name: string;
  maxHp: number = 100;
  hp: number;
  attackMin: number;
  attackMax: number;
  magicMin: number;
  magicMax: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  potions = 3;

  constructor(init: Partial<Player> & { name: string }) {
    Object.assign(this, init);
    this.hp = this.maxHp;
  }

  get alive() {
    return this.hp > 0;
  }

  physicalAttack() {
    const base = randomInt(this.attackMin, this.attackMax);
    return base + Math.floor(this.strength / 4);
  }

  magicAttack() {
    const base = randomInt(this.magicMin, this.magicMax);
    return base + Math.floor(this.intelligence / 4);
  }

  heal() {
    if (this.potions <= 0) throw new Error('No potions');
    this.potions -= 1;
    const heal = Math.min(20, this.maxHp - this.hp);
    this.hp += heal;
    return heal;
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
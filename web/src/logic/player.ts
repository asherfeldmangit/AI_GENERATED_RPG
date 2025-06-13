import { DamageType } from './types';
import { Weapon, Armour } from './equipment';
import { BattleActor } from './battleActor';

export class Player extends BattleActor {
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

  weapon?: Weapon;
  armour?: Armour;

  constructor(init: Partial<Player> & { name: string }) {
    super();
    Object.assign(this, init);
    this.hp = this.maxHp;
  }

  get alive() {
    return this.hp > 0;
  }

  physicalAttack() {
    const base = randomInt(this.attackMin, this.attackMax);
    const weaponBonus = this.weapon ? randomInt(this.weapon.minAttack, this.weapon.maxAttack) : 0;
    return base + weaponBonus + Math.floor(this.totalStrength() / 4);
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

  totalStrength() {
    return this.strength + (this.weapon?.strBonus ?? 0);
  }

  defense() {
    return this.armour?.defBonus ?? 0;
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
import { Player } from './player';

export class Party {
  members: Player[];
  constructor(members: Player[]) {
    this.members = members;
    this.risk = 0;
    // equip defaults for demo
    this.members.forEach((m) => {
      if (!m.weapon)
        m.weapon = { slot: 'weapon', name: 'Rusty Sword', minAttack: 2, maxAttack: 4, strBonus: 1 };
      if (!m.armour)
        m.armour = { slot: 'armour', name: 'Cloth', defBonus: 1 };
    });
  }
  get alive() {
    return this.members.some((m) => m.alive);
  }

  risk: number; // 0-100

  addRisk(amount: number) {
    this.risk = Math.min(100, this.risk + amount);
  }

  reduceRisk(amount: number) {
    this.risk = Math.max(0, this.risk - amount);
  }
} 
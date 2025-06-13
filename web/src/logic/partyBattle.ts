import { Party } from './party';
import { Enemy } from './enemy';
import { DamageType } from './types';
import { randomInt } from './util';

export type HeroAction = 'strike' | 'magic' | 'defend' | 'heal';

export interface BattleLogEntry {
  text: string;
}

export class PartyBattle {
  party: Party;
  enemy: Enemy;
  log: BattleLogEntry[] = [];

  constructor(party: Party, enemy: Enemy) {
    this.party = party;
    this.enemy = enemy;
  }

  private heroTurn(heroIdx: number, action: HeroAction) {
    const hero = this.party.members[heroIdx];
    if (!hero.alive) return;
    switch (action) {
      case 'strike': {
        const dmg = hero.physicalAttack();
        this.enemy.receiveDamage(dmg, DamageType.PHYSICAL);
        this.log.push({ text: `${hero.name} strikes for ${dmg} dmg` });
        break;
      }
      case 'magic': {
        const dmg = hero.magicAttack();
        this.enemy.receiveDamage(dmg, DamageType.MAGIC);
        this.log.push({ text: `${hero.name} casts for ${dmg} dmg` });
        break;
      }
      case 'heal': {
        try {
          const healed = hero.heal();
          this.log.push({ text: `${hero.name} heals ${healed}` });
        } catch (e) {
          this.log.push({ text: `${hero.name} cannot heal` });
        }
        break;
      }
      case 'defend': {
        // defence flag not implemented – placeholder
        this.log.push({ text: `${hero.name} defends` });
        break;
      }
    }
  }

  private enemyTurn() {
    if (!this.enemy.alive) return;
    const target = this.party.members.filter((m) => m.alive)[
      randomInt(0, this.party.members.filter((m) => m.alive).length - 1)
    ];
    const dmg = this.enemy.attack();
    target.hp = Math.max(target.hp - dmg, 0);
    this.log.push({ text: `${this.enemy.name} hits ${target.name} for ${dmg}` });
  }

  performRound(actions: HeroAction[]) {
    // initiative simplified: heroes then enemy
    actions.forEach((act, idx) => this.heroTurn(idx, act));
    this.enemyTurn();
  }

  isBattleOver() {
    return !this.party.alive || !this.enemy.alive;
  }
} 
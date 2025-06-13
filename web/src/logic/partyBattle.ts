import { Party } from './party';
import { Enemy } from './enemy';
import { DamageType, EnergyType } from './types';
import { randomInt } from './util';
import { playStinger } from '../audio/stingers';

export type HeroAction = 'strike' | 'magic' | 'defend' | 'heal';

export interface BattleLogEntry {
  text: string;
}

export class PartyBattle {
  party: Party;
  enemies: Enemy[];
  log: BattleLogEntry[] = [];

  heroATB: number[];
  enemyATB: number[];

  private atbSpeed = 0.3; // static speed per tick (0-100) – slower to give players more decision time

  constructor(party: Party, enemies: Enemy[] | Enemy) {
    this.party = party;
    this.enemies = Array.isArray(enemies) ? enemies : [enemies];
    this.heroATB = party.members.map(() => 0);
    this.enemyATB = this.enemies.map(() => 0);
  }

  /** Call every frame with delta time (~1) to fill gauges. */
  tick() {
    this.heroATB = this.heroATB.map((v, idx) =>
      this.party.members[idx].alive ? Math.min(100, v + this.atbSpeed) : 0
    );
    this.enemyATB = this.enemyATB.map((v, idx) =>
      this.enemies[idx].alive ? Math.min(100, v + this.atbSpeed) : 0
    );

    this.enemyATB.forEach((gauge, idx) => {
      if (gauge >= 100) {
        this.enemyATB[idx] = 0;
        this.singleEnemyTurn(idx);
      }
    });
  }

  private heroTurn(heroIdx: number, action: HeroAction) {
    this.heroATB[heroIdx] = 0; // reset gauge after acting
    const hero = this.party.members[heroIdx];
    if (!hero.alive) return;
    switch (action) {
      case 'strike': {
        // Physical attack builds Aether resonance
        hero.addResonance(EnergyType.AETHER);
        const dmg = hero.physicalAttack();
        this.enemies[heroIdx].receiveDamage(dmg, DamageType.PHYSICAL);
        this.log.push({ text: `${hero.name} strikes for ${dmg} dmg` });
        this.party.addRisk(2);
        // If resonance hits 3, trigger combo buff (placeholder)
        if (hero.resonance[EnergyType.AETHER] >= 3) {
          hero.clearResonance();
          this.log.push({ text: `${hero.name} unleashes Aether Combo!` });
          playStinger('aether');
        }
        break;
      }
      case 'magic': {
        hero.addResonance(EnergyType.VOID);
        const dmg = hero.magicAttack();
        this.enemies[heroIdx].receiveDamage(dmg, DamageType.MAGIC);
        this.log.push({ text: `${hero.name} casts for ${dmg} dmg` });
        this.party.addRisk(4);
        if (hero.resonance[EnergyType.VOID] >= 3) {
          hero.clearResonance();
          this.log.push({ text: `${hero.name} releases Void Burst!` });
          playStinger('void');
        }
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

  private singleEnemyTurn(enemyIdx: number) {
    const foe = this.enemies[enemyIdx];
    if (!foe.alive) return;
    const aliveHeroes = this.party.members.filter((m) => m.alive);
    if (aliveHeroes.length === 0) return;
    const target = aliveHeroes[randomInt(0, aliveHeroes.length - 1)];
    const action = foe.chooseAction?.() ?? 'strike';
    let dmg = 0;
    if (action === 'strike') {
      dmg = foe.attack();
      target.hp = Math.max(target.hp - dmg, 0);
      this.log.push({ text: `${foe.name} strikes ${target.name} for ${dmg}` });
    } else if (action === 'magic') {
      dmg = foe.attack();
      target.hp = Math.max(target.hp - dmg, 0);
      this.log.push({ text: `${foe.name} casts magic on ${target.name} for ${dmg}` });
    }
    foe.addResonance(EnergyType.VOID);
  }

  performRound(actions: HeroAction[]) {
    // initiative simplified: heroes then enemy
    actions.forEach((act, idx) => this.heroTurn(idx, act));
    this.enemies.forEach((_, idx) => this.singleEnemyTurn(idx));
    // After round, ensure gauges reset
    this.heroATB = this.heroATB.map(() => 0);
    this.enemyATB = this.enemyATB.map(() => 0);

    // Natural risk decay per round
    this.party.reduceRisk(1);
  }

  isBattleOver() {
    return !this.party.alive || this.enemies.every((e) => !e.alive);
  }
} 
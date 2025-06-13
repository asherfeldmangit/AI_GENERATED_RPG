import { Enemy } from './enemy';
import { Party } from './party';
import { PartyBattle, HeroAction } from './partyBattle';
import { runSkillCheck } from './skillCheck';
import { DamageType } from './types';

export type Phase = 'story' | 'battle' | 'skill' | 'end';

export interface GameEvent {
  text: string;
}

export class GameEngine {
  party: Party;
  enemies: Enemy[];
  idx = 0;
  phase: Phase = 'story';
  battle?: PartyBattle;
  log: GameEvent[] = [];

  constructor(party: Party, enemies: Enemy[]) {
    this.party = party;
    this.enemies = enemies;
    this.log.push({ text: 'The adventure begins!' });
  }

  currentEnemy() {
    return this.enemies[this.idx];
  }

  nextPhase() {
    if (!this.party.alive) {
      this.phase = 'end';
      this.log.push({ text: 'The party has fallen.' });
      return;
    }
    if (this.idx >= this.enemies.length) {
      this.phase = 'end';
      this.log.push({ text: 'All enemies defeated! Victory!' });
      return;
    }
    switch (this.phase) {
      case 'story':
        // Start battle
        this.battle = new PartyBattle(this.party, this.currentEnemy());
        this.phase = 'battle';
        this.log.push({ text: `A wild ${this.currentEnemy().name} appears!` });
        break;
      case 'battle':
        this.phase = 'skill';
        break;
      case 'skill':
        this.idx += 1;
        this.phase = 'story';
        break;
    }
  }

  performBattleRound(actions: HeroAction[]) {
    if (this.phase !== 'battle' || !this.battle) return;
    this.battle.performRound(actions);
    this.log.push(...this.battle.log);
    this.battle.log = [];
    if (this.battle.isBattleOver()) {
      this.log.push({ text: this.battle.enemy.alive ? 'Retreat!' : 'Enemy defeated!' });
      this.nextPhase();
    }
  }

  performSkillCheck(heroIdx: number) {
    if (this.phase !== 'skill') return;
    const res = runSkillCheck(this.party, heroIdx);
    this.log.push({ text: res.text });
    this.nextPhase();
  }
} 
import { DamageType } from './types';
import { BattleActor } from './battleActor';

export type EnemyAction = 'strike' | 'magic';
export type AIType = 'BASIC' | 'PATTERN_CYCLE' | 'RANDOM_SKILL';

export class Enemy extends BattleActor {
  name: string;
  maxHp: number;
  hp: number;
  attackMin: number;
  attackMax: number;
  weakTo?: DamageType;
  ai: AIType = 'BASIC';
  pattern?: EnemyAction[];
  private patternIdx = 0;

  constructor(init: ConstructorParameters<typeof Enemy>[0]) {
    super();
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

  chooseAction(): EnemyAction {
    switch (this.ai) {
      case 'PATTERN_CYCLE':
        if (!this.pattern || this.pattern.length === 0) return 'strike';
        const act = this.pattern[this.patternIdx % this.pattern.length];
        this.patternIdx += 1;
        return act;
      case 'RANDOM_SKILL':
        return Math.random() < 0.5 ? 'strike' : 'magic';
      default:
        return 'strike';
    }
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 
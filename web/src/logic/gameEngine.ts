import { Enemy } from './enemy';
import { Party } from './party';
import { PartyBattle, HeroAction } from './partyBattle';
import { runSkillCheck } from './skillCheck';
import { STORY, StoryScene, StoryOption } from '../data/story';

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
  sceneId: string = 'start';

  constructor(party: Party, enemies: Enemy[]) {
    this.party = party;
    this.enemies = enemies;
    const scene = this.currentScene();
    if (scene) this.log.push({ text: scene.text });
  }

  currentEnemy() {
    return this.enemies[this.idx];
  }

  currentScene(): StoryScene | undefined {
    return STORY.find((s) => s.id === this.sceneId);
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

  chooseOption(optIdx: number) {
    if (this.phase !== 'story') return;
    const scene = this.currentScene();
    if (!scene) return;
    const option = scene.options[optIdx];
    if (!option) return;

    // apply consequence
    if (option.consequence) {
      if (option.consequence.heal) {
        this.party.members.forEach((m) => (m.hp = Math.min(m.maxHp, m.hp + option.consequence!.heal!)));
        this.log.push({ text: `The party heals ${option.consequence.heal}` });
      }
      if (option.consequence.damage) {
        this.party.members.forEach((m) => (m.hp = Math.max(0, m.hp - option.consequence!.damage!)));
        this.log.push({ text: `The party takes ${option.consequence.damage} damage` });
      }
      if (option.consequence.potion) {
        this.party.members.forEach((m) => (m.potions += option.consequence!.potion!));
        this.log.push({ text: `Each hero gains a potion` });
      }
    }

    if (option.next === 'battle') {
      this.nextPhase();
      return;
    }
    if (option.next === 'skill') {
      this.phase = 'skill';
      return;
    }

    // normal story scene
    this.sceneId = option.next;
    const nextScene = this.currentScene();
    if (nextScene) this.log.push({ text: nextScene.text });
  }
} 
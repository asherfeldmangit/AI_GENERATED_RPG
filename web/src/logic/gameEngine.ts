import { Monster } from './monster';
import { Party } from './party';
import { PartyBattle, HeroAction } from './partyBattle';
import { runSkillCheck } from './skillCheck';
import { STORY, StoryScene, StoryOption } from '../data/story';
import { randomFormation } from '../data/formations';
import { getScene } from '../data/sceneLoader';

export type Phase = 'story' | 'battle' | 'skill' | 'end';

export interface GameEvent {
  text: string;
}

export class GameEngine {
  party: Party;
  enemies: Monster[] = [];
  phase: Phase = 'story';
  battle?: PartyBattle;
  log: GameEvent[] = [];
  sceneId: string = 'start';
  private flags: Record<string, boolean> = {}; // story progression flags

  constructor(party: Party) {
    this.party = party;
    const scene = this.currentScene();
    if (scene) this.log.push({ text: scene.text });
  }

  startEncounter(zone: string) {
    this.enemies = randomFormation(zone);
    this.phase = 'battle';
    this.battle = new PartyBattle(this.party, this.enemies);
    this.log.push({ text: `Enemies appear!` });
  }

  currentEnemy() {
    return this.enemies.find((e) => e.alive) ?? this.enemies[0];
  }

  currentScene(): StoryScene | undefined {
    return getScene(this.sceneId) || STORY.find((s) => s.id === this.sceneId);
  }

  nextPhase() {
    if (!this.party.alive) {
      this.phase = 'end';
      this.log.push({ text: 'The party has fallen.' });
      return;
    }
    if (this.phase === 'battle' && this.battle && this.battle.isBattleOver()) {
      this.phase = 'story';
      this.log.push({ text: 'Enemies defeated!' });
      return;
    }
    switch (this.phase) {
      case 'story':
        break; // narrative handled elsewhere
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
      const anyAlive = this.enemies.some((e) => e.alive);
      this.log.push({ text: anyAlive ? 'Retreat!' : 'Enemies defeated!' });
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

    // respect required flags (if any)
    if (option.requiresFlags && !option.requiresFlags.every((f) => this.flags[f])) {
      this.log.push({ text: 'That option is not available right now.' });
      return;
    }

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

    if (option.next.startsWith('battle')) {
      const parts = option.next.split('_');
      const zone = parts[1] ?? 'windridge';
      this.startEncounter(zone);
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

    // set any story flags from this option
    if (option.setFlags) {
      option.setFlags.forEach((f) => { this.flags[f] = true; });
    }
  }

  tickBattle() {
    if (this.phase === 'battle' && this.battle) {
      this.battle.tick();
    }
  }
} 
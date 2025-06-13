import { describe, it, expect, beforeEach } from 'vitest';
import { randomFormation } from '../data/formations';
import { Player } from './player';
import { Party } from './party';
import { PartyBattle } from './partyBattle';
import { GameEngine } from './gameEngine';
import { Weapon, Armour } from './equipment';

describe('Formations', () => {
  it('returns monsters for given zone', () => {
    const mons = randomFormation('windridge');
    expect(mons.length).toBeGreaterThan(0);
  });
});

describe('Equipment bonuses', () => {
  const sword: Weapon = { slot: 'weapon', name: 'Test Sword', minAttack: 1, maxAttack: 1, strBonus: 5 };
  const vest: Armour = { slot: 'armour', name: 'Vest', defBonus: 4 };

  it('adds strength and defence', () => {
    const hero = new Player({ name: 'Test', strength: 10, intelligence: 5, dexterity: 5, attackMin: 1, attackMax: 2, magicMin:0, magicMax:0 });
    hero.weapon = sword;
    hero.armour = vest;
    expect(hero.totalStrength()).toBe(15);
    expect(hero.defense()).toBe(4);
  });
});

describe('PartyBattle ATB', () => {
  let battle: PartyBattle;
  beforeEach(() => {
    const hero = new Player({ name: 'Hero', strength: 10, intelligence: 5, dexterity:5, attackMin:1, attackMax:2, magicMin:0, magicMax:0 });
    const party = new Party([hero]);
    const enemies = randomFormation('windridge');
    battle = new PartyBattle(party, enemies.slice(0,1));
  });

  it('fills enemy gauge and auto attacks', () => {
    const preLog = battle.log.length;
    // tick 200 times to ensure gauge full
    for (let i = 0; i < 200; i++) battle.tick();
    expect(battle.log.length).toBeGreaterThan(preLog);
  });
});

describe('GameEngine encounter', () => {
  it('starts encounter and sets phase', () => {
    const hero = new Player({ name: 'Alice', strength: 10, intelligence: 5, dexterity:5, attackMin:1, attackMax:2, magicMin:0, magicMax:0 });
    const engine = new GameEngine(new Party([hero]));
    engine.startEncounter('windridge');
    expect(engine.phase).toBe('battle');
    expect(engine.enemies.length).toBeGreaterThan(0);
    expect(engine.battle).toBeDefined();
  });
}); 
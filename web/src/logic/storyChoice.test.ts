import { describe, it, expect } from 'vitest';
import { Player } from './player';
import { Party } from './party';
import { Enemy } from './enemy';
import { GameEngine } from './gameEngine';
import { ENEMIES } from '../data/enemies';


describe('Story choice consequences', () => {
  it('heal consequence restores hp', () => {
    const party = new Party([
      new Player({ name: 'Hero', attackMin: 1, attackMax: 1, magicMin: 1, magicMax: 1, strength: 10, intelligence: 10, dexterity: 10 })
    ]);
    party.members[0].hp = 50;
    const eng = new GameEngine(party, ENEMIES.slice(0,1));
    // choose forest path -> drink heal (index 0 then 0)
    eng.chooseOption(0); // forest
    eng.chooseOption(0); // heal path with consequence heal 15
    expect(party.members[0].hp).toBe(65);
  });

  it('battle_sentinel option triggers battle phase', () => {
    const party = new Party([
      new Player({ name: 'Hero', attackMin: 1, attackMax: 1, magicMin: 1, magicMax: 1, strength: 10, intelligence: 10, dexterity: 10 })
    ]);
    const eng = new GameEngine(party);
    eng.sceneId = 'chapter1_intro';
    // choose second option (index 1) => battle_sentinel
    eng.chooseOption(1);
    expect(eng.phase).toBe('battle');
    expect(eng.enemies[0].name).toBe('Sentinel');
  });
}); 
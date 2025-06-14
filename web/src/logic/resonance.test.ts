import { describe, it, expect } from 'vitest';
import { Player } from './player';
import { Enemy } from './enemy';
import { EnergyType } from './types';
import { Party } from './party';
import { PartyBattle } from './partyBattle';

describe('Resonance Stacks', () => {
  it('increments and clears on Player', () => {
    const hero = new Player({ name: 'Hero', strength: 10, intelligence: 5, dexterity: 5, attackMin:1, attackMax:2, magicMin:0, magicMax:0 });
    expect(hero.resonance[EnergyType.AETHER]).toBe(0);
    hero.addResonance(EnergyType.AETHER);
    expect(hero.resonance[EnergyType.AETHER]).toBe(1);
    hero.clearResonance();
    expect(hero.resonance[EnergyType.AETHER]).toBe(0);
  });

  it('increments on Enemy', () => {
    const foe = new Enemy({ name: 'Slime', maxHp: 10, attackMin:1, attackMax:2 });
    foe.addResonance(EnergyType.VOID, 2);
    expect(foe.resonance[EnergyType.VOID]).toBe(2);
  });

  it('increments via battle action', () => {
    const hero = new Player({ name: 'Hero', strength: 10, intelligence: 5, dexterity:5, attackMin:1, attackMax:2, magicMin:0, magicMax:0 });
    const party = new Party([hero]);
    const foe = new Enemy({ name: 'Imp', maxHp: 10, attackMin:1, attackMax:2 });
    const battle = new PartyBattle(party, [foe]);
    battle.performRound(['strike']);
    expect(hero.resonance[EnergyType.AETHER]).toBe(1);
  });
}); 
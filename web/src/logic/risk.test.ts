import { describe, it, expect } from 'vitest';
import { Player } from './player';
import { Party } from './party';
import { PartyBattle } from './partyBattle';
import { Enemy } from './enemy';

describe('Risk meter', () => {
  it('increments and decays', () => {
    const hero = new Player({ name: 'Hero', attackMin:1, attackMax:2, magicMin:0, magicMax:0, strength:10, intelligence:5, dexterity:5 });
    const party = new Party([hero]);
    const foe = new Enemy({ name:'Imp', maxHp:10, attackMin:1, attackMax:2 });
    const battle = new PartyBattle(party, [foe]);

    expect(party.risk).toBe(0);
    battle.performRound(['magic']); // +4 risk, -1 decay = 3
    expect(party.risk).toBe(3);
    battle.performRound(['strike']); // +2 -1 = +1 => 4
    expect(party.risk).toBe(4);
  });
}); 
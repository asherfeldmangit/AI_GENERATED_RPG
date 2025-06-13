import { describe, it, expect, vi } from 'vitest';
import { Player } from './player';
import { Party } from './party';
import { Enemy } from './enemy';
import { DamageType } from './types';
import { PartyBattle } from './partyBattle';

describe('PartyBattle', () => {
  it('player strike defeats enemy', () => {
    const party = new Party([
      new Player({ name: 'Hero', attackMin: 10, attackMax: 10, magicMin: 1, magicMax: 1, strength: 12, intelligence: 8, dexterity: 8 })
    ]);
    const enemy = new Enemy({ name: 'Slime', maxHp: 10, attackMin: 0, attackMax: 0, weakTo: DamageType.MAGIC });
    const battle = new PartyBattle(party, enemy);
    battle.performRound(['strike']);
    expect(enemy.alive).toBe(false);
  });
}); 
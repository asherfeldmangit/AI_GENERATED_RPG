import { describe, it, expect } from 'vitest';
import { Enemy, AIType } from './enemy';

describe('Enemy AI pattern cycle', () => {
  it('cycles through pattern', () => {
    const foe = new Enemy({ name:'Sentinel', maxHp:50, attackMin:1, attackMax:2, ai: 'PATTERN_CYCLE', pattern:['magic','strike'] });
    expect(foe.chooseAction()).toBe('magic');
    expect(foe.chooseAction()).toBe('strike');
    expect(foe.chooseAction()).toBe('magic');
  });
}); 
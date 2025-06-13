import { describe, it, expect, vi } from 'vitest';
import { audioManager } from './audioManager';

// Mock Howl globally before importing module – vitest injects vi.fn()
vi.mock('howler', () => {
  return {
    Howl: class {
      volume() {}
      play() {}
      stop() {}
      fade() { return { once() {} }; }
    },
  };
});

describe('audioManager transitions', () => {
  it('switches tracks by phase and risk', () => {
    audioManager.setPhase('story');
    expect(audioManager.getCurrent()).toBe('field');

    audioManager.setPhase('battle');
    expect(audioManager.getCurrent()).toBe('battle');

    audioManager.updateRisk(80);
    expect(audioManager.getCurrent()).toBe('battle_high');

    audioManager.updateRisk(10);
    expect(audioManager.getCurrent()).toBe('battle');
  });
}); 
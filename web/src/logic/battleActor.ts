import { EnergyType } from './types';

export abstract class BattleActor {
  /** Tracks Elemental Resonance stacks accumulated this battle. */
  resonance: Record<EnergyType, number> = {
    [EnergyType.AETHER]: 0,
    [EnergyType.VOID]: 0,
  };

  /** Add stacks of a given energy type (default 1). */
  addResonance(type: EnergyType, amount: number = 1) {
    this.resonance[type] += amount;
  }

  /** Clear all resonance stacks, typically after a combo triggers. */
  clearResonance() {
    this.resonance[EnergyType.AETHER] = 0;
    this.resonance[EnergyType.VOID] = 0;
  }
} 
import { Party } from './party';
import { randomInt } from './util';

export type Attribute = 'strength' | 'intelligence' | 'dexterity';

interface Scenario {
  desc: string;
  attr: Attribute;
  dc: number;
}

export interface SkillResult {
  text: string;
  success: boolean;
}

const SCENARIOS: Scenario[] = [
  {
    desc: 'A rickety rope bridge sways over a chasm',
    attr: 'dexterity',
    dc: 12,
  },
  {
    desc: 'A heavy boulder blocks the path',
    attr: 'strength',
    dc: 14,
  },
  {
    desc: 'Ancient runes glow on a sealed door',
    attr: 'intelligence',
    dc: 13,
  },
];

export function runSkillCheck(party: Party, heroIdx: number): SkillResult {
  const scene = SCENARIOS[randomInt(0, SCENARIOS.length - 1)];
  const hero = party.members[heroIdx];
  const roll = randomInt(1, 20);
  const attrBonus = Math.floor((hero as any)[scene.attr] / 2);
  const total = roll + attrBonus;
  const success = total >= scene.dc;
  let text = `${hero.name} attempts: ${scene.desc}. Rolled ${roll}+${attrBonus}=${total} (DC ${scene.dc}) `;
  text += success ? 'SUCCESS!' : 'FAIL.';
  return { text, success };
} 
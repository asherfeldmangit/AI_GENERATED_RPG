import { Monster, MonsterInit } from '../logic/monster';
import { MONSTERS } from './monsters';

export type FormationTemplate = string[]; // array of monster names

function spawnMonsters(names: string[]): Monster[] {
  return names.map((n) => {
    const template = MONSTERS.find((m) => m.name === n);
    if (!template) throw new Error(`Monster ${n} not found`);
    // clone new instance
    return new Monster({ ...template });
  });
}

export const FORMATIONS_BY_ZONE: Record<string, FormationTemplate[]> = {
  windridge: [
    ['Slime', 'Slime', 'Slime'],
    ['Goblin', 'Goblin'],
    ['Wolf'],
  ],
  sentinel: [
    ['Sentinel']
  ],
};

export function randomFormation(zone: string): Monster[] {
  const pool = FORMATIONS_BY_ZONE[zone] ?? FORMATIONS_BY_ZONE['windridge'];
  const template = pool[Math.floor(Math.random() * pool.length)];
  return spawnMonsters(template);
} 
import { Weapon, Armour } from '../logic/equipment';

export const WEAPONS: Weapon[] = [
  { slot: 'weapon', name: 'Rusty Sword', minAttack: 2, maxAttack: 4, strBonus: 1 },
  { slot: 'weapon', name: 'Iron Sword', minAttack: 4, maxAttack: 6, strBonus: 3 },
];

export const ARMOURS: Armour[] = [
  { slot: 'armour', name: 'Cloth', defBonus: 1 },
  { slot: 'armour', name: 'Leather Vest', defBonus: 3 },
]; 
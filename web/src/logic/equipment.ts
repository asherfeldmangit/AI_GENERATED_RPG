export type EquipmentSlot = 'weapon' | 'armour';

export interface Equipment {
  slot: EquipmentSlot;
  name: string;
  strBonus?: number;
  defBonus?: number;
}

export interface Weapon extends Equipment {
  slot: 'weapon';
  minAttack: number;
  maxAttack: number;
}

export interface Armour extends Equipment {
  slot: 'armour';
} 
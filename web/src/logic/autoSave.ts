import { Player } from './player';
import { Party } from './party';

const KEY = 'ai_rpg_save_v1';

interface PlayerSave {
  name: string;
  hp: number;
  maxHp: number;
  attackMin: number;
  attackMax: number;
  magicMin: number;
  magicMax: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  potions: number;
}

interface SaveState {
  sceneId: string;
  risk: number;
  heroes: PlayerSave[];
}

export function saveGame(sceneId: string, party: Party) {
  const data: SaveState = {
    sceneId,
    risk: party.risk,
    heroes: party.members.map((m) => ({
      name: m.name,
      hp: m.hp,
      maxHp: m.maxHp,
      attackMin: m.attackMin,
      attackMax: m.attackMax,
      magicMin: m.magicMin,
      magicMax: m.magicMax,
      strength: m.strength,
      intelligence: m.intelligence,
      dexterity: m.dexterity,
      potions: m.potions,
    })),
  };
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadGame(): SaveState | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveState;
  } catch {
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(KEY);
}

export function partyFromSave(save: SaveState): Party {
  const heroes = save.heroes.map((h) => new Player({
    name: h.name,
    attackMin: h.attackMin,
    attackMax: h.attackMax,
    magicMin: h.magicMin,
    magicMax: h.magicMax,
    strength: h.strength,
    intelligence: h.intelligence,
    dexterity: h.dexterity,
  }));
  heroes.forEach((m, idx) => {
    m.maxHp = save.heroes[idx].maxHp;
    m.hp = save.heroes[idx].hp;
    m.potions = save.heroes[idx].potions;
  });
  const party = new Party(heroes);
  party.risk = save.risk;
  return party;
} 
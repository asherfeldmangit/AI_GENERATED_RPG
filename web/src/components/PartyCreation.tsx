import { useState } from 'react';
import { Party } from '../logic/party';
import { Player } from '../logic/player';

const CLASS_TEMPLATES: Record<string, Partial<Player>> = {
  warrior: {
    attackMin: 12,
    attackMax: 18,
    magicMin: 4,
    magicMax: 7,
    strength: 16,
    intelligence: 8,
    dexterity: 12,
  },
  mage: {
    attackMin: 4,
    attackMax: 7,
    magicMin: 12,
    magicMax: 18,
    strength: 8,
    intelligence: 16,
    dexterity: 10,
  },
  ranger: {
    attackMin: 8,
    attackMax: 14,
    magicMin: 6,
    magicMax: 9,
    strength: 12,
    intelligence: 10,
    dexterity: 16,
  },
};

export default function PartyCreation({ onCreated }: { onCreated: (p: Party) => void }) {
  const [count, setCount] = useState(3);
  const [members, setMembers] = useState<{ name: string; cls: string }[]>(
    new Array(3).fill(null).map(() => ({ name: '', cls: 'warrior' }))
  );

  const handleStart = () => {
    const partyMembers = members.slice(0, count).map((m, idx) => {
      const template = CLASS_TEMPLATES[m.cls] || CLASS_TEMPLATES.warrior;
      return new Player({ name: m.name || `Hero${idx + 1}`, ...template });
    });
    onCreated(new Party(partyMembers));
  };

  return (
    <div>
      <h2>Create Your Party</h2>
      <label>
        Party size (1-3):
        <input
          type="number"
          min={1}
          max={3}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <br />
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} style={{ marginTop: '1rem' }}>
          <input
            placeholder={`Hero ${idx + 1} name`}
            value={members[idx]?.name || ''}
            onChange={(e) => {
              const arr = [...members];
              arr[idx] = { ...arr[idx], name: e.target.value };
              setMembers(arr);
            }}
          />
          <select
            value={members[idx]?.cls || 'warrior'}
            onChange={(e) => {
              const arr = [...members];
              arr[idx] = { ...arr[idx], cls: e.target.value };
              setMembers(arr);
            }}
          >
            <option value="warrior">Warrior</option>
            <option value="mage">Mage</option>
            <option value="ranger">Ranger</option>
          </select>
        </div>
      ))}
      <br />
      <button onClick={handleStart}>Start Adventure</button>
    </div>
  );
} 
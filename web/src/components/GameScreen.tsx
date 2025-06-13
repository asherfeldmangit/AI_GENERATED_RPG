import { useState } from 'react';
import { Party } from '../logic/party';

export default function GameScreen({ party }: { party: Party }) {
  const [log, setLog] = useState<string[]>(["Your adventure begins..."]);

  return (
    <div>
      <h2>Party Status</h2>
      <ul>
        {party.members.map((m) => (
          <li key={m.name}>
            {m.name} HP {m.hp}/{m.maxHp} (STR {m.strength} INT {m.intelligence} DEX {m.dexterity})
          </li>
        ))}
      </ul>
      <h2>Adventure Log</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{log.join('\n')}</pre>
      <p>(Further interactive story and combat not yet implemented)</p>
    </div>
  );
} 
import { useState } from 'react';
import { Party } from '../logic/party';
import { GameEngine } from '../logic/gameEngine';
import { ENEMIES } from '../data/enemies';
import { HeroAction } from '../logic/partyBattle';

export default function GameScreen({ party }: { party: Party }) {
  const [engine] = useState(() => new GameEngine(party, ENEMIES));
  const [, forceRender] = useState(0);

  const appendAndRerender = () => {
    forceRender((n) => n + 1);
  };

  const doStrikeAll = () => {
    const acts: HeroAction[] = party.members.map(() => 'strike');
    engine.performBattleRound(acts);
    appendAndRerender();
  };

  const doMagicAll = () => {
    const acts: HeroAction[] = party.members.map(() => 'magic');
    engine.performBattleRound(acts);
    appendAndRerender();
  };

  const nextPhase = () => {
    if (engine.phase === 'story') {
      engine.nextPhase();
    } else if (engine.phase === 'skill') {
      // pick first alive hero for now
      const idx = party.members.findIndex((m) => m.alive);
      if (idx >= 0) engine.performSkillCheck(idx);
    }
    appendAndRerender();
  };

  const chooseOption = (idx: number) => {
    engine.chooseOption(idx);
    appendAndRerender();
  };

  return (
    <div>
      <h2>Party Status</h2>
      <ul>
        {party.members.map((m) => (
          <li key={m.name}>
            {m.name} HP {m.hp}/{m.maxHp}
          </li>
        ))}
      </ul>

      {engine.phase === 'battle' && (
        <div>
          <h3>Battle: {engine.currentEnemy().name} HP {engine.currentEnemy().hp}/{engine.currentEnemy().maxHp}</h3>
          <button onClick={doStrikeAll}>Strike All</button>
          <button onClick={doMagicAll}>Magic All</button>
        </div>
      )}

      {engine.phase === 'story' && engine.currentScene() && (
        <div>
          <h3>Story</h3>
          <p>{engine.currentScene()!.text}</p>
          {engine.currentScene()!.options.map((opt, i) => (
            <button key={i} onClick={() => chooseOption(i)} style={{ display: 'block', margin: '0.25rem 0' }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {engine.phase === 'skill' && (
        <button onClick={nextPhase}>Continue</button>
      )}

      {engine.phase === 'end' && <h2>Game Over</h2>}

      <h2>Log</h2>
      <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>
        {engine.log.map((l, i) => (
          <div key={i}>{l.text}</div>
        ))}
      </pre>
    </div>
  );
} 
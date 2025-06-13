import { useState } from 'react';
import { HeroAction } from '../logic/partyBattle';
import Tooltip from './Tooltip';

interface Props {
  onSelectAction: (action: HeroAction | 'run' | 'item' | 'spell') => void;
  moves: { label: string; action: HeroAction }[];
  spells: { label: string; mp: number }[];
  potions: number;
}

/**
 * Simple HTML overlay that mimics classic JRPG battle command menus.
 * Root level shows top commands (Fight / Item / Party / Run).
 * Clicking Fight drills down into a submenu containing hero moves.
 * Other commands immediately bubble up via onSelectAction (for now they
 * just forward a string – full functionality TBD).
 */
export default function BattleCommandMenu({ onSelectAction, moves, spells, potions }: Props) {
  const [layer, setLayer] = useState<'root' | 'fight' | 'magic' | 'item'>('root');

  if (layer === 'fight') {
    return (
      <div style={boxStyle}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Choose Move</h4>
        {moves.map((m) => (
          <button
            key={m.action}
            onClick={() => onSelectAction(m.action)}
            style={btnStyle}
          >
            {m.label}
          </button>
        ))}
        <button onClick={() => setLayer('root')} style={{ ...btnStyle, marginTop: '0.5rem' }}>
          &larr; Back
        </button>
      </div>
    );
  }

  if (layer === 'magic') {
    return (
      <div style={boxStyle}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Spells</h4>
        {spells.map((s) => (
          <Tooltip key={s.label} text={`${s.mp} MP`}>
            <button onClick={() => onSelectAction('spell')} style={btnStyle}>
              {s.label}
            </button>
          </Tooltip>
        ))}
        <button onClick={() => setLayer('root')} style={{ ...btnStyle, marginTop: '0.5rem' }}>
          &larr; Back
        </button>
      </div>
    );
  }

  if (layer === 'item') {
    return (
      <div style={boxStyle}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Items</h4>
        <Tooltip text="Heals 25 HP">
          <button
            disabled={potions <= 0}
            onClick={() => onSelectAction('item')}
            style={btnStyle}
          >
            Potion ×{potions}
          </button>
        </Tooltip>
        <button onClick={() => setLayer('root')} style={{ ...btnStyle, marginTop: '0.5rem' }}>
          &larr; Back
        </button>
      </div>
    );
  }

  return (
    <div style={boxStyle}>
      <button onClick={() => setLayer('fight')} style={btnStyle}>
        Fight
      </button>
      <button onClick={() => setLayer('magic')} style={btnStyle}>
        Magic
      </button>
      <button onClick={() => setLayer('item')} style={btnStyle}>
        Item
      </button>
      <button onClick={() => onSelectAction('run')} style={btnStyle}>
        Run
      </button>
    </div>
  );
}

const boxStyle: React.CSSProperties = {
  border: '2px solid white',
  padding: '0.5rem',
  display: 'inline-block',
  background: 'rgba(0,0,0,0.6)',
};

const btnStyle: React.CSSProperties = {
  display: 'block',
  margin: '0.25rem 0',
  width: '100%',
}; 
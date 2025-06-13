import { clearSave } from '../logic/autoSave';

interface Props {
  onResume: () => void;
}

export default function PauseMenu({ onResume }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      <h2>Paused</h2>
      <button onClick={onResume} style={btn}>Resume</button>
      <button onClick={() => { clearSave(); location.reload(); }} style={btn}>Quit to Title</button>
    </div>
  );
}

const btn: React.CSSProperties = { margin: '0.5rem', padding: '0.5rem 1rem' }; 
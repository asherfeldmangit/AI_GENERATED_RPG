import { useState } from 'react';
import PartyCreation from './components/PartyCreation';
import GameScreen from './components/GameScreen';
import { Party } from './logic/party';
import TitleScene from './scenes/TitleScene';
import OpeningCinematicScene from './scenes/OpeningCinematicScene';

export default function App() {
  const [party, setParty] = useState<Party | null>(null);
  const [mode, setMode] = useState<'title' | 'cinematic' | 'create' | 'game'>('title');

  return (
    <div>
      {mode === 'title' && <TitleScene onStart={() => setMode('cinematic')} />}

      {mode === 'cinematic' && (
        <OpeningCinematicScene onComplete={() => setMode('create')} />
      )}

      {mode === 'create' && !party && <PartyCreation onCreated={(p) => { setParty(p); setMode('game'); }} />}

      {mode === 'game' && party && <GameScreen party={party} />}
    </div>
  );
} 
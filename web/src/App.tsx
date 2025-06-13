import { useState, useEffect } from 'react';
import PartyCreation from './components/PartyCreation';
import GameScreen from './components/GameScreen';
import { Party } from './logic/party';
import TitleScene from './scenes/TitleScene';
import OpeningCinematicScene from './scenes/OpeningCinematicScene';
import { loadGame, partyFromSave } from './logic/autoSave';

export default function App() {
  const [party, setParty] = useState<Party | null>(null);
  const [mode, setMode] = useState<'title' | 'cinematic' | 'create' | 'game'>('title');
  const [initialScene, setInitialScene] = useState<string | undefined>(undefined);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setParty(partyFromSave(saved));
      setMode('game');
      setInitialScene(saved.sceneId);
    }
  }, []);

  return (
    <div>
      {mode === 'title' && <TitleScene onStart={() => setMode('cinematic')} />}

      {mode === 'cinematic' && (
        <OpeningCinematicScene onComplete={() => setMode('create')} />
      )}

      {mode === 'create' && !party && <PartyCreation onCreated={(p) => { setParty(p); setMode('game'); }} />}

      {mode === 'game' && party && <GameScreen party={party} initialSceneId={initialScene} />}
    </div>
  );
} 
import { useState } from 'react';
import PartyCreation from './components/PartyCreation';
import GameScreen from './components/GameScreen';
import { Party } from './logic/party';

export default function App() {
  const [party, setParty] = useState<Party | null>(null);

  return (
    <div>
      <h1>ASCII Quest</h1>
      {!party ? (
        <PartyCreation onCreated={setParty} />
      ) : (
        <GameScreen party={party} />
      )}
    </div>
  );
} 
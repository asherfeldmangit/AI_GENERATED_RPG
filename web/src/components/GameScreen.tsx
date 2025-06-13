import { useState, useEffect } from 'react';
import { Party } from '../logic/party';
import { GameEngine } from '../logic/gameEngine';
import { HeroAction } from '../logic/partyBattle';
import BattleScene from '../scenes/BattleScene';
import MapScene from '../scenes/MapScene';
import BattleCommandMenu from './BattleCommandMenu';
import { playVoice } from '../audio/voiceManager';
import { audioManager } from '../audio/audioManager';
import RiskOverlay from './RiskOverlay';
import { saveGame } from '../logic/autoSave';

export default function GameScreen({ party, initialSceneId }: { party: Party; initialSceneId?: string }) {
  const [engine] = useState(() => {
    const eng = new GameEngine(party);
    if (initialSceneId) eng.sceneId = initialSceneId;
    return eng;
  });
  const [, forceRender] = useState(0);
  const [actionSelections, setActionSelections] = useState<Record<number, HeroAction>>({});

  // frame loop for ATB updates
  useEffect(() => {
    let id: number;
    const step = () => {
      engine.tickBattle();
      forceRender((n) => n + 1);
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [engine]);

  useEffect(() => {
    const scene = engine.currentScene();
    if (scene?.voice) {
      playVoice(scene.voice);
    }
  }, [engine.sceneId]);

  // Update music when phase changes
  useEffect(() => {
    audioManager.setPhase(engine.phase);
  }, [engine.phase]);

  // Monitor risk to switch battle music intensity
  useEffect(() => {
    const id = setInterval(() => {
      audioManager.updateRisk(party.risk);
    }, 500);
    return () => clearInterval(id);
  }, [party]);

  // Auto-save whenever scene or party changes
  useEffect(() => {
    saveGame(engine.sceneId, party);
  }, [engine.sceneId, party]);

  const appendAndRerender = () => {
    forceRender((n) => n + 1);
  };

  const aliveHeroes = party.members.filter((m) => m.alive);
  const currentHeroIdx = party.members.findIndex(
    (m, idx) => m.alive && !(idx in actionSelections)
  );

  const handleHeroAction = (action: HeroAction) => {
    if (currentHeroIdx === -1) return;
    const newSelections = { ...actionSelections, [currentHeroIdx]: action };

    const allChosen = party.members.every(
      (m, idx) => !m.alive || idx in newSelections
    );

    if (allChosen) {
      const acts: HeroAction[] = party.members.map((m, idx) => newSelections[idx] ?? 'defend');
      setActionSelections({});
      engine.performBattleRound(acts);
      appendAndRerender();
    } else {
      setActionSelections(newSelections);
      appendAndRerender();
    }
  };

  const nextPhase = () => {
    if (engine.phase === 'story') {
      engine.nextPhase();
    } else if (engine.phase === 'skill') {
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
          <li key={m.name} style={{ opacity: m.alive ? 1 : 0.5 }}>
            {m.name} HP {m.hp}/{m.maxHp}  Str {m.totalStrength()} Def {m.defense()} {m.alive ? '' : '(KO)'}
          </li>
        ))}
      </ul>

      {engine.phase === 'battle' && (
        <div>
          <h3>
            Battle: {engine.currentEnemy().name} HP {engine.currentEnemy().hp}/
            {engine.currentEnemy().maxHp}
          </h3>

          {/* Visual battlefield */}
          <BattleScene
            party={party}
            enemy={engine.currentEnemy()}
            lastLog={engine.log.at(-1)?.text}
            battle={engine.battle}
          />

          {currentHeroIdx === -1 ? (
            <p>Resolving round…</p>
          ) : (
            <div>
              <p>{party.members[currentHeroIdx].name}&apos;s turn</p>
              <BattleCommandMenu
                moves={[
                  { label: 'Strike', action: 'strike' },
                  { label: 'Defend', action: 'defend' },
                ]}
                spells={[
                  { label: 'Fire', mp: 5 },
                  { label: 'Cure', mp: 4 },
                ]}
                potions={party.members[currentHeroIdx].potions}
                onSelectAction={(cmd) => {
                  switch (cmd) {
                    case 'run':
                      handleHeroAction('defend');
                      break;
                    case 'item':
                      handleHeroAction('heal');
                      break;
                    case 'spell':
                      handleHeroAction('magic');
                      break;
                    default:
                      handleHeroAction(cmd);
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

      {engine.phase === 'story' && (
        <MapScene
          onEncounter={(zone) => {
            if (engine.phase === 'story') {
              engine.startEncounter(zone);
              appendAndRerender();
            }
          }}
          onShrine={() => {
            party.reduceRisk(20);
            engine.log.push({ text: 'The party feels safer. Risk -20.' });
            appendAndRerender();
          }}
        />
      )}

      {engine.phase === 'story' && engine.currentScene() && (
        <div>
          <h3>Story</h3>
          <p>{engine.currentScene()!.text}</p>
          {engine.currentScene()!.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => chooseOption(i)}
              style={{ display: 'block', margin: '0.25rem 0' }}
            >
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
        {[...engine.log]
          .slice()
          .reverse()
          .map((l, i) => (
            <div
              key={i}
              style={i === 0 ? { fontWeight: 'bold' } : undefined}
            >
              {l.text}
            </div>
          ))}
      </pre>

      <RiskOverlay risk={party.risk} />
    </div>
  );
} 
import { Stage, Graphics, Container, Text } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { bgmBattle, sfxSlash, sfxMagic, sfxHeal, sfxHit } from '../audio';
import { Party } from '../logic/party';
import { Enemy } from '../logic/enemy';
import { PartyBattle } from '../logic/partyBattle';
import { EnergyType } from '../logic/types';

interface Props {
  party: Party;
  enemy: Enemy;
  lastLog?: string;
  battle?: PartyBattle;
}

/**
 * Very first draft of a Pixi battle scene.
 * Draws:
 *   • Blue circles for each living hero
 *   • Red circle for the enemy
 *   • Text labels under each token
 * Layout is simple: heroes at left, enemy at right.
 */
export default function BattleScene({ party, enemy, lastLog, battle }: Props) {
  const width = 900;
  const height = 400;

  const heroRadius = 32;
  const enemyRadius = 52;

  const liveEnemies = battle ? battle.enemies : [enemy];

  // Refs to token containers for anims
  const heroRefs = useRef<Record<string, PIXI.Container>>({});
  const enemyRefs = useRef<Record<string, PIXI.Container>>({});

  // Start / stop BGM
  useEffect(() => {
    if (!bgmBattle.playing()) bgmBattle.play();
    return () => {
      bgmBattle.stop();
    };
  }, []);

  // Parse last log for animation + sfx
  useEffect(() => {
    if (!lastLog) return;

    // Hero attack log example: "Alice strikes for 12 dmg" or "Bob casts for"
    const hero = party.members.find((m) => lastLog.startsWith(m.name));
    if (hero) {
      // play slash or magic depending on word
      if (lastLog.includes('casts')) sfxMagic.play();
      else if (lastLog.includes('heals')) sfxHeal.play();
      else sfxSlash.play();

      // enemy hit anim
      const foe = liveEnemies[0];
      const ref = enemyRefs.current[foe.name];
      if (ref) {
        gsap.fromTo(
          ref.scale,
          { x: 1, y: 1 },
          { x: 1.15, y: 1.15, yoyo: true, repeat: 1, duration: 0.15 }
        );
      }
      return;
    }

    // Enemy hit log: "Goblin hits Alice for 7"
    const foeName = liveEnemies.find((e) => lastLog.startsWith(e.name))?.name;
    if (foeName) {
      sfxHit.play();
      const parts = lastLog.split(' ');
      const target = parts.length >= 4 ? parts[3] : undefined;
      if (target && heroRefs.current[target]) {
        const c = heroRefs.current[target];
        gsap.fromTo(c.scale, { x: 1, y: 1 }, { x: 1.15, y: 1.15, yoyo: true, repeat: 1, duration: 0.15 });
      }
    }
  }, [lastLog, party.members, liveEnemies]);

  // Graphics builder helpers
  const drawHero = (g: any) => {
    g.clear();
    g.beginFill(0x2d8bff);
    g.drawCircle(0, 0, heroRadius);
    g.endFill();
  };

  const drawEnemy = (g: any) => {
    g.clear();
    g.beginFill(0xff5555);
    g.drawCircle(0, 0, enemyRadius);
    g.endFill();
  };

  return (
    <Stage width={width} height={height} options={{ backgroundColor: 0x202020 }}>
      {/* Risk meter bar */}
      {battle && (
        <Graphics
          x={width / 2 - 150}
          y={20}
          draw={(g: any) => {
            g.clear();
            g.beginFill(0x444444);
            g.drawRect(0, 0, 300, 10);
            g.endFill();
            const pct = party.risk / 100;
            const color = pct > 0.66 ? 0xff0000 : pct > 0.33 ? 0xffaa00 : 0x00ff00;
            g.beginFill(color);
            g.drawRect(0, 0, 300 * pct, 10);
            g.endFill();
          }}
        />
      )}
      <Container x={0} y={height / 2}>
        {party.members.map((h, idx) => (
          <Container
            key={h.name}
            x={100}
            y={(idx - (party.members.length - 1) / 2) * 120}
            ref={(c: any) => {
              if (c) heroRefs.current[h.name] = c;
            }}
          >
            <Graphics draw={drawHero} alpha={h.alive ? 1 : 0.3} />
            {/* ATB bar */}
            {battle && (
              <Graphics
                x={-heroRadius}
                y={heroRadius + 6}
                draw={(g: any) => {
                  g.clear();
                  // ATB background
                  g.beginFill(0x555555);
                  g.drawRect(0, 0, heroRadius * 2, 6);
                  g.endFill();
                  // ATB fill
                  const pct = battle.heroATB[idx] / 100;
                  g.beginFill(0x00ff88);
                  g.drawRect(0, 0, heroRadius * 2 * pct, 6);
                  g.endFill();

                  // Resonance bars (stack count / 3)
                  const resAether = h.resonance[EnergyType.AETHER] ?? 0;
                  const resVoid = h.resonance[EnergyType.VOID] ?? 0;
                  const barWidth = heroRadius * 2 * 0.5; // each half width
                  // Aether bar left
                  g.beginFill(0x00ccff);
                  g.drawRect(0, 8, barWidth * (resAether / 3), 4);
                  g.endFill();
                  // Void bar right
                  g.beginFill(0x9900ff);
                  g.drawRect(barWidth, 8, barWidth * (resVoid / 3), 4);
                  g.endFill();
                }}
              />
            )}
            <Text
              text={h.name}
              anchor={0.5}
              y={heroRadius + 12}
              style={{ fill: '#ffffff', fontSize: 14 }}
            />
          </Container>
        ))}
      </Container>

      {/* Enemies */}
      {liveEnemies.map((foe, idx) => (
        <Container
          key={foe.name + idx}
          x={width - 200 + idx * 140}
          y={height / 2}
          ref={(c: any) => {
            if (c) enemyRefs.current[foe.name] = c;
          }}
        >
          <Graphics draw={drawEnemy} alpha={foe.alive ? 1 : 0.3} />
          <Text
            text={`${foe.name} (${foe.hp}/${foe.maxHp})`}
            anchor={0.5}
            y={enemyRadius + 18}
            style={{ fill: '#ffffff', fontSize: 16 }}
          />
          {battle && (
            <Graphics
              x={-enemyRadius}
              y={enemyRadius + 8}
              draw={(g: any) => {
                g.clear();
                g.beginFill(0x555555);
                g.drawRect(0, 0, enemyRadius * 2, 8);
                g.endFill();
                const pct = battle.enemyATB[idx] / 100;
                g.beginFill(0xffaa00);
                g.drawRect(0, 0, enemyRadius * 2 * pct, 8);
                g.endFill();
              }}
            />
          )}
        </Container>
      ))}
    </Stage>
  );
} 
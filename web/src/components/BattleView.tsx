import { useEffect, useRef, useState } from 'react';
import { Party } from '../logic/party';
import { Enemy } from '../logic/enemy';
import './BattleView.css';

interface Props {
  party: Party;
  enemy: Enemy;
  lastLog: string | undefined;
}

/**
 * Very lightweight 2-D battle visualization using plain HTML/CSS.
 * Each hero/enemy is a coloured circle (placeholder for proper sprites).
 * When the latest log entry indicates a strike / magic / hit, the
 * corresponding token briefly flashes.
 */
export default function BattleView({ party, enemy, lastLog }: Props) {
  // Track which token is currently animating (by name)
  const [animatingToken, setAnimatingToken] = useState<string | null>(null);
  const timeoutRef = useRef<number>();

  // Parse the incoming log line to decide which token should animate
  useEffect(() => {
    if (!lastLog) return;

    const heroAttack = party.members.find((m) => lastLog.startsWith(m.name));
    const enemyAttack = lastLog.startsWith(enemy.name);

    if (heroAttack) {
      triggerAnim(enemy.name);
    } else if (enemyAttack) {
      // Extract target hero name at end of log string:
      // "Goblin hits Alice for 7" → target = Alice
      const parts = lastLog.split(' ');
      const targetName = parts.length >= 4 ? parts[3] : undefined;
      if (targetName) triggerAnim(targetName.replace(/[^A-Za-z0-9_-]/g, ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLog]);

  const triggerAnim = (tokenName: string) => {
    setAnimatingToken(tokenName);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnimatingToken(null), 450); // reset after anim
  };

  return (
    <div className="battle-field">
      <div className="heroes">
        {party.members.map((h) => (
          <div
            key={h.name}
            className={`token hero ${h.alive ? '' : 'ko'} ${
              animatingToken === h.name ? 'flash' : ''
            }`}
            title={h.name}
          >
            {h.name.charAt(0)}
          </div>
        ))}
      </div>
      <div className="enemy">
        <div
          className={`token enemy ${animatingToken === enemy.name ? 'flash' : ''}`}
          title={enemy.name}
        >
          {enemy.name.charAt(0)}
        </div>
      </div>
    </div>
  );
} 
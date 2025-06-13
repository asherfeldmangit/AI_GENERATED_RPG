import { useEffect, useState } from 'react';
import './OpeningCinematicScene.css';

interface Props {
  onComplete: () => void;
  skippable?: boolean;
}

/**
 * Very lightweight opening cinematic: text crawls in, background fades.
 * After `DURATION_MS` it calls onComplete(). User may skip by clicking.
 */
export default function OpeningCinematicScene({ onComplete, skippable = true }: Props) {
  const DURATION_MS = 7000;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable body scrolling during cinematic
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    const id = requestAnimationFrame(function step(now) {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setProgress(p);
      if (p < 1) requestAnimationFrame(step);
      else onComplete();
    });
    return () => cancelAnimationFrame(id);
  }, [onComplete]);

  return (
    <div
      className="cinematic" // click to skip
      onClick={() => {
        if (skippable) onComplete();
      }}
    >
      <div className="stars" style={{ opacity: progress }} />
      <div className="crawl" style={{ transform: `translateY(${50 - progress * 50}%)` }}>
        In the twilight of two realms, an <span className="highlight">Eclipse</span> sealed magic into
        opposing forces:
        <br /> <span className="aether">Aether</span> for creation… and <span className="void">Void</span> for
        entropy.
      </div>
      {skippable && <div className="skip-hint">Click to skip</div>}
    </div>
  );
} 
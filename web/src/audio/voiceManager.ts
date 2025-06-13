import { Howl } from 'howler';

const cache: Record<string, Howl> = {};

/**
 * Play a short voice bark.
 * `id` maps to file `/assets/audio/voice/${id}.ogg`.
 * Reuses Howl instances for performance.
 */
export function playVoice(id?: string) {
  if (!id) return;
  if (typeof window === 'undefined') return; // SSR / tests
  let howl = cache[id];
  if (!howl) {
    howl = new Howl({ src: [`/assets/audio/voice/${id}.ogg`], volume: 0.8 });
    cache[id] = howl;
  }
  howl.play();
} 
import { Howl } from 'howler';

const stingers: Record<string, Howl> = {
  aether: new Howl({ src: ['/assets/audio/elemental/combo_aether.ogg'], volume: 0.7 }),
  void: new Howl({ src: ['/assets/audio/elemental/combo_void.ogg'], volume: 0.7 }),
};

export function playStinger(id: 'aether' | 'void') {
  stingers[id].play();
} 
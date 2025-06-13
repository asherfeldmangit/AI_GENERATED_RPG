import { Howl } from 'howler';

export const sfxSlash = new Howl({ src: ['/assets/audio/slash.mp3'], volume: 0.6 });
export const sfxMagic = new Howl({ src: ['/assets/audio/magic.mp3'], volume: 0.6 });
export const sfxHeal = new Howl({ src: ['/assets/audio/heal.mp3'], volume: 0.6 });
export const sfxHit = new Howl({ src: ['/assets/audio/hit.mp3'], volume: 0.6 });

export const bgmBattle = new Howl({ src: ['/assets/audio/battle_bgm.mp3'], volume: 0.4, loop: true }); 
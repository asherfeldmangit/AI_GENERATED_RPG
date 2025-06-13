import { Howl } from 'howler';

export type Track = 'field' | 'battle' | 'battle_high';

class AudioManager {
  private tracks: Record<Track, Howl>;
  private current: Track | null = null;

  constructor() {
    this.tracks = {
      field: new Howl({ src: ['/assets/audio/bgm_field.mp3'], loop: true, volume: 0.4 }),
      battle: new Howl({ src: ['/assets/audio/bgm_battle.mp3'], loop: true, volume: 0.5 }),
      battle_high: new Howl({ src: ['/assets/audio/bgm_battle_high.mp3'], loop: true, volume: 0.55 }),
    } as any;
  }

  play(track: Track) {
    if (this.current === track) return;
    if (this.current) {
      this.tracks[this.current]?.fade(0.5, 0, 1000).once('fade', () => this.tracks[this.current!].stop());
    }
    this.current = track;
    this.tracks[track].volume(0);
    this.tracks[track].play();
    this.tracks[track].fade(0, 0.5, 1000);
  }

  setPhase(phase: 'story' | 'battle') {
    if (phase === 'story') this.play('field');
    else if (phase === 'battle') this.play('battle');
  }

  updateRisk(risk: number) {
    if (this.current === 'battle' && risk > 66) this.play('battle_high');
    else if (this.current === 'battle_high' && risk < 33) this.play('battle');
  }

  /** Returns current playing track (for tests) */
  getCurrent(): Track | null {
    return this.current;
  }
}

export const audioManager = new AudioManager(); 
export interface StoryOption {
  label: string;
  next: string;
  consequence?: {
    heal?: number;
    damage?: number;
    potion?: number;
  };
}

export interface StoryScene {
  id: string;
  text: string;
  options: StoryOption[];
}

export const STORY: StoryScene[] = [
  {
    id: 'start',
    text: 'Your party leaves the village and arrives at a fork in the road.',
    options: [
      { label: 'Take the forest path', next: 'forest' },
      { label: 'Take the mountain pass', next: 'mountain' },
    ],
  },
  {
    id: 'forest',
    text: 'The forest is calm but eerie. A healing spring glimmers nearby.',
    options: [
      { label: 'Drink from the spring (heal)', next: 'battle1', consequence: { heal: 15 } },
      { label: 'Ignore and move on', next: 'battle1' },
    ],
  },
  {
    id: 'mountain',
    text: 'Cold winds batter you. Loose rocks fall from above.',
    options: [
      { label: 'Dodge (DEX check)', next: 'skill', consequence: { damage: 5 } },
      { label: 'Shield up and push forward', next: 'battle1' },
    ],
  },
  {
    id: 'battle1',
    text: 'You encounter hostile creatures ahead!',
    options: [
      { label: 'Prepare for battle', next: 'battle' },
    ],
  },
]; 
import { Player } from './player';

export class Party {
  members: Player[];
  constructor(members: Player[]) {
    this.members = members;
  }
  get alive() {
    return this.members.some((m) => m.alive);
  }
} 
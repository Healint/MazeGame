import {FLOOR_TYPES} from '../Constants';

export class Floor {
  // 0: Wall
  // 1: Floor
  // 2: Corridor
  // 3: Secret Door
  char: string;
  visible: boolean;
  carveable: boolean;

  constructor(char: string) {
    this.char = char;
    this.visible = false;
    this.carveable = true;
  }

  toString() {
    return `Floor(char=${this.char},visible=${this.visible})`;
  }
}

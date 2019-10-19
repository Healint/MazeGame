import {Actor} from '../Actors/Actors';
import {HurdleFactory} from '../Actors/Hurdles';
import {LootFactory} from '../Actors/Loot';
import {UNIVERSE_CONSTANTS} from './Constants';

export class Cell {
  // 0: Wall
  // 1: Floor
  // 2: Corridor
  // 3: Secret Door
  // 7: Uncarveable (when building only
  actor: Actor;
  floor: number;
  x: number;
  y: number;

  toString() {
    return `Cell(x=${this.x},y=${this.y},actor=${this.actor})`;
  }

  constructor(x: null, y: null, floor: null, actor: null) {
    this.x = x;
    this.y = y;
    this.floor = floor;
    this.actor = actor;

    let rng = Math.random();

    // generate all actors that are not the player
    if (rng < UNIVERSE_CONSTANTS.hurdle_proba) {
      this.actor = HurdleFactory();
    } else if (
      rng <
      UNIVERSE_CONSTANTS.hurdle_proba + UNIVERSE_CONSTANTS.loot_proba
    ) {
      this.actor = LootFactory();
    }
  }

  get_cardinal_neighbours(maze) {
    // return all cells that are neighbours to this cell
    let neighbours = [];

    try {
      neighbours.push(maze.get_cell(this.x + 1, this.y));
    } catch (err) {
      //
    }

    try {
      neighbours.push(maze.get_cell(this.x - 1, this.y));
    } catch (err) {
      //
    }

    try {
      neighbours.push(maze.get_cell(this.x, this.y + 1));
    } catch (err) {
      //
    }

    try {
      neighbours.push(maze.get_cell(this.x, this.y - 1));
    } catch (err) {
      //
    }

    return neighbours;
  }
}

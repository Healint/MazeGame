import {Actor} from '../Actors/Actors';
import {HurdleFactory} from '../Actors/Hurdles';
import {LootFactory} from '../Actors/Loot';
import {UNIVERSE_CONSTANTS} from '../Constants';

export class Cell {
  // 0: Wall
  // 1: Floor
  // 2: Corridor
  // 3: Secret Door
  // 7: Uncarveable (when building only)
  actor: Actor;
  floor: number;
  x: number;
  y: number;

  toString() {
    return `Cell(x=${this.x},y=${this.y},actor=${this.actor})`;
  }

  roll_actor() {
    // customize probability of rolling actors depending on the type of floor
    // if we implement difficulty scaling, it should be there
    if (this.floor === 0) {
      // if uncarveable, we don't roll for hurdles or loot
      return;
    }

    let extra_proba_hurdle = 0;
    let extra_proba_loot = 0;
    switch (this.floor) {
      case 1:
        // extra chance of Loot in rooms
        extra_proba_hurdle = 0;
        extra_proba_loot = 0.04;
        break;
      case 2:
        // extra chance of Hurdle in corridors
        extra_proba_hurdle = 0.07;
        extra_proba_loot = 0;
        break;
    }

    let rng = Math.random();
    if (rng < UNIVERSE_CONSTANTS.hurdle_proba + extra_proba_hurdle) {
      this.actor = HurdleFactory();
      return;
    }
    rng = Math.random();
    if (rng < UNIVERSE_CONSTANTS.loot_proba + extra_proba_loot) {
      this.actor = LootFactory();
      return;
    }
  }

  constructor(x: null, y: null, floor: null, actor: null) {
    this.x = x;
    this.y = y;
    this.floor = floor;
    this.actor = actor;
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

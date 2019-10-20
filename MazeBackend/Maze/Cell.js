import {Actor} from '../Actors/Actors';
import {HurdleFactory} from '../Actors/Hurdles';
import {LootFactory} from '../Actors/Loot';
import {UNIVERSE_CONSTANTS, FLOOR_TYPES} from '../Constants';
import {Floor} from './Floor';

export class Cell {
  // 0: Wall
  // 1: Floor
  // 2: Corridor
  // 3: Secret Door
  actor: Actor;
  floor: Floor;
  x: number;
  y: number;

  toString() {
    return `Cell(x=${this.x},y=${this.y},floor=${this.floor},actor=${
      this.actor
    })`;
  }

  roll_actor() {
    // customize probability of rolling actors depending on the type of floor
    // if we implement difficulty scaling, it should be there
    if (this.floor.char === FLOOR_TYPES.WALL) {
      // if uncarveable, we don't roll for hurdles or loot
      return;
    }

    let extra_proba_hurdle = 0;
    let extra_proba_loot = 0;
    switch (this.floor) {
      case 1:
        // extra chance of Loot in rooms
        extra_proba_hurdle = 0;
        extra_proba_loot = UNIVERSE_CONSTANTS.extra_proba_loot_room;
        break;
      case 2:
        // extra chance of Hurdle in corridors
        extra_proba_hurdle = UNIVERSE_CONSTANTS.extra_proba_hurdle_corridor;
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

  get_distance_to_other_cell(cell) {
    // var a = this.x - cell.x;
    // var b = this.y - cell.y;
    // return Math.sqrt( a*a + b*b );
    return Math.hypot(this.x - cell.x, this.y - cell.y);
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

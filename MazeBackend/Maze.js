import {HurdleFactory} from './Actors/Hurdles';
import {LootFactory} from './Actors/Loot';
import {MazeExit} from './Actors/Actors';

const UNIVERSE_CONSTANTS = {
  hurdle_proba: 0.05,
  loot_proba: 0.03,
};
export class Cell {
  // 0: Floor
  // 1: Wall
  actor: any;
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
}

export class Maze {
  _nb_columns = null;
  _nb_rows = null;
  _map;

  constructor(nb_columns, nb_rows) {
    this._nb_columns = nb_columns;
    this._nb_rows = nb_rows;
    this._map = this.generate();
  }

  toString() {
    return `Maze(_nb_columns=${this._nb_columns},_nb_rows=${this._nb_rows})`;
  }

  generate() {
    let maze = new Array(this._nb_rows);

    // creating empty array
    for (let i = 0; i < maze.length; i++) {
      maze[i] = new Array(this._nb_columns);
    }

    // adding cells
    for (let i = 0; i < maze.length; i++) {
      let row = maze[i];
      for (let j = 0; j < row.length; j++) {
        row[j] = new Cell(i, j, 0);
      }
    }

    // add the exit
    let cell = maze[this._nb_rows - 1][this._nb_columns - 1];
    cell.actor = new MazeExit();
    return maze;
  }

  get_cell(x, y) {
    if (x < 0 || y < 0 || x >= this._nb_rows || y >= this._nb_columns) {
      throw 'going beyond map boundaries';
    }
    return this._map[x][y];
  }

  set_cell(x, y, cell) {
    this._map[x][y] = cell;
  }
}

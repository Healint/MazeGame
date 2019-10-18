export class Cell {
  // 0: Floor
  // 1: Wall
  x = null;
  y = null;
  floor = null;
  character = null;

  constructor(x: null, y: null, floor: null, character: null) {
    this.x = x;
    this.y = y;
    this.floor = floor;
    this.character = character;
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

  generate() {
    let maze = [];
    let x, y;
    for (x = 0; x < this._nb_rows; x++) {
      let row = [];
      for (y = 0; y < this._nb_columns; y++) {
        row.push(new Cell(x, y, 0));
        maze.push(row);
      }
    }
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

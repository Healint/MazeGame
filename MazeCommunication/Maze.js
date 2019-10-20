export class MazeBuilder {
  data: Array<Array<String>>;
  _maze;

  constructor(data: Array<Array<Element>>) {
    this.data = data;
    this._maze = new Maze('Amazing Maze', null);
  }

  withTurn(turn: number) {
    this._maze.turn = turn;
    return this;
  }

  withMessage(message: String) {
    this._maze.message = message;
    return this;
  }

  withPlayerLife(playerLife: number) {
    this._maze.playerLife = playerLife;
    return this;
  }

  build() {
    var gridRows = [];
    this.data.forEach((items, number, data) => {
      var gridRow = new GridRow('' + number, []);
      gridRows.push(gridRow);
      items.forEach((item, idx, data1) => {
        gridRow.items.push(new GridCell(idx, item));
      });
    });
    this._maze.rows = gridRows;
    return this._maze;
  }
}

export class Maze {
  name: String;
  turn: number;
  message: String;
  playerLife: number;
  rows: Array<GridRow>;

  constructor(name: String, rows: Array<GridRow>) {
    this.name = name;
    this.rows = rows;
  }
}

export class GridRow {
  rowId: String;
  items: Array<GridCell>;

  constructor(rowId: String, items: Array<GridCell>) {
    this.rowId = rowId;
    this.items = items;
  }
}

export class GridCell {
  cellId: String;
  item: Element;

  constructor(cellId: Element, item: String) {
    this.cellId = cellId;
    this.item = item;
  }
}

export class Element {
  _charFloor;
  _charActor;

  constructor(charFloor, charActor) {
    this._charFloor = charFloor;
    this._charActor = charActor;
  }

  get charFloor() {
    return this._charFloor;
  }

  set charFloor(value) {
    this._charFloor = value;
  }

  get charActor() {
    return this._charActor;
  }

  set charActor(value) {
    this._charActor = value;
  }
}

export class MazeBuilder {
  data: Array<Array<String>>;

  constructor(data: Array<Array<Element>>) {
    this.data = data;
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
    return new Maze('Awesome maze', gridRows);
  }
}

export class Maze {
  name: String;
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

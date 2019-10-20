export class MazeBuilder {
  data: Array<Array<String>>;

  constructor(data: Array<Array<String>>) {
    this.data = data;
  }

  build() {
    var gridRows = [];
    this.data.forEach((items, number, data) => {
      var gridRow = new GridRow('' + number, []);
      gridRows.push(gridRow);
      items.forEach((item, idx, data1) => {
        gridRow.items.push(new GridCell('' + idx, item));
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
  item: String;

  constructor(cellId: String, item: String) {
    this.cellId = cellId;
    this.item = item;
  }
}

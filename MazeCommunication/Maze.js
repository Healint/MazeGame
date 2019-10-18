export class MazeBuilder {
  data: Array<Array<String>>;

  constructor(data: Array<Array<String>>) {
    this.data = data;
  }

  build() {
    var row = this.data.entries().next();
    var r = 0;
    var gridRows = [];
    while (row) {
      var c = 0;
      var col = row.entries().next();
      var gridCells = [];
      while (col) {
        gridCells.push(new GridCell(c, col));
        c++;
      }
      gridRows.push(new GridRow(r, gridCells));
      r++;
    }
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

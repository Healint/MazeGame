import {MazeBuilder} from './Maze';

export class MazeActionProcessor {
  positionx = 0;
  positiony = 0;
  maxwidth = 19;
  maxheight = 19;

  constructor(positionx: number, positiony: number) {
    this.positionx = positionx;
    this.positiony = positiony;
  }

  sampleMaze() {
    var i;
    var j;
    var rows = [];
    let size = 25;
    for (i = 0; i < size; i++) {
      let cols = [];
      for (j = 0; j < size; j++) {
        // cols.push('' + (i * size + j));
        let ch = j === this.positionx && i === this.positiony ? '#' : '.';
        cols.push(ch);
      }
      rows.push(cols);
    }
    let maze = new MazeBuilder(rows).build();
    return maze;
  }

  currentMaze() {
    return this.sampleMaze();
  }

  moveUp() {
    console.log('Move up receivedd');
    if (this.positiony > 0) {
      this.positiony--;
    }
  }

  moveDown() {
    console.log('Move down received');
    if (this.positiony < this.maxheight) {
      this.positiony++;
    }
  }
  moveLeft() {
    console.log('Move left received');
    if (this.positionx > 0) {
      this.positionx--;
    }
  }
  moveRight() {
    console.log('Move right received');
    if (this.positionx < this.maxwidth) {
      this.positionx++;
    }
  }
}

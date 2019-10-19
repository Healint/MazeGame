import {MazeBuilder} from './Maze';
import {WorldState} from '../MazeBackend/GameWorld';

const GRID_SIZE = 25;

export class MazeActionProcessor {
  positionx = 0;
  positiony = 0;
  maxwidth = GRID_SIZE;
  maxheight = GRID_SIZE;
  maze = this.sampleMaze();
  _worldState;

  constructor(positionx: number, positiony: number) {
    this.positionx = positionx;
    this.positiony = positiony;
    this.initializeWorld(this.maxwidth, this.maxheight);
  }

  worldToVisibleMaze(world: WorldState) {
    var i;
    var j;
    var rows = [];
    let size = GRID_SIZE;
    for (i = 0; i < size; i++) {
      let cols = [];
      for (j = 0; j < size; j++) {
        let ch = this.getCharFromWorld(world, i, j);
        cols.push(ch);
      }
      rows.push(cols);
    }
    return new MazeBuilder(rows).build();
  }

  getCharFromWorld(world, i, j) {
    let cell = world.maze._map[i][j];
    let actor = cell.actor;
    let character = cell.character;
    let floor = cell.floor === 0 ? '.' : '#';
    let pChar =
      character === undefined || character === null ? floor : character.char;
    let ch = actor === undefined || actor === null ? pChar : actor.char;
    return ch;
  }

  sampleMaze() {
    var world = new WorldState(25, 25);
    return this.worldToVisibleMaze(world);
  }

  //todo zeeshan remove this
  sampleMaze_old() {
    var i;
    var j;
    var rows = [];
    let size = 25;
    for (i = 0; i < size; i++) {
      let cols = [];
      for (j = 0; j < size; j++) {
        let ch = j === this.positionx && i === this.positiony ? '#' : '.';
        cols.push(ch);
      }
      rows.push(cols);
    }
    return new MazeBuilder(rows).build();
  }

  initializeWorld(width: number, height: number) {
    this._worldState = new WorldState(width, height);
  }

  currentMaze() {
    return this.maze;
  }

  moveUp() {
    console.log('Move up received');
    if (this.positiony > 0) {
      this.positiony--;
      this.submitMove('UP');
    }
  }

  moveDown() {
    console.log('Move down received');
    if (this.positiony < this.maxheight) {
      this.positiony++;
      this.submitMove('DOWN');
    }
  }
  moveLeft() {
    console.log('Move left received');
    if (this.positionx > 0) {
      this.positionx--;
      this.submitMove('LEFT');
    }
  }
  moveRight() {
    console.log('Move right received');
    if (this.positionx < this.maxwidth) {
      this.positionx++;
      this.submitMove('RIGHT');
    }
  }

  submitMove(move) {
    var playerMoved = this._worldState._move_player(move);
    console.log(playerMoved);
    this.maze = playerMoved
      ? this.worldToVisibleMaze(this._worldState)
      : this.maze;
  }
}

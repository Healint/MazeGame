import {MazeBuilder} from './Maze';
import {WorldState} from '../MazeBackend/GameWorld';

const GRID_HEIGHT = 19;
const GRID_WIDTH = 19;

export class MazeActionProcessor {
  positionx = 0;
  positiony = 0;
  maze = this.sampleMaze();
  _worldState;

  constructor(positionx: number, positiony: number) {
    this.positionx = positionx;
    this.positiony = positiony;
    this.initializeWorld(GRID_HEIGHT, GRID_WIDTH);
  }

  worldToVisibleMaze(world: WorldState) {
    var i;
    var j;
    var rows = [];
    for (i = 0; i < GRID_HEIGHT; i++) {
      let cols = [];
      for (j = 0; j < GRID_WIDTH - 10; j++) {
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
    var floor = cell.floor === 0 ? '' : '' + cell.floor;
    let pChar =
      character === undefined || character === null ? floor : character.char;
    let ch = actor === undefined || actor === null ? pChar : actor.char;

    return ch;
  }

  sampleMaze() {
    var world = new WorldState(GRID_HEIGHT, GRID_WIDTH);
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

  initializeWorld(height: number, width: number) {
    this._worldState = new WorldState(height, width);
    console.log('maze initialized');
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
    if (this.positiony < GRID_HEIGHT) {
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
    if (this.positionx < GRID_WIDTH) {
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

import {MazeBuilder} from './Maze';
import {WorldState} from '../MazeBackend/GameWorld';

const GRID_HEIGHT = 9;
const GRID_WIDTH = 9;

export class MazeActionProcessor {
  positionx = 0;
  positiony = 0;
  maze;
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
      //todo zeeshan remove this when bug is fixed
      for (j = 0; j < GRID_WIDTH; j++) {
        let ch = this.getCharFromWorld(world, i, j);
        cols.push(ch);
      }
      rows.push(cols);
    }
    return new MazeBuilder(rows).build();
  }

  getCharFromWorld(world, i, j) {
    let cell = world.maze._map[i][j];
    let floor = cell.floor;
    let actor = cell.actor;
    let character = cell.character;
    var ch = '';
    if (character) {
      ch = character.char;
    } else if (actor) {
      ch = actor.visible ? actor.char : '';
    } else if (floor) {
      ch = floor.visible ? floor.char : '';
    } else {
      console.log('actor not known');
    }
    return ch;
  }

  //todo zeeshan remove this
  sampleMaze() {
    // var world = new WorldState(GRID_HEIGHT, GRID_WIDTH);
    // return this.worldToVisibleMaze(world);
    return this.sampleMaze_old();
  }

  sampleMaze_old() {
    var i;
    var j;
    var rows = [];
    let size = GRID_WIDTH;
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
    this.maze = this.worldToVisibleMaze(this._worldState);
    console.log('maze initialized');
  }

  currentMaze() {
    return this.maze;
  }

  moveUp() {
    console.log('Move up received');
    this.submitMove('UP');
  }

  moveDown() {
    console.log('Move down received');
    this.submitMove('DOWN');
  }
  moveLeft() {
    console.log('Move left received');
    this.submitMove('LEFT');
  }
  moveRight() {
    console.log('Move right received');
    this.submitMove('RIGHT');
  }

  submitMove(move) {
    var playerMoved = this._worldState.submit_player_action(move);
    console.log('sending move: ' + move);
    this.maze = playerMoved
      ? this.worldToVisibleMaze(this._worldState)
      : this.maze;
  }
}

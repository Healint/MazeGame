import {Element, MazeBuilder} from './Maze';
import {WorldState} from '../MazeBackend/GameWorld';

export class MazeActionProcessor {
  GRID_HEIGHT = 16;
  GRID_WIDTH = 9;
  maze;
  _worldState;

  constructor(width: number, height: number) {
    this.GRID_HEIGHT = height;
    this.GRID_WIDTH = width;
    this.initializeWorld(height, width);
  }

  worldToVisibleMaze(world: WorldState) {
    var i;
    var j;
    var rows = [];
    for (i = 0; i < this.GRID_HEIGHT; i++) {
      let cols = [];
      //todo zeeshan remove this when bug is fixed
      for (j = 0; j < this.GRID_WIDTH; j++) {
        let ch = this.getElementFromWorld(world, i, j);
        cols.push(ch);
      }
      rows.push(cols);
    }
    let currentTurn = this._worldState.player.turns;
    let actions = this._worldState.player.actions[currentTurn - 1];
    let gameState = this._worldState.player.game_state;
    var message = actions ? actions[0] : gameState;
    message = message === 'Movement successful' ? gameState : message;
    let health = this._worldState.player.hp;
    let food = this._worldState.player.food;
    let level = this._worldState.player.level;
    console.log(currentTurn, message, health);
    return new MazeBuilder(rows)
      .withTurn(currentTurn)
      .withMessage(message)
      .withPlayerLife(health)
      .withFood(food)
      .withGameState(gameState)
      .withLevel(level)
      .build();
  }

  getElementFromWorld(world, i, j) {
    let cell = world.maze._map[i][j];
    let floor = cell.floor;
    let actor = cell.actor;
    let character = cell.character;
    var ch = '';
    var fl = '';
    if (character) {
      ch = character.char;
    } else if (actor) {
      ch = actor.visible ? actor.char : '';
    }
    if (floor) {
      fl = floor.visible ? floor.char : 'IN';
    } else {
      console.log('floor not available');
    }
    // console.log(ch + ' ' + fl);
    return new Element(fl, ch);
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
    let size = this.GRID_WIDTH;
    for (i = 0; i < size; i++) {
      let cols = [];
      for (j = 0; j < size; j++) {
        let ch = j === this.positionx && i === this.positiony ? '#' : '.';
        cols.push(ch);
      }
      rows.push(cols);
    }
    let currentTurn = this._worldState.player.turns;
    let message = this._worldState.player.actions[currentTurn];
    let health = this._worldState.player.hp;
    return new MazeBuilder(rows)
      .withTurn(currentTurn)
      .withMessage(message)
      .withPlayerLife(health)
      .build();
  }

  initializeWorld(height: number, width: number) {
    this._worldState = new WorldState(height, width);
    this.maze = this.worldToVisibleMaze(this._worldState);
    console.log('maze initialized');
  }

  restartWorldState() {
    this._worldState.restart_level();
    this.maze = this.worldToVisibleMaze(this._worldState.maze);
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

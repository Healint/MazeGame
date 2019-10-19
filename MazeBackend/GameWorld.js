import {Cell, Maze} from './Maze';
import {Player} from './Actors/Actors';

export class WorldState {
  maze: Maze = null;
  player: Player = null;

  constructor(rows, columns) {
    this.maze = new Maze(rows, columns);
    this.player = new Player();
    let base_cell = this.maze.get_cell(0, 0);
    base_cell.character = this.player;
    this.player.cell = base_cell;
  }

  as_dict() {
    // return the game state as a dict
    return {
      maze: this.maze,
      player: this.player.as_dict,
    };
  }

  submit_player_action(action: string) {
    if (['LEFT', 'RIGHT', 'UP', 'DOWN'].includes(action)) {
      this._move_player(action);
    } else {
      throw action + ' is unknown';
    }
    this.player.turns += 1;

    return this.state;
  }

  _move_player(action: string) {
    // returns true if chracter moves
    // # check destination
    let move_x, move_y;

    if (action === 'LEFT') {
      move_x = 0;
      move_y = -1;
    } else if (action === 'RIGHT') {
      move_x = 0;
      move_y = 1;
    } else if (action === 'UP') {
      move_x = -1;
      move_y = 0;
    } else if (action === 'DOWN') {
      move_x = 1;
      move_y = 0;
    } else {
      throw 'unkown movement action ' + action;
    }
    // # if destination legal, perform movement:
    let current_cell = this.player.cell;
    let destination_cell = null;
    try {
      destination_cell = this.maze.get_cell(
        current_cell.x + move_x,
        current_cell.y + move_y,
      );
    } catch (e) {
      // reaching boundaries
      this.player.add_message('Unable to move ' + e);
      return false;
    }

    if (destination_cell.floor !== 0) {
      this.player.add_message('Unable to move, trying to move to a wall');
      return false;
    }

    // checks for interactions with any hurdle
    if (destination_cell.actor !== undefined) {
      console.log(destination_cell.actor);
      let persistent_hurdle = destination_cell.actor.process_interaction(
        this.player,
      );
      if (persistent_hurdle === false) {
        destination_cell.actor = null;
        console.log('Removing actor:' + destination_cell.actor);
      } else {
        // hurdle stays, no movement
        this.player.add_message('Unable to move, a hurdle blocked you');
        return false;
      }
    }

    console.log('Current cell:' + current_cell);
    console.log('Destination:' + destination_cell);
    // # delete player
    // # draw it in new place
    destination_cell.character = this.player;
    current_cell.character = null;
    this.player.cell = destination_cell;
    this.player.add_message('Movement successful');
    return true;
  }
}

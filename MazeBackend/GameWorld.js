import {Maze} from './Maze/Maze';
import {Player} from './Actors/Actors';
import 'react-native-console-time-polyfill';

export class WorldState {
  maze: Maze = null;
  player: Player = null;

  constructor(rows, columns) {
    console.time('WorldState Initialization');
    this.player = new Player();
    this.maze = new Maze(rows, columns, this.player);
    console.timeEnd('WorldState Initialization');
  }

  as_dict() {
    // return the game state as a dict
    return {
      maze: this.maze,
      player: this.player.as_dict(),
    };
  }

  submit_player_action(action: string) {
    console.time('Backend Submit Action');

    if (['LEFT', 'RIGHT', 'UP', 'DOWN'].includes(action)) {
      this._move_player(action);
    } else {
      throw action + ' is unknown';
    }

    this.end_of_turn_maintenance();
    let ret = this.as_dict();
    console.timeEnd('Backend Submit Action');
    return ret;
  }

  end_of_turn_maintenance() {
    this.player.turns += 1;
    this.player.change_food(-1);
  }

  _move_player(action: string) {
    // returns true if character moves
    // # check destination
    let move_x, move_y;
    console.log(`move ${action} recevied by backend`);

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

    if (destination_cell.floor === 0) {
      this.player.add_message('Unable to move, trying to move to a wall');
      return false;
    }

    // checks for interactions with any hurdle
    if (
      destination_cell.actor !== undefined &&
      destination_cell.actor !== null
    ) {
      console.log(`Destination actor is: ${destination_cell.actor}`);
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

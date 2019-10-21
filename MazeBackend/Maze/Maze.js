import {MazeExit} from '../Actors/Actors';
import {get_random_number_range} from '../Lib/lib';
import {Cell} from './Cell';
import {Room} from './Room';
import {Floor} from './Floor';
import {UNIVERSE_CONSTANTS, FLOOR_TYPES} from '../Constants';
import {get_cells_along_line} from '../Lib/geometry';
import 'react-native-console-time-polyfill';

function mark_all_neighbours(cell, maze) {
  // recursive function to follow all neighbours of a cell
  let neighbours = cell.get_cardinal_neighbours(maze);
  neighbours.forEach(function(cell) {
    if (cell.floor.char !== FLOOR_TYPES.WALL && cell.marked === undefined) {
      cell.marked = true;
      mark_all_neighbours(cell, maze);
    }
  });
}

export class Maze {
  nb_columns = null;
  nb_rows = null;
  _map;
  rooms: Array;

  constructor(nb_rows, nb_columns, player) {
    this.nb_rows = nb_rows;
    this.nb_columns = nb_columns;

    // we generate dungeons until a valid one is generated
    while (true) {
      let success = this.create_dungeon(player);
      if (success === true) {
        break;
      }
    }

    this.cleanup();
    // this.update_maze_visibility(player);
    this.update_maze_visibility_blocking(player);
    console.log(this.toString());
    this.display_log();
  }

  create_dungeon(player) {
    // creates a dungeon. returns true if the player can reach the exit
    this._map = this.create_base();
    console.log('Maze Base done');
    this.rooms = this.carve_dungeon(player);
    console.log(`${this.rooms.length} rooms carved`);
    this.exit_cell = this.place_player_and_exit(player);
    let success = this.connect_all_rooms(player);
    console.log('Dungeon Carving Result: ' + success);
    return success;
  }

  toString() {
    return `Maze(nb_columns=${this.nb_columns},nb_rows=${this.nb_rows})`;
  }

  place_player_and_exit(player) {
    // find upper left room
    this.rooms.forEach(function(room) {
      room.compute_manhattan_distance_from_origin();
    });

    this.rooms.sort(function(a, b) {
      return (
        a.manhattan_distance_from_origin - b.manhattan_distance_from_origin
      );
    });

    let player_cell = this.get_cell(this.rooms[0].x, this.rooms[0].y);
    player_cell.actor = player;
    player.cell = player_cell;

    // now place the exit
    // add the exit
    let last_room = this.rooms[this.rooms.length - 1];
    let exit_cell = this.get_cell(last_room.x, last_room.y);
    exit_cell.actor = new MazeExit();
    return exit_cell;
  }

  cleanup() {
    // any cleanup post maze construction
    // right now, it's rolling for actors
    for (let x = 0; x < this.nb_rows; x++) {
      for (let y = 0; y < this.nb_columns; y++) {
        let cell = this.get_cell(x, y);
        cell.roll_actor();
      }
    }
  }

  make_room() {
    // generates a room of random dimensions
    let width = get_random_number_range(2, UNIVERSE_CONSTANTS.max_room_size);
    let height = get_random_number_range(2, UNIVERSE_CONSTANTS.max_room_size);
    return new Room(width, height);
  }

  carve_room(new_room) {
    // tries to carve the room in a random place in the maze
    // returns true if the room is successfully carved, else false
    let row_coord = get_random_number_range(
      0,
      Math.max(0, this.nb_rows - new_room.height),
    );
    let col_coord = get_random_number_range(
      0,
      Math.max(0, this.nb_columns - new_room.width),
    );

    // first we check if we can carve the room
    for (let x = row_coord - 1; x < row_coord + new_room.height + 1; x++) {
      for (let y = col_coord - 1; y < col_coord + new_room.width + 1; y++) {
        // i hate this but i dont know how to make it better in js
        try {
          var cell = this.get_cell(x, y);
        } catch (err) {
          // out of boundaries, quite ok
          var cell = null;
        } finally {
          if (cell != null) {
            if (cell.floor.char !== FLOOR_TYPES.WALL) {
              return false;
            }
          }
        }
      }
    }

    // reaching here we know that the room can be carved. so we do it
    for (let x = row_coord; x < row_coord + new_room.height; x++) {
      for (let y = col_coord; y < col_coord + new_room.width; y++) {
        let cell = this.get_cell(x, y);
        cell.floor.char = FLOOR_TYPES.ROOM;
      }
    }
    new_room.x = row_coord;
    new_room.y = col_coord;
    return true;
  }

  carve_corridor(room) {
    // will carve a corridor starting from room
    // select a random adjacent cell

    console.log('carving door');
    let destination = room.get_neighbour(this);
    if (destination !== false) {
      // console.log(destination);
      destination.floor.char = FLOOR_TYPES.CORRIDOR;
      room.has_corridor = true;
    } else {
      console.log('Unable to carve corridor');
      return false;
    }

    while (true) {
      // console.log('Digging Corridor');
      let neighbours = destination.get_cardinal_neighbours(this);
      let arrived = false;

      // have we arrived - arrival wil be if we have a cardinal neighbour with floor 1 (other room) that is a different room
      neighbours.forEach(function(this_neighbour) {
        if (
          room.is_cell_from_room(this_neighbour) === false &&
          this_neighbour.floor.char === FLOOR_TYPES.ROOM
        ) {
          arrived = true;
          // console.log('We have arrived!!');
        }
      });

      // find the destination candidates - they are useful even if we have arrived (to mark them)
      let destination_candidates = [];
      neighbours.forEach(function(this_neighbour) {
        if (
          this_neighbour.floor.char === FLOOR_TYPES.WALL &&
          this_neighbour.floor.carveable === true
        ) {
          destination_candidates.push(this_neighbour);
        }
      });

      // we have not arrived, we need to find a destination
      if (arrived === false) {
        // if no destination exits in shame
        if (destination_candidates.length === 0) {
          // console.log('Out of destinations');
          break;
        }
        // else pick a destination and mark all other candidates as uncarveable
        let destination_id = get_random_number_range(
          0,
          destination_candidates.length - 1,
        );
        // console.log(destination_candidates);
        // console.log('destination_id: ' + destination_id);
        for (let i = 0; i < destination_candidates.length; i++) {
          if (i === destination_id) {
            destination = destination_candidates[i];
            destination.floor.char = FLOOR_TYPES.CORRIDOR;
          } else {
            destination_candidates[i].floor.carveable = false;
          }
        }
      } else {
        // we have arrived. Before exiting, we should mark the destination candidates as uncarveable
        destination_candidates.forEach(function(this_candidate) {
          this_candidate.floor.carveable = false;
        });
        return true;
      }
    }
    return false;
  }

  can_player_reach_exit(cell) {
    // returns true if the player can reach the exit
    mark_all_neighbours(cell, this);
    let retval = false;
    if (this.exit_cell.marked === true) {
      retval = true;
    }
    return retval;
  }

  carve_dungeon(player) {
    // carves the dungeon
    // returns the rooms

    // generate random room
    let rooms = [];
    let failures = 0;
    while (failures < UNIVERSE_CONSTANTS.max_room_failures) {
      // console.log('carving a room')
      let new_room = this.make_room();
      let result;
      result = this.carve_room(new_room);
      if (result === false) {
        failures += 1;
      } else {
        rooms.push(new_room);
      }
    }
    return rooms;
  }

  connect_all_rooms(player) {
    // returns true if a valid dungeon is generated, else false
    // carve corridors until all rooms are connected
    let not_all_connected = true;
    let iterations = 0;
    while (not_all_connected === true) {
      // process one room
      let nb_connections = 0;
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].has_corridor === true) {
          nb_connections += 1;
        } else {
          let result = this.carve_corridor(this.rooms[i]);
          if (result === true) {
            this.rooms[i].has_corridor = true;
          }
        }
      }
      // if all rooms are connected, break
      if (nb_connections === this.rooms.length) {
        not_all_connected = false;
      }
      // if too many iterations, we probably have an invalid dungeon, break and return false
      console.log('corridors iterations: ' + iterations);
      if (iterations > 20) {
        return false;
      }

      iterations += 1;
    }

    if (this.can_player_reach_exit(player.cell) === false) {
      return false;
    }
    return true;
  }

  create_base() {
    let maze = new Array(this.nb_rows);

    // creating empty array
    for (let i = 0; i < maze.length; i++) {
      maze[i] = new Array(this.nb_columns);
    }

    // adding cells
    for (let i = 0; i < maze.length; i++) {
      let row = maze[i];
      for (let j = 0; j < row.length; j++) {
        let floor = new Floor(FLOOR_TYPES.WALL);
        row[j] = new Cell(i, j, floor);
      }
    }

    return maze;
  }

  get_cell(x, y) {
    if (x < 0 || y < 0 || x >= this.nb_rows || y >= this.nb_columns) {
      throw 'going beyond map boundaries';
    }
    return this._map[x][y];
  }

  set_cell(x, y, cell) {
    this._map[x][y] = cell;
  }

  display_log() {
    console.log('Displaying the maze');
    for (let x = 0; x < this.nb_rows; x++) {
      let row = [];
      for (let y = 0; y < this.nb_columns; y++) {
        let cell = this.get_cell(x, y);
        if (cell.actor && cell.actor.visible === true) {
          // if (cell.actor) {
          row.push(cell.actor.char);
          // row.push(cell.floor);
          // row.push(0);
        } else if (cell.floor.visible === true) {
          // } else if (cell.marked === true) {
          row.push(cell.floor.char);
        } else {
          row.push(8);
        }
      }
      console.log(row);
    }
  }

  update_maze_visibility_blocking(player) {
    console.time('Visibility check');
    // 4 corners around the player
    let p1 = this.get_cell(
      Math.max(player.cell.x - player.view_distance, 0),
      Math.min(player.cell.y + player.view_distance, this.nb_columns - 1),
    );
    let p2 = this.get_cell(
      Math.min(player.cell.x + player.view_distance, this.nb_rows - 1),
      Math.min(player.cell.y + player.view_distance, this.nb_columns - 1),
    );
    let p3 = this.get_cell(
      Math.min(player.cell.x + player.view_distance, this.nb_rows - 1),
      Math.max(player.cell.y - player.view_distance, 0),
    );
    let p4 = this.get_cell(
      Math.max(player.cell.x - player.view_distance, 0),
      Math.max(player.cell.y - player.view_distance, 0),
    );
    let list_destinations = [
      ...get_cells_along_line(p1, p2, this),
      ...get_cells_along_line(p3, p2, this),
      ...get_cells_along_line(p4, p3, this),
      ...get_cells_along_line(p4, p1, this),
    ];
    let unique_destinations = [...new Set(list_destinations)];

    // for each destination, trace a line from the player
    // all cells will be visible until a wall is hit
    for (let h = 0; h < unique_destinations.length; h++) {
      let destination_cell = unique_destinations[h];
      // console.log(destination_cell)
      let line = get_cells_along_line(player.cell, destination_cell, this);

      if (line[0] !== player.cell) {
        line.reverse();
      }

      for (let i = 0; i < line.length; i++) {
        let cell = line[i];
        let distance = cell.get_distance_to_other_cell(player.cell);
        if (distance > player.view_distance) {
          break;
        } else if (cell.floor.char === FLOOR_TYPES.WALL) {
          cell.floor.visible = true;
          break;
        } else {
          cell.floor.visible = true;
        }

        // now actors visibility
        if (cell.actor) {
          // console.log(`distance is ${distance} for cell ${cell}`)
          if (distance < cell.actor.max_view_distance) {
            cell.actor.visible = true;
          } else {
            cell.actor.visible = false;
          }
        }
      }
    }
    console.timeEnd('Visibility check');
  }

  update_maze_visibility(player) {
    // updates actor visibility
    for (let x = 0; x < this.nb_rows; x++) {
      for (let y = 0; y < this.nb_columns; y++) {
        let cell = this.get_cell(x, y);
        let distance;
        // swap actor visibility
        if (cell.actor) {
          distance = cell.get_distance_to_other_cell(player.cell);
          // console.log(`distance is ${distance} for cell ${cell}`)
          if (distance < cell.actor.max_view_distance) {
            cell.actor.visible = true;
          } else {
            cell.actor.visible = false;
          }
          // console.log(`${cell}`)
        }
        // debug
        // cell.floor.visible = true;
        // check floor visibility
        if (cell.floor.visible === false) {
          // once visible, floors can't be hidden, so we just have to check this case
          if (distance === undefined) {
            distance = cell.get_distance_to_other_cell(player.cell);
          }
          if (player.view_distance > distance) {
            cell.floor.visible = true;
          }
        }
      }
    }
  }
}

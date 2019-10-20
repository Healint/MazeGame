import {get_random_number} from '../Lib/lib';
import {FLOOR_TYPES} from '../Constants';

export class Room {
  x: number = null;
  y: number = null;
  width: number = null;
  height: number = null;
  has_corridor: boolean = false;
  manhattan_distance_from_origin: number = null;

  toString() {
    return `Room(x=${this.x},y=${this.y},width=${this.width},height=${
      this.height
    },has_corridor=${this.has_corridor})`;
  }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  compute_manhattan_distance_from_origin() {
    this.manhattan_distance_from_origin = this.x + this.y;
  }

  _get_random_neighbour(maze) {
    let direction = get_random_number(4);
    let x_pos;
    let y_pos;
    switch (direction) {
      case 1: // north
        // console.log('NORTH');
        x_pos = this.x - 1;
        y_pos = this.y + get_random_number(this.width) - 1;
        break;
      case 2: // south
        // console.log('SOUTH');
        x_pos = this.x + this.height;
        y_pos = this.y + get_random_number(this.width) - 1;
        break;
      case 3: // east
        // console.log('EAST');
        x_pos = this.x + get_random_number(this.height) - 1;
        y_pos = this.y + this.width;
        break;
      case 4: // west
        // console.log('WEST');
        x_pos = this.x + get_random_number(this.height) - 1;
        y_pos = this.y - 1;
        break;
    }
    return maze.get_cell(x_pos, y_pos);
  }

  get_neighbour(maze) {
    let iterations = 0;
    let neighbour_candidate = null;
    while (true) {
      try {
        neighbour_candidate = this._get_random_neighbour(maze);
        if (neighbour_candidate.floor.char === FLOOR_TYPES.WALL) {
          break;
        }
      } catch (err) {
        // console.log(err);
      }

      if (iterations > 10) {
        return false;
      }
      iterations += 1;
    }

    return neighbour_candidate;
  }

  is_cell_from_room(cell) {
    // checks if cell is part of this room
    if (
      cell.x >= this.x &&
      cell.x < this.x + this.height &&
      cell.y >= this.y &&
      cell.y < this.y + this.width
    ) {
      return true;
    }
    return false;
  }
}

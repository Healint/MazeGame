import {GAME_STATES} from '../Constants';

export class Actor {
  char = 'x'; // base representation of the actor
  max_view_distance: number = 99; // how far can this hurdle be seen. 0 means invisible, 99 always visible
  visible: boolean = false;

  toString() {
    return `Actor(char=${this.char},visible=${this.visible},max_view_distance=${
      this.max_view_distance
    })`;
  }

  constructor(cell) {
    this.cell = cell;
  }

  process_interaction(player) {
    // how to handle the player moving on the hurdle.
    // Returns true if the hurdle persist, and false if it disappears
    // If the hurdle persist, then movement is blocked
    return true;
  }
}

export class MazeExit extends Actor {
  // the player character, a very special actor
  constructor(cell) {
    super(cell);
    this.char = 'E';
    this.max_view_distance = 4;
  }

  process_interaction(player) {
    player.add_message('You have won');
    player.game_state = GAME_STATES.WON;
    return false;
  }
}

export class Player extends Actor {
  // the player character, a very special actor
  // we're mixing the player and the general game state for simplicity
  constructor(char: string, cell: *, hp: number, food: null) {
    super(cell);
    this.char = '@';
    this.hp = 100;
    this.turns = 0;
    this.food = 100;
    this.actions = {};
    this.game_state = GAME_STATES.PLAYING;
    this.view_distance = 5;
    this.visible = true;
  }

  as_dict() {
    return {
      hp: this.hp,
      turns: this.turns,
      actions: this.actions,
      game_state: this.game_state,
      food: this.food,
    };
  }

  change_food(delta_food) {
    this.food += delta_food;
    if (this.food <= 0) {
      this.food = 0;
      this.game_state = GAME_STATES.DEAD;
      this.add_message('You starved to death...');
    }
  }

  change_hp(delta_hp) {
    this.hp += delta_hp;
    if (this.hp <= 0) {
      this.add_message('You lose ' + delta_hp + ' hit points');
      this.hp = 0;
      this.game_state = GAME_STATES.DEAD;
      this.add_message(
        'You die! Hell was stronger than you. Better luck next time !',
      );
    } else if (this.hp > 100) {
      this.hp = 100;
      this.add_message('You now have ' + this.hp + ' hit points');
    }
  }

  add_message(message) {
    if (this.actions.hasOwnProperty(this.turns)) {
      this.actions[this.turns].push(message);
    } else {
      this.actions[this.turns] = [message];
    }
  }
}

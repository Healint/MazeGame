export class Actor {
  char = 'x'; // base representation of the actor
  max_view_distance: number = 99; // how far can this hurdle be seen. 0 means invisible, 99 always visible

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
  }

  process_interaction(player) {
    player.add_message('You have won');
    player.game_state = 'WON';
    return false;
  }
}

export class Player extends Actor {
  // the player character, a very special actor
  // we're mixing the player and the general game state for simplicity
  constructor(char: string, cell: *, hp: number, turns: number, actions: null) {
    super(cell);
    this.char = '@';
    this.hp = 100;
    this.turns = 0;
    this.actions = {};
    this.game_state = 'PLAYING'; // can be PLAYING, DEAD, WON
  }

  as_dict() {
    return {hp: this.hp, turns: this.turns, actions: this.actions};
  }

  change_turns(delta_turns) {
    this.turns += delta_turns;
    if (this.turns <= 0) {
      this.turns = 0;
    }
    this.add_message('You now have ' + this.turns + ' turns');
  }

  change_hp(delta_hp) {
    this.hp += delta_hp;
    if (this.hp <= 0) {
      this.hp = 0;
    } else if (this.hp > 100) {
      this.hp = 100;
    }

    this.add_message('You now have ' + this.hp + ' hit points');
  }

  add_message(message) {
    if (this.actions.hasOwnProperty(this.turns)) {
      this.actions[this.turns].push(message);
    } else {
      this.actions[this.turns] = [message];
    }
  }
}

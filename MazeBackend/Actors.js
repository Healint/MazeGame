class Actor {
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

  get_random_from_list(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  get_random_number(max) {
    return Math.floor(Math.random() * max) + 1;
  }
}

export class Loot extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'L';
    const items = {MEDKIT: 3, LOSTCAT: 6, SUPERMEDKIT: 4};
    this.item = this.get_random_from_list(items);
    this.max_view_distance = items[this.item];
  }

  process_interaction(player) {
    if (this.item === 'MEDKIT') {
      let hp_delta = this.get_random_number(10) + 5;
      player.add_message(
        'You found a medkit, great ! You gain ' + hp_delta + 'hit points',
      );
      player.change_hp(hp_delta);
    } else if (this.item === 'LOSTCAT') {
      let turn_gain = this.get_random_number(3) + 3;
      player.add_message(
        'A cat, lost in the middle of daemons! Hmmm, delicious ! This unexpected food lets you play ' +
          turn_gain +
          ' more turns',
      );
      player.change_turns(turn_gain);
    } else if (this.item === 'SUPERMEDKIT') {
      player.hp = 100;
      player.add_message(
        'MINDBLOWING - You found a supermedkit, hitpoints are back to 100',
      );
    }

    return false; // Loot always disappears
  }
}

// 3 RANDOM HURDLES
export class Hurdle extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'H';
    const items = ['SPIKES', 'MINE', 'SUPERGLUE'];
    this.item = this.get_random_from_list(items);
    if (this.item === 'SPIKES') {
      this.max_view_distance = 0;
    } else if (this.item === 'MINE') {
      this.max_view_distance = 2;
    } else if (this.item === 'SUPERGLUE') {
      this.max_view_distance = 4;
    } else {
      throw 'unknown hurdle';
    }
  }

  process_interaction(player) {
    if (this.item === 'SPIKES') {
      let hp_loss = this.get_random_number(10) + 5;
      player.add_message(
        'You walked on spikes ! You lose ' + hp_loss + 'hit points',
      );
      player.hp -= hp_loss;
    } else if (this.item === 'MINE') {
      let hp_loss = this.get_random_number(20) + 10;
      let turn_loss = this.get_random_number(3) + 3;
      player.add_message(
        'You stumbled upon a demonic mine ! You lose ' +
          hp_loss +
          'hit points and it takes ' +
          turn_loss +
          ' turns to recover',
      );
      player.hp -= hp_loss;
      player.turns += turn_loss;
    } else if (this.item === 'SUPERGLUE') {
      let turn_loss = this.get_random_number(10) + 1;
      player.add_message(
        'Demons have covered this place with glue! It takes ' +
          turn_loss +
          ' to get out of it',
      );
    }

    return false; // hurdles always disappear after interaction
  }
}

export class Player extends Actor {
  // the player character, a very special actor
  constructor(char: string, cell: *, hp: number, turns: number, actions: null) {
    super(cell);
    this.char = '@';
    this.hp = 100;
    this.turns = 0;
    this.actions = {};
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

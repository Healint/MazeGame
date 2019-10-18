import {Actor, get_random_from_list} from './Actors';

export function LootFactory() {
  const items = ['MEDKIT', 'LOSTCAT', 'SUPERMEDKIT'];
  let item = get_random_from_list(items);

  if (item === 'MEDKIT') {
    return new Medkit();
  } else if (item === 'LOSTCAT') {
    return new LostCat();
  } else if (item === 'SUPERMEDKIT') {
    return new SuperMedkit();
  } else {
    throw 'unknown loot';
  }
}

class Medkit extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'L';
    this.max_view_distance = 3;
  }

  process_interaction(player) {
    let hp_delta = this.get_random_number(10) + 5;
    player.add_message(
      'You found a medkit, great ! You gain ' + hp_delta + 'hit points',
    );
    player.change_hp(hp_delta);
    return false; // Loot always disappears
  }
}

class LostCat extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'L';
    this.max_view_distance = 6;
  }

  process_interaction(player) {
    let turn_gain = this.get_random_number(3) + 3;
    player.add_message(
      'A cat, lost in the middle of daemons! Hmmm, delicious ! This unexpected food lets you play ' +
        turn_gain +
        ' more turns',
    );
    player.change_turns(turn_gain);
    return false; // Loot always disappears
  }
}

class SuperMedkit extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'L';
    this.max_view_distance = 4;
  }

  process_interaction(player) {
    player.hp = 100;
    player.add_message(
      'MINDBLOWING - You found a supermedkit, hitpoints are back to 100',
    );
    return false; // Loot always disappears
  }
}

import {Actor} from './Actors';
import {get_random_from_list, get_random_number} from '../Lib/lib';

export function LootFactory() {
  const items = ['MEDKIT', 'LOSTCAT', 'SUPERMEDKIT', 'GRAVBOOTS'];
  let item = get_random_from_list(items);

  if (item === 'MEDKIT') {
    return new Medkit();
  } else if (item === 'LOSTCAT') {
    return new LostCat();
  } else if (item === 'SUPERMEDKIT') {
    return new SuperMedkit();
  } else if (item === 'GRAVBOOTS') {
    return new GravBoots();
  } else {
    throw 'unknown loot';
  }
}

class Medkit extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'LM';
    this.max_view_distance = 3;
  }

  process_interaction(player) {
    let hp_delta = get_random_number(10) + 5;
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
    this.char = 'LC';
    this.max_view_distance = 6;
  }

  process_interaction(player) {
    let food_delta = get_random_number(3) + 3;
    player.add_message(
      'A hound, lost in the middle of daemons! Hmmm, delicious ! This fills your belly (a lot)',
    );
    player.change_food(food_delta);
    return false; // Loot always disappears
  }
}

class SuperMedkit extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'LSM';
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

class GravBoots extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'GB';
    this.max_view_distance = 5;
  }

  process_interaction(player) {
    if (player.items.gravboots === true) {
      player.add_message('You already have GRAV BOOTS...');
    } else {
      player.items.gravboots = true;
      player.add_message(
        'You found GRAV BOOTS. You now hover over the ground. Avoiding spikes. Yup!',
      );
    }
    return false; // Loot always disappears
  }
}

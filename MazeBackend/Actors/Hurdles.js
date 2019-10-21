import {Actor} from './Actors';
import {get_random_from_list, get_random_number} from '../Lib/lib';

export function HurdleFactory() {
  const items = ['SPIKES', 'MINE', 'SUPERGLUE'];
  let item = get_random_from_list(items);

  if (item === 'SPIKES') {
    return new Spikes();
  } else if (item === 'MINE') {
    return new Mine();
  } else if (item === 'SUPERGLUE') {
    return new SuperGlue();
  } else {
    throw 'unknown hurdle';
  }
}

class Spikes extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'H';
    this.max_view_distance = 1;
  }

  process_interaction(player) {
    if (player.items.gravboots) {
      player.add_message(
        `The GRAV BOOTS let you FLY over these DEMONIC SPIKES! Exciting!`,
      );
    } else {
      let hp_loss = get_random_number(10) + 5;
      player.add_message(
        `You walked on spikes ! You lose  ${hp_loss} hit points`,
      );
      player.change_hp(-hp_loss);
    }
    return false; // hurdles always disappear after interaction
  }
}

class Mine extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'H';
    this.max_view_distance = 2;
  }

  process_interaction(player) {
    let hp_loss = get_random_number(20) + 10;
    let food_loss = get_random_number(3) + 3;
    player.add_message(
      'You stumbled upon a demonic mine ! You lose ' +
        hp_loss +
        'hit points and it takes ' +
        food_loss +
        ' turns to recover',
    );
    player.change_hp(-hp_loss);
    player.change_food(-food_loss);
    return false; // hurdles always disappear after interaction
  }
}

class SuperGlue extends Actor {
  constructor(cell) {
    super(cell);
    this.char = 'H';
    this.max_view_distance = 4;
  }

  process_interaction(player) {
    let food_loss = get_random_number(10) + 1;
    player.add_message(
      'Demons have cast the shadow of HELL here ! This makes you surprisingly HUNGRY and you lose' +
        food_loss +
        ' food',
    );
    player.change_food(-food_loss);
    return false; // hurdles always disappear after interaction
  }
}

export const UNIVERSE_CONSTANTS = {
  hurdle_proba: 0.07,
  loot_proba: 0.05,
  extra_proba_loot_room: 0.04,
  extra_proba_hurdle_corridor: 0.09,
  max_room_failures: 30, // max number of failures when trying to carve rooms. Higher means more rooms
  max_room_size: 3, // max size of a room
};

export const GAME_STATES = {
  EXIT: 'EXIT',
  WON: 'WON',
  DEAD: 'DEAD',
  PLAYING: 'PLAYING',
};

export const FLOOR_TYPES = {
  WALL: 0,
  ROOM: 1,
  CORRIDOR: 2,
};

export const VICTORY_LEVEL = 3;

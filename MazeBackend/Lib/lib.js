export function get_random_from_list(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// utility functions

export function get_random_number(max) {
  return Math.floor(Math.random() * max) + 1;
}

export function get_random_number_range(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

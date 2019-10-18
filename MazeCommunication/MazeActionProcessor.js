export class MazeActionProcessor {
  name;
  title;
  id;

  constructor(name, title, id) {
    this._name = name;
    this._title = title;
    this._id = id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  startMaze() {
    console.log('Start maze action received');
  }

  moveUp() {
    console.log('Move up receivedd');
  }

  moveDown() {
    console.log('Move down received');
  }
  moveLeft() {
    console.log('Move left received');
  }
  moveRight() {
    console.log('Move right received');
  }
}

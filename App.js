import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {Maze, GridRow, GridCell, MazeBuilder} from './MazeCommunication/Maze';
import {MazeActionProcessor} from './MazeCommunication/MazeActionProcessor';

const MOVE_FREQ_MILLI = 50;

function Item({cell}) {
  return (
    <View style={mazeStyles.item}>
      <Text style={mazeStyles.title}>{cell.item}</Text>
    </View>
  );
}

function DrawMazeCells({items}) {
  return items.map((cell, idx, data) => {
    return <Item cell={cell} key={cell.cellId} />;
  });
}

function DrawRow({item}) {
  return (
    <View style={mazeStyles.horizontalContainer}>
      <DrawMazeCells items={item.items} />
    </View>
  );
}

function DrawRows({items}) {
  return items.map((row, idx, data) => {
    return <DrawRow item={row} key={row.rowId} />;
  });
}

const BUTTON_HEIGHT = 50;
const CELL_SIZE = 15;

const mazeStyles = StyleSheet.create({
  mainContainer: {
    margin: 20,
    justifyContent: 'center',
  },
  verticalContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  horizontalContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonBackground: {
    backgroundColor: '#f9c2ff',
    margin: 2,
  },
  buttonUp: {
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonSecondRow: {
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: '#f9c2ff00',
    padding: 0,
    height: CELL_SIZE,
    width: CELL_SIZE,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    alignContent: 'center',
    alignItems: 'center',
    fontSize: 10,
  },
});

export default class HelloWorldApp extends Component {
  _maze;
  rightIsDown = false;
  leftIsDown = false;
  upIsDown = false;
  downIsDown = false;
  timeWait = 0;

  _mazeActionProcessor;

  render() {
    if (!this._mazeActionProcessor) {
      this._mazeActionProcessor = new MazeActionProcessor(0, 0);
      this.registerMovements();
    }
    this._maze = this._mazeActionProcessor.currentMaze();

    let pic = {
      uri:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
    };
    return (
      <View style={mazeStyles.mainContainer}>
        <View style={mazeStyles.verticalContainer}>
          <DrawRows items={this._maze.rows} />
        </View>

        <View style={mazeStyles.buttonUp}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.upIsDown = true;
            }}
            onPressOut={() => {
              this.upIsDown = false;
            }}>
            <Text style={mazeStyles.buttonBackground}>MOVE UP</Text>
          </TouchableWithoutFeedback>
        </View>

        <View style={mazeStyles.buttonSecondRow}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.leftIsDown = true;
            }}
            onPressOut={() => {
              this.leftIsDown = false;
            }}>
            <Text style={mazeStyles.buttonBackground}>MOVE LEFT</Text>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPressIn={() => {
              this.downIsDown = true;
            }}
            onPressOut={() => {
              this.downIsDown = false;
            }}>
            <Text style={mazeStyles.buttonBackground}>MOVE DOWN</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.rightIsDown = true;
            }}
            onPressOut={() => {
              this.rightIsDown = false;
            }}>
            <Text style={mazeStyles.buttonBackground}>MOVE RIGHT</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  registerMovements() {
    setInterval(() => {
      if (this.anyButtonDown()) {
        if (this.timeWait === 0 || this.timeWait > 5) {
          this.applyMovements();
          this.setState({count: 1});
        }
        this.timeWait++;
      } else {
        this.timeWait = 0;
      }
    }, MOVE_FREQ_MILLI);
  }

  applyMovements() {
    if (this.upIsDown) {
      this._mazeActionProcessor.moveUp();
    }
    if (this.leftIsDown) {
      this._mazeActionProcessor.moveLeft();
    }
    if (this.downIsDown) {
      this._mazeActionProcessor.moveDown();
    }
    if (this.rightIsDown) {
      this._mazeActionProcessor.moveRight();
    }
  }

  anyButtonDown() {
    return (
      this.downIsDown || this.upIsDown || this.leftIsDown || this.rightIsDown
    );
  }

  moveRight() {
    this._mazeActionProcessor.moveRight();
    this.setState({count: 1});
  }

  moveUp() {
    this._mazeActionProcessor.moveUp();
    this.setState({count: 1});
  }

  sampleMaze() {
    var i;
    var j;
    var rows = [];
    let size = 25;
    for (i = 0; i < size; i++) {
      let cols = [];
      for (j = 0; j < size; j++) {
        // cols.push('' + (i * size + j));
        cols.push('#');
      }
      rows.push(cols);
    }
    rows[0][0] = '*';
    let maze = new MazeBuilder(rows).build();
    return maze;
  }

  getFlatList(maze: Maze) {
    return (
      <FlatList
        horizontal={false}
        data={maze.rows}
        extraData={this.state}
        renderItem={rowVItem => (
          <FlatList
            horizontal={true}
            data={rowVItem.item.items}
            renderItem={cellVItem => <Item title={cellVItem.item.item} />}
            keyExtractor={cell => cell.cellId}
          />
        )}
        keyExtractor={row => row.rowId}
      />
    );
  }

  getFlatListWithViews() {
    return (
      <FlatList
        scrollEnabled={false}
        horizontal={false}
        data={this._maze.rows}
        extraData={this.state}
        renderItem={rowVItem => <DrawRow item={rowVItem.item} />}
        keyExtractor={row => row.rowId}
      />
    );
  }
}

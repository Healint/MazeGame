import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import {Maze, GridRow, GridCell, MazeBuilder} from './MazeCommunication/Maze';
import {MazeActionProcessor} from './MazeCommunication/MazeActionProcessor';

const ASSET_MAP = {
  '@': require('./images/koala.png'),
  H: require('./images/penguin.png'),
  L: require('./images/player.png'),
  '#': require('./images/tile_wider.png'),
  '': '',
};

const MOVE_FREQ_MILLI = 50;

function Item({cell}) {
  let sourceImage = ASSET_MAP[cell.item];

  return (
    <View style={mazeStyles.item}>
      {/*<Image*/}
      {/*  source={require('./images/tile_wider.png')}*/}
      {/*  style={{*/}
      {/*    width: CELL_SIZE,*/}
      {/*    height: CELL_SIZE,*/}
      {/*    position: 'absolute',*/}
      {/*    justifyContent: 'center',*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Text style={mazeStyles.title}>{ASSET_MAP[cell.item]}</Text>*/}
      {sourceImage === '' ? (
        <Text style={mazeStyles.title} />
      ) : (
        <Image style={mazeStyles.actor} source={sourceImage} />
      )}
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
const CELL_SIZE = 30;

const mazeStyles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    justifyContent: 'center',
  },
  verticalContainer: {
    justifyContent: 'center',
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
    marginTop: 10,
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
    paddingTop: 5,
    paddingStart: 7,
    height: CELL_SIZE - 1,
    width: CELL_SIZE,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    alignContent: 'center',
    alignItems: 'center',
    color: 'white',
    top: 2,
    fontSize: 10,
    width: CELL_SIZE / 2,
    height: CELL_SIZE / 2,
  },
  actor: {
    alignContent: 'center',
    alignItems: 'center',
    width: CELL_SIZE,
    height: CELL_SIZE,
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
      <ImageBackground
        source={require('./images/plane_background.jpg')}
        style={{width: '100%', height: '100%'}}>
        <StatusBar hidden={true} />
        <View style={mazeStyles.mainContainer}>
          <View style={mazeStyles.verticalContainer}>
            {/*<Image*/}
            {/*  source={require('./images/tiled_background.jpg')}*/}
            {/*  style={{*/}
            {/*    marginLeft: 45,*/}
            {/*    marginTop: -5,*/}
            {/*    width: 300,*/}
            {/*    height: 300,*/}
            {/*    position: 'absolute',*/}
            {/*    justifyContent: 'center',*/}
            {/*  }}*/}
            {/*/>*/}
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
      </ImageBackground>
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

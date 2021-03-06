import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  Dimensions,
  StatusBar,
  Button,
} from 'react-native';
import {Maze, GridRow, GridCell, MazeBuilder} from './MazeCommunication/Maze';
import {MazeActionProcessor} from './MazeCommunication/MazeActionProcessor';

const ASSET_MAP = {
  '@': require('./images/frances_male.png'),
  H: require('./images/shadow.png'),
  E: require('./images/open_door.png'),
  LC: require('./images/hell_hound_new.png'),
  LM: require('./images/puce.png'),
  LSM: require('./images/misc_orb.png'),
  '0': require('./images/brick_brown_2.png'),
  '1': require('./images/acidic_floor_0.png'),
  '2': require('./images/bog_green_1_old.png'),
  IN: require('./images/hell_2.png'),
  GB: require('./images/loot/boots_iron2.png'),
  '': '',
};

const MOVE_FREQ_MILLI = 100;

const BUTTON_HEIGHT = 40;
const CELL_SIZE = 32;
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight =
  Math.round(Dimensions.get('window').height) - BUTTON_HEIGHT * 2 - 100;
const MAX_COLUMNS = (screenWidth / CELL_SIZE) | 0;
const MAX_ROWS = (screenHeight / CELL_SIZE) | 0;

function Item({cell}) {
  let sourceImage = ASSET_MAP[cell.item.charActor];
  let floorImage = ASSET_MAP[cell.item.charFloor];

  return (
    <View style={mazeStyles.item}>
      {cell.item.charFloor !== 'IN' ? (
        <Image style={mazeStyles.floor} source={floorImage} />
      ) : (
        <Text style={mazeStyles.title}> </Text>
      )}
      {sourceImage === '' ? (
        <Text style={mazeStyles.title}> </Text>
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
    backgroundColor: '#f9c2ff00',
    margin: 2,
    color: 'white',
  },
  buttonUp: {
    paddingTop: 10,
    height: BUTTON_HEIGHT + 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonSecondRow: {
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    resizeMode: 'contain',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: '#00000000',
    paddingTop: 0,
    paddingStart: 0,
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
  floor: {
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
});

export default class MazeGame extends Component {
  _maze;
  rightIsDown = false;
  leftIsDown = false;
  upIsDown = false;
  downIsDown = false;
  timeWait = 0;

  _interval;
  _mazeActionProcessor;

  componentDidMount(): void {
    this.registerMovements();
  }

  componentWillUnmount(): void {
    clearInterval(this._interval);
    this._interval = null;
  }

  render() {
    if (!this._mazeActionProcessor) {
      this._mazeActionProcessor = new MazeActionProcessor(
        MAX_COLUMNS,
        MAX_ROWS,
      );
    }
    this._maze = this._mazeActionProcessor.currentMaze();

    let pic = {
      uri:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
    };
    return (
      <ImageBackground
        source={require('./images/hell_tiled_background.png')}
        style={{width: '100%', height: '100%'}}>
        <StatusBar hidden={true} />
        <View style={mazeStyles.mainContainer}>
          <View style={mazeStyles.verticalContainer}>
            <DrawRows items={this._maze.rows} />
          </View>

          <View style={{flexDirection: 'column'}}>
            <View
              style={{
                backgroundColor: '#500000',
                height: 80,
                margin: 5,
              }}>
              <Text style={{color: 'white'}}>
                HEALTH:{this._maze.playerLife}
              </Text>

              <Text style={{color: 'white', position: 'absolute', left: '80%'}}>
                LEVEL: {this._maze.level}/3
              </Text>
              <Text style={{color: 'white'}}>FOOD:{this._maze.food}</Text>
              <Text style={{color: 'white', fontSize: 11}}>
                TURN:{this._maze.turn}
              </Text>
              <Text style={{color: 'white', fontSize: 11}}>
                {this._maze.message}
              </Text>
              <View
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                {this.restartButton()}
              </View>
            </View>
            {this._maze.gameState === 'PLAYING'
              ? this.buttonsLayout()
              : this.gameReultMessage()}
          </View>
        </View>
      </ImageBackground>
    );
  }

  gameReultMessage() {
    this.clearMovements();
    return (
      <Text
        style={{
          color: 'white',
          fontSize: 28,
          alignSelf: 'center',
        }}>
        {this._maze.gameState === 'WON'
          ? 'GREAT! YOU WON'
          : 'YOU DIED. TOO BAD'}
      </Text>
    );
  }

  restartButton() {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <Button
          title={'RESTART'}
          onPress={() => {
            this._mazeActionProcessor = new MazeActionProcessor(
              MAX_COLUMNS,
              MAX_ROWS,
            );
            this._maze = this._mazeActionProcessor.currentMaze();
            this.clearMovements();
            this.setState({count: 1});
          }}
          style={{
            width: 90,
            alignSelf: 'center',
          }}
        />
      </View>
    );
  }

  buttonsLayout() {
    return (
      <>
        <View style={mazeStyles.buttonUp}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.clearMovements();
              this.upIsDown = true;
            }}
            onPressOut={() => {
              this.clearMovements();
            }}>
            <Image
              style={mazeStyles.buttonSecondRow}
              source={require('./images/catacombs_3.png')}
            />
          </TouchableWithoutFeedback>
        </View>

        <View
          style={{
            height: BUTTON_HEIGHT + 10,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.clearMovements();
              this.leftIsDown = true;
            }}
            onPressOut={() => {
              this.clearMovements();
            }}>
            <Image
              style={mazeStyles.buttonSecondRow}
              source={require('./images/catacombs_3.png')}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPressIn={() => {
              this.clearMovements();
              this.downIsDown = true;
            }}
            onPressOut={() => {
              this.clearMovements();
            }}>
            <Image
              style={mazeStyles.buttonSecondRow}
              source={require('./images/catacombs_3.png')}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.clearMovements();
              this.rightIsDown = true;
            }}
            onPressOut={() => {
              this.clearMovements();
            }}>
            <Image
              style={mazeStyles.buttonSecondRow}
              source={require('./images/catacombs_3.png')}
            />
          </TouchableWithoutFeedback>
        </View>
      </>
    );
  }

  clearMovements() {
    this.upIsDown = false;
    this.downIsDown = false;
    this.rightIsDown = false;
    this.leftIsDown = false;
  }

  registerMovements() {
    if (!this._interval) {
      this._interval = setInterval(() => {
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
}

import React, {Component} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text} from 'react-native';

import {MazeActionProcessor} from './MazeCommunication/MazeActionProcessor';
import {WorldState} from './MazeBackend/GameWorld';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'BOBOCDIUCD Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

function Item({title}) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 1,
    marginVertical: 1,
    marginHorizontal: 1,
  },
  title: {
    fontSize: 32,
  },
});

export default class HelloWorldApp extends Component {
  render() {
    let pic = {
      uri:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
    };
    let world = new WorldState(5, 5);
    let state = null;
    state = world.submit_player_action('DOWN');
    console.log(world.player.actions);

    let actionProcessor = new MazeActionProcessor();
    actionProcessor.startMaze();
    let item = this.getItem;
    let flatlistColumn = this.getFlatList;
    return (
      <SafeAreaView style={styles.container}>
        {flatlistColumn(item)}
      </SafeAreaView>
    );
  }

  getFlatList(renderItem) {
    return (
      <FlatList
        horizontal={true}
        data={DATA}
        renderItem={({item}) => (
          <FlatList
            horizontal={true}
            data={DATA}
            renderItem={({item}) => renderItem(item)}
            keyExtractor={item => item.id}
          />
        )}
        keyExtractor={item => item.id}
      />
    );
  }

  getItem(item) {
    return <Item title={item.title} />;
  }
}

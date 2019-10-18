import React, {Component} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text} from 'react-native';
import {MazeActionProcessor} from './MazeCommunication/MazeActionProcessor';
import {WorldState} from './MazeBackend/GameWorld';

const DATA1 = {
  id: '1',
  data: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ],
};

const DATA2 = {
  id: '2',
  data: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ],
};

const DATA3 = {
  id: '3',
  data: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
  ],
};

const DATA = [DATA1, DATA2, DATA3];

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
    let flatlistColumn = this.getFlatListTamp;
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
        renderItem={({datar}) => (
          <FlatList
            horizontal={false}
            data={datar.data}
            renderItem={({datac}) => renderItem(datac)}
            keyExtractor={datac => datac.id}
          />
        )}
        keyExtractor={datar => datar.id}
      />
    );
  }

  getFlatListTamp(renderItem) {
    console.log(DATA[0].data[0].title);
    return (
      <FlatList
        horizontal={false}
        data={DATA[0].data}
        renderItem={datac => renderItem(datac.item)}
        keyExtractor={item => item.id}
      />
    );
  }

  getId(datac) {
    return datac.id;
  }

  getItem(item) {
    console.log('item id: ' + item.id);
    return <Item title={item.title} />;
  }
}

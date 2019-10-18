import React, {Component} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text} from 'react-native';
import {Maze, GridRow, GridCell} from './MazeCommunication/Maze';

const DATA1 = {
  id: '1',
  data: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'A',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'B',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'C',
    },
  ],
};

const DATA2 = {
  id: '2',
  data: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'D',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'E',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'F',
    },
  ],
};

const DATA3 = {
  id: '3',
  data: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'G',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'H',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'I',
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
    return (
      <SafeAreaView style={styles.container}>
        {this.getFlatList(this.getItem)}
      </SafeAreaView>
    );
  }

  getFlatList(renderItem) {
    return (
      <FlatList
        horizontal={true}
        data={DATA}
        renderItem={datar => (
          <FlatList
            horizontal={false}
            data={datar.item.data}
            renderItem={datac => renderItem(datac.item)}
            keyExtractor={datac => datac.id}
          />
        )}
        keyExtractor={datar => datar.id}
      />
    );
  }

  getItem(item) {
    console.log('item id: ' + item.id);
    return <Item title={item.title} />;
  }
}

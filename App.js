import React, {Component} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet, Text} from 'react-native';
import {Maze, GridRow, GridCell, MazeBuilder} from './MazeCommunication/Maze';

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
    height: 15,
    width: 15,
    marginVertical: 1,
    marginHorizontal: 1,
  },
  title: {
    fontSize: 16,
  },
});

export default class HelloWorldApp extends Component {
  render() {
    var i;
    var j;
    var rows = [];
    let size = 20;
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

    var flatList: FlatList;

    flatList = this.getFlatList(maze);

    let pic = {
      uri:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
    };
    return <SafeAreaView style={styles.container}>{flatList}</SafeAreaView>;
  }

  getFlatList(maze: Maze) {
    return (
      <FlatList
        horizontal={false}
        data={maze.rows}
        extraData={maze}
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
}

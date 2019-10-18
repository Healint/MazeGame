import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Image} from 'react-native';

export default class HelloWorldApp extends Component {
  render() {
    let pic = {
      uri:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
    };
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={pic} style={{width: 400, height: 300}} />
        <Text>Zeeshan is great. Ofcourse</Text>
        <Text>Hello, world!</Text>
      </View>
    );
  }
}

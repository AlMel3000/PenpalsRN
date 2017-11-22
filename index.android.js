/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import AppContainer from './app/container/AppContainer'

export default class PenpalsRN extends Component {
  render() {
    return (
        <AppContainer/>
    );
  }
}

AppRegistry.registerComponent('PenpalsRN', () => PenpalsRN);

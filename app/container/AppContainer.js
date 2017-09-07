import React, { Component } from 'react';

import {
    StackNavigator, NavigationActions
} from 'react-navigation';

import {
    View,
    StyleSheet
} from 'react-native';

import TabBar from './../components/TabBar'
import LoadingScreen from '../components/screens/LoadingScreen'
import Main from '../components/screens/Main'
import EnvelopeFillingScreen from '../components/screens/EnvelopeFillingScreen'
import EulaScreen from '../components/screens/EulaScreen'

const ApplicationNavContainer = StackNavigator(
    {
        Loading: { screen: LoadingScreen },
        Main: { screen: Main },
        EnvelopeFillingScreen: {screen: EnvelopeFillingScreen},
        EulaScreen: {screen: EulaScreen},
    },
    { headerMode: 'screen' }
);


export default class AppContainer extends Component {


    render() {
            return (
                <View style={styles.container}>
                    <TabBar/>
                    <ApplicationNavContainer/>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
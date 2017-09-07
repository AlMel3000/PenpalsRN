import React, { Component } from 'react';

import { NavigationActions
} from 'react-navigation';


import {
    StyleSheet,
    WebView,
    BackHandler
} from 'react-native';

import Orientation from 'react-native-orientation-locker';

export default class LoadingScreen extends Component {

    static navigationOptions = {
        title: "Terms & conditions"
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', () =>{
            this._navigateTo('EnvelopeFillingScreen');
            return true;
        });
    }


    _navigateTo = (routeName: string) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName })]
        })
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <WebView
                source={require('./../assets/terms.html')}
                style={styles.container}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
        paddingVertical: 20
    }
});

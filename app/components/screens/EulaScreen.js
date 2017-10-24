import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';


import {BackHandler, StyleSheet, WebView} from 'react-native';

import Orientation from 'react-native-orientation-locker';

let envelopesArray;
let block;
let page;

export default class LoadingScreen extends Component {

    static navigationOptions = {
        title: "Terms & conditions"
    };

    constructor(props) {
        super(props);

        envelopesArray = this.props.navigation.state.params.envelopesArray;
        block = this.props.navigation.state.params.block;
        page = this.props.navigation.state.params.page;
    }

    componentWillMount() {
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', () =>{
            this._navigateTo('EnvelopeFillingScreen', {envelopesArray: envelopesArray, block: block, page: page});
            return true;
        });
    }

    _navigateTo = (routeName, params) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName, params})]
        });
        this.props.navigation.dispatch(resetAction)
    };

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

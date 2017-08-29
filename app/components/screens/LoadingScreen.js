import React, { Component } from 'react';

import {
    StackNavigator,  NavigationActions
} from 'react-navigation';

import Orientation from 'react-native-orientation';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default class LoadingScreen extends Component {

    static navigationOptions = {
        header: false
    };

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        Orientation.lockToLandscape();
    }

    componentDidMount() {

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
            <View style={styles.container}>
                <Image source={require('./../assets/envelope_background.png')} style={{position:"absolute", flex: 1, alignSelf: "stretch", height: deviceHeight, width:deviceWidth}}/>
                <Text style={styles.loading}>
                    Загрузка ...
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    loading: {
        color: 'red',
        fontSize:16,
    },
});

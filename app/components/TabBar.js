import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Platform
} from 'react-native';

export default class TabBar extends Component {
    render() {
        return (
            <View style={styles.tabBar} />
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                height: 22,
            },
            android: {
                height: 0,
            },
        }),
    }
});
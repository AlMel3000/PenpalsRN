import React, {Component} from 'react';

import {StackNavigator} from 'react-navigation';

import {StyleSheet, View} from 'react-native';

import TabBar from './../components/TabBar'
import LoadingScreen from '../components/screens/LoadingScreen'
import Main from '../components/screens/Main'
import EnvelopeFillingScreen from '../components/screens/EnvelopeFillingScreen'
import EulaScreen from '../components/screens/EulaScreen'
import EnvelopePreview from '../components/screens/EnvelopePreview'
import EnvelopePublication from '../components/screens/EnvelopePublication'
import LetterDeparture from '../components/screens/LetterDeparture'
import LetterText from '../components/screens/LetterText'
import LetterAddress from '../components/screens/LetterAddress'
import LetterPurchasingAndSending from '../components/screens/LetterPurchasingAndSending'


const ApplicationNavContainer = StackNavigator(
    {
        LoadingScreen: {screen: LoadingScreen},
        Main: { screen: Main },
        EnvelopeFillingScreen: {screen: EnvelopeFillingScreen},
        EulaScreen: {screen: EulaScreen},
        EnvelopePreview: {screen: EnvelopePreview},
        EnvelopePublication: {screen: EnvelopePublication},
        LetterDeparture: {screen: LetterDeparture},
        LetterText: {screen: LetterText},
        LetterAddress: {screen: LetterAddress},
        LetterPurchasingAndSending: {screen: LetterPurchasingAndSending}
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
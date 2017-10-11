import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import {AsyncStorage, BackHandler, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';

import Orientation from 'react-native-orientation-locker';


let envelopesArray = [];
let userEmails = [];

let block = 1;

let departureCountryID = null;

export default class LetterText extends Component {

    static navigationOptions = {
        header: false
    };

    _navigateTo = (routeName, params) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName, params})]
        });
        this.props.navigation.dispatch(resetAction)
    };

    constructor(props) {
        super(props);

        envelopesArray = this.props.navigation.state.params.envelopesData;
        block = this.props.navigation.state.params.block;
        userEmails = this.props.navigation.state.params.userEmails;
        departureCountryID = this.props.navigation.state.params.departureCountryID;

        this.state = {
            text: null
        };

    }

    componentWillMount() {
        this.retrieveFields();
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.backToDepartureCountrySelection();
            return true;
        });
    }

    backToDepartureCountrySelection() {
        this._navigateTo('LetterDeparture', {
            envelopesData: envelopesArray,
            block: block,
            userEmails: userEmails,
            scrollToFirst: false
        });
    }

    componentWillUnmount() {
        this._saveFields();
    }

    async retrieveFields() {
        try {
            this.setState({
                text: JSON.parse(await AsyncStorage.getItem('letterText'))
            })
        } catch (message) {
        }
    }


    async _saveFields() {
        try {
            await AsyncStorage.setItem('letterText', JSON.stringify(this.state.text));
        } catch (error) {
        }
    }

    render() {
        return (
            <View style={{flex: 1, width: null, height: null}}>
                <View style={{
                    alignSelf: 'stretch',
                    height: 56,
                    backgroundColor: '#257492',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 0,
                        marginHorizontal: 8,
                        padding: 8
                    }}
                                      onPress={(e) => this.backToDepartureCountrySelection()}>
                        <Image source={require('./../assets/back_white.png')}
                               style={{
                                   width: 24,
                                   height: 24,
                                   alignSelf: 'center',
                                   margin: 6
                               }}/>
                    </TouchableOpacity>

                    <Text style={{color: 'white', fontSize: 16, flex: 1}}>
                        Моё письмо
                    </Text>

                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', flex: 0, marginRight: 8, padding: 8}}
                        onPress={(e) => this._navigateTo('LetterAddress', {
                            envelopesData: envelopesArray,
                            block: block,
                            userEmails: userEmails,
                            scrollToFirst: false,
                            departureCountryID: departureCountryID,
                            text: this.state.text
                        })}>
                        <Text style={{color: 'white', fontSize: 16}}>
                            ДАЛЕЕ
                        </Text>
                    </TouchableOpacity>

                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, marginHorizontal: 16}}>
                        <TextInput
                            style={{flex: 1, alignSelf: 'stretch', color: '#212121', fontSize: 14, height: 248}}
                            placeholder={'Напишите текст письма здесь\nПисьмо будет распечатано на листе А4\nШрифт: Arial\nРазмер шрифта: 14\nМаксимальное количество знаков: 4000'}
                            onChangeText={(text) => this.setState({text: text})}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            value={this.state.text}
                            maxLength={4000}/>
                        <View style={{flex: 0, height: 1, backgroundColor: '#257492'}}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


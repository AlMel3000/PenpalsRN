import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import {AsyncStorage, BackHandler, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';

import Orientation from 'react-native-orientation-locker';

import LocalizedStrings from 'react-native-localization';

let strings = new LocalizedStrings({
    "en-US": {
        my_letter: 'My letter',
        standart_sending: 'Write text of your letter here\n' +
        'The letter will be printed on A4 sheet\n' +
        'Font: Arial\n' +
        'Font size: 14\n' +
        'Maximum number of characters: 4000',
        next: 'Next'
    },
    en: {
        my_letter: 'My letter',
        standart_sending: 'Write text of your letter here\n' +
        'The letter will be printed on A4 sheet\n' +
        'Font: Arial\n' +
        'Font size: 14\n' +
        'Maximum number of characters: 4000',
        next: 'Next'
    },
    ja: {
        my_letter: '私の手紙',
        standart_sending: 'ここにあなたの手紙の文章を書きます\n' +
        '手紙はA4用紙に印刷されます\n' +
        'フォント：ゴシック\n' +
        'フォントサイズ：14\n' +
        '最大文字数：4000',
        next: '次'
    },
    ru: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'
    },
    be: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'

    },
    uk: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'

    },
    az: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'
    },
    hy: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'

    },
    kk: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'
    },
    ky: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'

    },
    tg: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'
    },
    tk: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'

    },
    uz: {
        my_letter: 'Моё письмо',
        standart_sending: 'Напишите текст письма здесь\n' +
        'Письмо будет распечатано на листе А4\n' +
        'Шрифт: Arial\n' +
        'Размер шрифта: 14\n' +
        'Максимальное количество знаков: 4000',
        next: 'Далее'
    }

});



let departureCountryID = null;

let recipientData = [];

let envelopesArray;
let block;
let page;

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

        envelopesArray = this.props.navigation.state.params.envelopesArray;
        block = this.props.navigation.state.params.block;
        page = this.props.navigation.state.params.page;

        recipientData = this.props.navigation.state.params.recipientData;
        departureCountryID = this.props.navigation.state.params.departureCountryID;


        this.state = {
            text: null,
            counterColor: '#257492',
            counterText: '0/4000'
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
            envelopesArray: envelopesArray,
            block: block,
            page: page,

            recipientData: recipientData
        });
    }

    componentWillUnmount() {
        this._saveFields();
    }

    async retrieveFields() {
        try {
            this.processTextChanging(JSON.parse(await AsyncStorage.getItem('letterText')));
        } catch (message) {
        }
    }


    processTextChanging(text) {
        let textLength = text.length;
        this.setState({
            text: text,
            counterText: textLength + '/4000'
        });

        if (textLength > 3500) {
            this.setState({
                counterColor: 'red'
            });
        } else {
            this.setState({
                counterColor: '#257492'
            });
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
                        {strings.my_letter}
                    </Text>

                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', flex: 0, marginRight: 8, padding: 8}}
                        onPress={(e) => this._navigateTo('LetterAddress', {
                            envelopesArray: envelopesArray,
                            block: block,
                            page: page,

                            recipientData: recipientData,
                            departureCountryID: departureCountryID,
                            text: this.state.text
                        })}>
                        <Text style={{color: 'white', fontSize: 16}}>
                            {strings.next}
                        </Text>
                    </TouchableOpacity>

                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, marginHorizontal: 16}}>
                        <TextInput
                            style={{flex: 1, alignSelf: 'stretch', color: '#212121', fontSize: 14, height: 248}}
                            placeholder={strings.standart_sending}
                            onChangeText={(text) => this.processTextChanging(text)}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            value={this.state.text}
                            maxLength={4000}/>
                        <View style={{flex: 0, height: 1, backgroundColor: '#257492'}}/>
                        <Text style={{
                            flex: 0,
                            fontSize: 12,
                            color: this.state.counterColor,
                            alignSelf: 'flex-end'
                        }}>{this.state.counterText}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


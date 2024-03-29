import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import {
    AsyncStorage,
    BackHandler,
    Image,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Vibration,
    View
} from 'react-native';

import DismissKeyboard from 'dismissKeyboard';

import Orientation from 'react-native-orientation-locker';

import Icon2 from 'react-native-vector-icons/FontAwesome';
import CountryPicker from 'react-native-country-picker-modal';
import LocalizedStrings from 'react-native-localization';


var TimerMixin = require('react-timer-mixin');


let strings = new LocalizedStrings({
    "en-US": {
        name: 'Name, last name',
        choose_country: 'Country',
        address: 'Address',
        city: 'City',
        your_address: 'My postal address',
        next: 'Next',
        zip: 'Zip',
        fields: 'You must fill in all fields correctly',
        fill_address: 'Specify correct mailing address to receive responce'
    },
    en: {
        name: 'Name, last name',
        choose_country: 'Country',
        address: 'Address',
        city: 'City',
        your_address: 'My postal address',
        next: 'Next',
        zip: 'Zip',
        fields: 'You must fill in all fields correctly',
        fill_address: 'Specify correct mailing address to receive responce'
    },
    ja: {
        name: '名前、姓',
        choose_country: '国',
        address: '住所',
        city: '市',
        your_address: 'あなたの住所',
        next: '次',
        zip: '郵便番号',
        fields: 'すべての欄に正しく記入する必要があります。',
        fill_address: '手紙を受け取るために、正しい住所を指定します。'
    },
    ru: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    be: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    uk: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    az: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    hy: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    kk: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    ky: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    tg: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    tk: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    },
    uz: {
        name: 'Имя, фамилия',
        choose_country: 'Страна',
        address: 'Адрес',
        city: 'Город',
        your_address: 'Мой почтовый адрес',
        next: 'Далее',
        zip: 'Индекс',
        fields: 'Вы должны корректно заполнить все поля',
        fill_address: 'Укажите правильный почтовый адрес чтобы получить ответ'
    }

});

let options = {
    title: 'Добавьте фото',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        returnBase64Image: true
    },
    cancelButtonTitle: 'Отмена',
    takePhotoButtonTitle: 'Сфотографировать',
    chooseFromLibraryButtonTitle: 'Выбрать из галереи',

};

let envelopesArray;
let block;
let page;

let departureCountryID = null;

let text = null;

let recipientData = [];

export default class LetterAddress extends Component {

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

    componentWillMount() {
        this.retrieveFields();
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.navigateToTextFilling();
            return true;
        });
    }

    constructor(props) {
        super(props);

        envelopesArray = this.props.navigation.state.params.envelopesArray;
        block = this.props.navigation.state.params.block;
        page = this.props.navigation.state.params.page;

        departureCountryID = this.props.navigation.state.params.departureCountryID;
        text = this.props.navigation.state.params.text;
        recipientData = this.props.navigation.state.params.recipientData;

        this.state = {
            sender_name: ' ',
            sender_nameUnderlineColor: '#1ca9c9',
            sender_address: ' ',
            sender_addressUnderlineColor: '#e4e4e4',
            sender_city: ' ',
            sender_cityUnderlineColor: '#e4e4e4',
            sender_cca2: ' ',
            sender_country: ' ',
            sender_countryUnderlineColor: '#e4e4e4',
            sender_zip: ' ',
            sender_zipUnderlineColor: '#e4e4e4',
            sender_email: ' ',
            sender_emailUnderlineColor: '#e4e4e4',

        };

    }

    componentWillUnmount() {
        this.processEmails();
    }

    navigateToTextFilling() {
        this._navigateTo('LetterText', {
            envelopesArray: envelopesArray,
            block: block,
            page: page,

            recipientData: recipientData,
            departureCountryID: departureCountryID
        });
    }

    _onChangeName(text) {
        this.setState({
            sender_name: text,
            sender_nameUnderlineColor: '#1ca9c9',

        });

    }

    onFocusName() {
        this.setState({
            sender_nameUnderlineColor: '#1ca9c9',

        });
    }

    _onChangeAddress(text) {
        this.setState({
            sender_address: text,
            sender_addressUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusAddress(text) {
        this.setState({
            sender_addressUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeCity(text) {
        this.setState({
            sender_city: text,
            sender_cityUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusCity(text) {
        this.setState({
            sender_cityUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeZip(text) {
        this.setState({
            sender_zip: text,
            sender_zipUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusZip(text) {
        this.setState({
            sender_zipUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeEmail(text) {
        this.setState({
            sender_email: text,
            sender_emailUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusEmail(text) {
        this.setState({
            sender_emailUnderlineColor: '#1ca9c9',
        });
    }

    async retrieveFields() {
        try {
            this.setState({
                sender_name: JSON.parse(await AsyncStorage.getItem('sender_name')),
                sender_address: JSON.parse(await AsyncStorage.getItem('sender_address')),
                sender_city: JSON.parse(await AsyncStorage.getItem('sender_city')),
                sender_country: JSON.parse(await AsyncStorage.getItem('sender_country')),
                sender_cca2: JSON.parse(await AsyncStorage.getItem('sender_cca2')),
                sender_zip: JSON.parse(await AsyncStorage.getItem('sender_zip')),
                sender_email: JSON.parse(await AsyncStorage.getItem('sender_email')),
                userEmails: JSON.parse(await AsyncStorage.getItem('userEmails'))
            });


        } catch (message) {
        }
    }

    isEmailValid(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    _checkFields() {
        TimerMixin.requestAnimationFrame(() => {

            let sender_name = false;

            if (!this.state.sender_name || this.state.sender_name.trim().length < 1) {
                this.setState({
                    sender_nameUnderlineColor: 'red',
                })
            } else {
                this.setState({
                    sender_nameUnderlineColor: '#e4e4e4',
                });
                sender_name = true;
            }


            let sender_address = false;
            if (!this.state.sender_address || this.state.sender_address.trim().length < 3) {
                this.setState({
                    sender_addressUnderlineColor: 'red'
                });
                sender_address = false;
            } else {
                this.setState({
                    sender_addressUnderlineColor: '#e4e4e4'
                });
                sender_address = true;
            }

            let sender_city = false;
            if (!this.state.sender_city || this.state.sender_city.length < 2) {
                this.setState({
                    sender_cityUnderlineColor: 'red'
                });
                sender_city = false;
            } else {
                this.setState({
                    sender_cityUnderlineColor: '#e4e4e4'
                });
                sender_city = true;
            }

            let sender_country = false;
            if (!this.state.sender_country || this.state.sender_country.trim().length < 2) {
                this.setState({
                    sender_countryUnderlineColor: 'red'
                });
                sender_country = false;
            } else {
                this.setState({
                    sender_countryUnderlineColor: '#e4e4e4'
                });
                sender_country = true;
            }

            let sender_zip = false;
            if (!this.state.sender_zip || this.state.sender_zip.trim().length < 2) {
                this.setState({
                    sender_zipUnderlineColor: 'red'
                });
                sender_zip = false;
            } else {
                this.setState({
                    sender_zipUnderlineColor: '#e4e4e4'
                });
                sender_zip = true;
            }

            let sender_email = false;
            let sender_emailFieldText = this.state.sender_email;
            if (!sender_emailFieldText || sender_emailFieldText.trim().length < 2 || !this.isEmailValid(sender_emailFieldText)) {
                this.setState({
                    sender_emailUnderlineColor: 'red'
                });
                sender_email = false;
            } else {
                this.setState({
                    sender_emailUnderlineColor: '#e4e4e4'
                });
                sender_email = true;
            }


            if (sender_name && sender_address && sender_city && sender_country && sender_zip && sender_email) {
                this.processEmails();
                this._navigateTo('LetterPurchasingAndSending', {
                    envelopesArray: envelopesArray,
                    block: block,
                    page: page,

                    recipientData: recipientData,
                    departureCountryID: departureCountryID,
                    text: text,

                    sender_name: this.state.sender_name,
                    sender_address: this.state.sender_address,
                    sender_city: this.state.sender_city,
                    sender_country: this.state.sender_country,
                    sender_cca2: this.state.sender_cca2,
                    sender_zip: this.state.sender_zip,
                    sender_email: this.state.sender_email
                });
            } else {
                Vibration.vibrate();
                if (!(sender_name && sender_address && sender_country && sender_zip && sender_email)) {
                    ToastAndroid.showWithGravity(strings.fields, ToastAndroid.LONG, ToastAndroid.CENTER);
                }
            }
        })
    }

    processEmails() {
        let currentEmail = this.state.sender_email;
        if (this.state.userEmails !== undefined && this.state.userEmails && this.state.userEmails.split(',').length > 0 && this.isEmailValid(currentEmail)) {
            this.setState({
                userEmails: this.state.userEmails + ',' + currentEmail
            });
        } else if (this.isEmailValid(currentEmail)) {
            this.setState({
                userEmails: currentEmail
            });
        }
        this._saveFields()
    }

    async _saveFields() {
        try {

            await AsyncStorage.setItem('sender_name', JSON.stringify(this.state.sender_name));
            await AsyncStorage.setItem('sender_address', JSON.stringify(this.state.sender_address));
            await AsyncStorage.setItem('sender_city', JSON.stringify(this.state.sender_city));
            await AsyncStorage.setItem('sender_country', JSON.stringify(this.state.sender_country));
            await AsyncStorage.setItem('sender_cca2', JSON.stringify(this.state.sender_cca2));
            await AsyncStorage.setItem('sender_zip', JSON.stringify(this.state.sender_zip));
            await AsyncStorage.setItem('sender_email', JSON.stringify(this.state.sender_email));
            await AsyncStorage.setItem('userEmails', JSON.stringify(this.state.userEmails));

        } catch (error) {
        }
    }

    render() {
        return (
            <Image source={require('./../assets/envelope_background.png')}
                   style={{flex: 1, width: null, height: null, resizeMode: 'stretch'}}>

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
                                      onPress={(e) => this.navigateToTextFilling()}>
                        <Image source={require('./../assets/back_white.png')}
                               style={{
                                   width: 24,
                                   height: 24,
                                   alignSelf: 'center',
                                   margin: 6
                               }}/>
                    </TouchableOpacity>

                    <Text style={{color: 'white', fontSize: 16, flex: 1}}>
                        {strings.your_address}
                    </Text>

                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', flex: 0, marginRight: 8, padding: 8}}
                        onPress={(e) => this._checkFields()}>
                        <Text style={{color: 'white', fontSize: 16}}>
                            {strings.next}
                        </Text>
                    </TouchableOpacity>

                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableWithoutFeedback
                        style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch'}}
                        onPress={() => {
                            DismissKeyboard()
                        }}>
                        <View style={{
                            flex: 1,
                            padding: 16,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            alignSelf: 'stretch'
                        }}>
                            <Text style={{color: '#212121', alignSelf: 'center', marginVertical: 16}}>
                                {strings.fill_address}
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                alignSelf: 'stretch'
                            }}>
                                <View style={{
                                    flex: 2,
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    alignSelf: 'stretch'
                                }}>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        alignSelf: 'stretch'
                                    }}>
                                        <View style={{width: 22}}>
                                            <Icon2 name="user-o" style={{fontSize: 20, color: 'black'}}/>
                                        </View>
                                        <View style={{flex: 1, marginHorizontal: 8}}>
                                            <TextInput
                                                style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                                placeholder={strings.name}
                                                autoFocus={true}
                                                onFocus={(e) => this.onFocusName()}
                                                onEndEditing={(e) => this.setState({sender_nameUnderlineColor: '#e4e4e4'})}
                                                onChangeText={(text) => this._onChangeName(text)}
                                                underlineColorAndroid={'transparent'}
                                                maxLength={40}
                                                value={this.state.sender_name}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.sender_nameUnderlineColor
                                            }}/>
                                        </View>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        alignSelf: 'stretch'
                                    }}>
                                        <View style={{width: 22}}>
                                            <Icon2 name="map-o" style={{fontSize: 20, color: 'black'}}/>
                                        </View>
                                        <View style={{flex: 1, marginHorizontal: 8}}>
                                            <TextInput
                                                style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                                placeholder={strings.address}
                                                onFocus={(e) => this._onFocusAddress()}
                                                onEndEditing={(e) => this.setState({sender_addressUnderlineColor: '#e4e4e4'})}
                                                onChangeText={(text) => this._onChangeAddress(text)}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.sender_address}
                                                maxLength={120}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.sender_addressUnderlineColor
                                            }}/>
                                        </View>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        alignSelf: 'stretch'
                                    }}>
                                        <View style={{width: 22}}>
                                            <Icon2 name="building-o" style={{fontSize: 20, color: 'black'}}/>
                                        </View>
                                        <View style={{flex: 1, marginHorizontal: 8}}>
                                            <TextInput
                                                style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                                placeholder={strings.city}
                                                onFocus={(e) => this._onFocusCity()}
                                                onEndEditing={(e) => this.setState({sender_cityUnderlineColor: '#e4e4e4'})}
                                                onChangeText={(text) => this._onChangeCity(text)}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.sender_city}
                                                maxLength={40}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.sender_cityUnderlineColor
                                            }}/>
                                        </View>
                                    </View>

                                </View>

                            </View>

                            <View style={{justifyContent: 'center', alignItems: 'flex-start', alignSelf: 'stretch'}}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignSelf: 'stretch'
                                }}>
                                    <View style={{width: 22}}>
                                        <Icon2 name="globe" style={{fontSize: 20, color: 'black'}}/>
                                    </View>
                                    <View style={{flex: 1, marginHorizontal: 8}}>
                                        <CountryPicker
                                            onChange={(value) => {
                                                this.setState({
                                                    sender_cca2: value.cca2,
                                                    sender_country: value.name,
                                                    sender_countryUnderlineColor: '#e4e4e4'
                                                });
                                            }}
                                            sender_cca2={this.state.sender_cca2}
                                            filterable={true}
                                            autoFocusFilter={true}
                                            translation='eng'
                                            styles={{countryName: {fontSize: 14}}}>
                                            <TextInput
                                                style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                                placeholder={strings.choose_country}
                                                editable={false}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.sender_country}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.sender_countryUnderlineColor
                                            }}/>
                                        </CountryPicker>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignSelf: 'stretch'
                                }}>
                                    <View style={{width: 22}}>
                                        <Icon2 name="map-signs" style={{fontSize: 20, color: 'black'}}/>
                                    </View>
                                    <View style={{flex: 1, marginHorizontal: 8}}>
                                        <TextInput
                                            style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                            placeholder={strings.zip}
                                            onFocus={(e) => this._onFocusZip()}
                                            onEndEditing={(e) => this.setState({sender_zipUnderlineColor: '#e4e4e4'})}
                                            onChangeText={(text) => this._onChangeZip(text)}
                                            underlineColorAndroid={'transparent'}
                                            value={this.state.sender_zip}
                                            maxLength={10}/>
                                        <View style={{
                                            flex: 0,
                                            height: 1,
                                            backgroundColor: this.state.sender_zipUnderlineColor
                                        }}/>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    alignSelf: 'stretch'
                                }}>
                                    <View style={{width: 22}}>
                                        <Icon2 name="envelope-o" style={{fontSize: 20, color: 'black'}}/>
                                    </View>
                                    <View style={{flex: 1, marginHorizontal: 8}}>
                                        <TextInput
                                            style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                            placeholder={'Email'}
                                            keyboardType={'email-address'}
                                            onFocus={(e) => this._onFocusEmail()}
                                            onEndEditing={(e) => this.setState({sender_emailUnderlineColor: '#e4e4e4'})}
                                            onChangeText={(text) => this._onChangeEmail(text)}
                                            underlineColorAndroid={'transparent'}
                                            value={this.state.sender_email}
                                            maxLength={40}/>
                                        <View style={{
                                            flex: 0,
                                            height: 1,
                                            backgroundColor: this.state.sender_emailUnderlineColor
                                        }}/>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </Image>
        );
    }
}


import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import {
    Alert,
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

import CheckBox from 'react-native-check-box'

var ImagePicker = require('react-native-image-picker');


var TimerMixin = require('react-timer-mixin');


let defaultRobohash = require('./../assets/default_robohash.png');

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
            this._navigateTo('Main', {
                envelopesData: envelopesArray,
                block: block,
                userEmails: userEmails,
                scrollToFirst: false
            });
            return true;
        });
    }

    componentWillUnmount() {
        this._saveFields();
    }

    async retrieveFields() {
        try {
            this.setState({
                name: JSON.parse(await AsyncStorage.getItem('name')),
                address: JSON.parse(await AsyncStorage.getItem('address')),
                city: JSON.parse(await AsyncStorage.getItem('city')),
                country: JSON.parse(await AsyncStorage.getItem('country')),
                cca2: JSON.parse(await AsyncStorage.getItem('cca2')),
                zip: JSON.parse(await AsyncStorage.getItem('zip')),
                email: JSON.parse(await AsyncStorage.getItem('email')),
                description: JSON.parse(await AsyncStorage.getItem('description'))
            }).then(this.setRobohash(await this.state.name))


        } catch (message) {
        }
    }

    setRobohash(name) {
        if (name && name.length > 1) {
            this.setState({
                image: {uri: 'https://robohash.org/' + name}
            });
        } else {
            this.setState({
                image: defaultRobohash
            })
        }
    }

    _onChangeName(text) {
        this.setState({
            name: text,
            nameUnderlineColor: '#1ca9c9',

        });

        if (!this.state.photoIsSet) {
            if (text && text.length > 1) {
                this.setState({
                    image: {uri: 'https://robohash.org/' + text}
                });
            } else {
                this.setState({
                    image: defaultRobohash
                })
            }
        }
    }

    onFocusName() {
        this.setState({
            nameUnderlineColor: '#1ca9c9',

        });
    }

    _onChangeAddress(text) {
        this.setState({
            address: text,
            addressUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusAddress(text) {
        this.setState({
            addressUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeCity(text) {
        this.setState({
            city: text,
            cityUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusCity(text) {
        this.setState({
            cityUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeZip(text) {
        this.setState({
            zip: text,
            zipUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusZip(text) {
        this.setState({
            zipUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeEmail(text) {
        this.setState({
            email: text,
            emailUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusEmail(text) {
        this.setState({
            emailUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeDescription(text) {
        this.setState({
            description: text,
            descriptionUnderlineColor: '#1ca9c9',
        });
    }

    _onFocusDescription(text) {
        this.setState({
            descriptionUnderlineColor: '#1ca9c9',
        });
    }

    _onConfirmationCheckboxStateChanged() {
        if (this.state.checked) {
            this.setState({
                checked: false
            });
        } else {
            this.setState({
                checked: true,
                checkboxBorderColor: 'transparent'
            });
        }
    }

    _checkFields() {
        TimerMixin.requestAnimationFrame(() => {

            let name = false;

            if (!this.state.photoIsSet) {
                if (!this.state.name || this.state.name.trim().length < 1) {
                    this.setState({
                        nameUnderlineColor: 'red',
                        image: defaultRobohash
                    });
                    name = false;
                } else {
                    this.setState({
                        nameUnderlineColor: '#e4e4e4',
                        image: {uri: 'https://robohash.org/' + this.state.name}
                    });
                    name = true;
                }
            } else {
                if (!this.state.name || this.state.name.trim().length < 1) {
                    this.setState({
                        nameUnderlineColor: 'red',
                    });
                    name = false;
                } else {
                    this.setState({
                        nameUnderlineColor: '#e4e4e4',
                    });
                    name = true;
                }
            }

            let address = false;
            if (!this.state.address || this.state.address.trim().length < 3) {
                this.setState({
                    addressUnderlineColor: 'red'
                });
                address = false;
            } else {
                this.setState({
                    addressUnderlineColor: '#e4e4e4'
                });
                address = true;
            }

            let city = false;
            if (!this.state.city || this.state.city.length < 2) {
                this.setState({
                    cityUnderlineColor: 'red'
                });
                city = false;
            } else {
                this.setState({
                    cityUnderlineColor: '#e4e4e4'
                });
                city = true;
            }

            let country = false;
            if (!this.state.country || this.state.country.trim().length < 2) {
                this.setState({
                    countryUnderlineColor: 'red'
                });
                country = false;
            } else {
                this.setState({
                    countryUnderlineColor: '#e4e4e4'
                });
                country = true;
            }

            let zip = false;
            if (!this.state.zip || this.state.zip.trim().length < 2) {
                this.setState({
                    zipUnderlineColor: 'red'
                });
                zip = false;
            } else {
                this.setState({
                    zipUnderlineColor: '#e4e4e4'
                });
                zip = true;
            }

            let email = false;
            let emailFieldText = this.state.email;
            if (!emailFieldText || emailFieldText.trim().length < 2 || !this.isEmailValid(emailFieldText)) {
                this.setState({
                    emailUnderlineColor: 'red'
                });
                email = false;
            } else {
                this.setState({
                    emailUnderlineColor: '#e4e4e4'
                });
                email = true;
            }

            let description = false;
            if (!this.state.description || this.state.description.trim().length < 2) {
                this.setState({
                    descriptionUnderlineColor: 'red'
                });
                description = false;
            } else {
                this.setState({
                    descriptionUnderlineColor: '#e4e4e4'
                });
                description = true;
            }

            let eulaAcepted = false;
            if (!this.state.checked) {
                this.setState({
                    checkboxBorderColor: 'red'
                });
                eulaAcepted = false;
            } else {
                this.setState({
                    checkboxBorderColor: 'transparent'
                });
                eulaAcepted = true;
            }


            if (name && address && city && country && zip && email && description && eulaAcepted) {
                this._saveFields();
                this._navigateTo('EnvelopePreview', {
                    envelopesData: envelopesArray,
                    block: block,
                    userEmails: userEmails,
                    scrollToFirst: false,
                    photo: this.state.image,
                    name: this.state.name,
                    address: this.state.address,
                    city: this.state.city,
                    country: this.state.country,
                    cca2: this.state.cca2,
                    zip: this.state.zip,
                    email: this.state.email,
                    description: this.state.description
                })

            } else {
                Vibration.vibrate();
                if (!eulaAcepted && (name && address && city && country && zip && email && description)) {
                    ToastAndroid.showWithGravity('Вы должны принять соглашение', ToastAndroid.LONG, ToastAndroid.CENTER);
                } else if (!eulaAcepted && !(name && address && country && zip && email && description)) {
                    ToastAndroid.showWithGravity('Вы должны принять соглашение и корректно заполнить все поля', ToastAndroid.LONG, ToastAndroid.CENTER);
                } else {
                    ToastAndroid.showWithGravity('Вы должны корректно заполнить все поля', ToastAndroid.LONG, ToastAndroid.CENTER);
                }
            }
        })

    }

    isEmailValid(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async _saveFields() {
        try {
            let userEmails;
            savedUserEmails = JSON.parse(await AsyncStorage.getItem('userEmails'));
            let currentEmail = this.state.email;
            if (savedUserEmails && this.isEmailValid(currentEmail)) {
                userEmails = savedUserEmails + ',' + currentEmail;
            } else if (!savedUserEmails && this.isEmailValid(currentEmail)) {
                userEmails = currentEmail;
            }

            await AsyncStorage.setItem('name', JSON.stringify(this.state.name));
            await AsyncStorage.setItem('address', JSON.stringify(this.state.address));
            await AsyncStorage.setItem('city', JSON.stringify(this.state.city));
            await AsyncStorage.setItem('country', JSON.stringify(this.state.country));
            await AsyncStorage.setItem('cca2', JSON.stringify(this.state.cca2));
            await AsyncStorage.setItem('zip', JSON.stringify(this.state.zip));
            await AsyncStorage.setItem('email', JSON.stringify(currentEmail));
            await AsyncStorage.setItem('userEmails', JSON.stringify(userEmails));
            await AsyncStorage.setItem('description', JSON.stringify(this.state.description));
            if (this.state.photoIsSet) {
                await AsyncStorage.setItem('photo', JSON.stringify(this.state.image));
            } else {
                await AsyncStorage.setItem('photo', JSON.stringify(null));
            }

        } catch (error) {
        }
    }

    _showEULA() {
        Alert.alert(
            'Terms & Conditions',
            '\t\t\t1) I am of sound mind and memory, in person, without any pressure from outside, decided to publish my personal information in the Penpals Service for finding penpals. \n\n\t\t\t2) Each card is verified by the moderator before it gets into the list of the envelopes. Be worthy of yourself. We\'ll remove all the dirt, trash and spam.Also cards that contain email, phone, links to other sites and profiles in social networks will not be moderated. Moderation takes some time, please be patient a little bit and your address will appear in the Penpals.',
            [
                {
                    text: 'УЗНАТЬ БОЛЬШЕ',
                    onPress: () => this._navigateTo('EulaScreen', {
                        envelopesData: envelopesArray,
                        block: block,
                        userEmails: userEmails,
                        scrollToFirst: false
                    })
                },
                {text: 'OК'},
            ],
            {cancelable: true}
        )
    }

    _pickPhoto() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    photoIsSet: true,
                    image: {uri: response.uri}
                });
            }
        });
    }

    render() {
        return (
            <Image source={require('./../assets/envelope_background.png')}
                   style={{flex: 1, width: null, height: null, resizeMode: 'stretch'}}>
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
                                Specify correct mailing address to receive letters
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
                                                placeholder={'Имя, фамилия'}
                                                autoFocus={true}
                                                onFocus={(e) => this.onFocusName()}
                                                onEndEditing={(e) => this.setState({nameUnderlineColor: '#e4e4e4'})}
                                                onChangeText={(text) => this._onChangeName(text)}
                                                underlineColorAndroid={'transparent'}
                                                maxLength={40}
                                                value={this.state.name}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.nameUnderlineColor
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
                                                placeholder={'Адрес'}
                                                onFocus={(e) => this._onFocusAddress()}
                                                onEndEditing={(e) => this.setState({addressUnderlineColor: '#e4e4e4'})}
                                                onChangeText={(text) => this._onChangeAddress(text)}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.address}
                                                maxLength={120}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.addressUnderlineColor
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
                                                placeholder={'Город'}
                                                onFocus={(e) => this._onFocusCity()}
                                                onEndEditing={(e) => this.setState({cityUnderlineColor: '#e4e4e4'})}
                                                onChangeText={(text) => this._onChangeCity(text)}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.city}
                                                maxLength={40}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.cityUnderlineColor
                                            }}/>
                                        </View>
                                    </View>

                                </View>

                                <TouchableOpacity style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'stretch',
                                    borderColor: '#e4e4e4',
                                    borderWidth: 0.2,
                                    padding: 8
                                }}
                                                  onPress={(event) => this._pickPhoto()}>
                                    <Image source={this.state.image}
                                           style={{flex: 1, width: 120, height: 130, resizeMode: 'contain'}}/>
                                </TouchableOpacity>
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
                                                    cca2: value.cca2,
                                                    country: value.name,
                                                    countryUnderlineColor: '#e4e4e4'
                                                });
                                            }}
                                            cca2={this.state.cca2}
                                            filterable={true}
                                            autoFocusFilter={true}
                                            translation='eng'>
                                            <TextInput
                                                style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                                placeholder={'Страна'}
                                                editable={false}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.country}/>
                                            <View style={{
                                                flex: 0,
                                                height: 1,
                                                backgroundColor: this.state.countryUnderlineColor
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
                                            placeholder={'Индекс'}
                                            onFocus={(e) => this._onFocusZip()}
                                            onEndEditing={(e) => this.setState({zipUnderlineColor: '#e4e4e4'})}
                                            onChangeText={(text) => this._onChangeZip(text)}
                                            underlineColorAndroid={'transparent'}
                                            value={this.state.zip}
                                            maxLength={10}/>
                                        <View style={{
                                            flex: 0,
                                            height: 1,
                                            backgroundColor: this.state.zipUnderlineColor
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
                                            onEndEditing={(e) => this.setState({emailUnderlineColor: '#e4e4e4'})}
                                            onChangeText={(text) => this._onChangeEmail(text)}
                                            underlineColorAndroid={'transparent'}
                                            value={this.state.email}
                                            maxLength={40}/>
                                        <View style={{
                                            flex: 0,
                                            height: 1,
                                            backgroundColor: this.state.emailUnderlineColor
                                        }}/>
                                    </View>
                                </View>
                            </View>

                            <View style={{
                                flex: 1,
                                alignSelf: 'stretch',
                                borderColor: this.state.descriptionUnderlineColor,
                                borderWidth: 1,
                                marginVertical: 12
                            }}>
                                <TextInput
                                    style={{flex: 0, alignSelf: 'stretch', color: '#212121', fontSize: 14}}
                                    placeholder={'p.s.'}
                                    maxLength={150}
                                    multiline={true}
                                    onFocus={(e) => this._onFocusDescription()}
                                    onEndEditing={(e) => this.setState({descriptionUnderlineColor: '#e4e4e4'})}
                                    onChangeText={(text) => this._onChangeDescription(text)}
                                    underlineColorAndroid={'transparent'}
                                    value={this.state.description}/>
                            </View>

                            <View style={{
                                alignSelf: 'stretch',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start'
                            }}>
                                <CheckBox
                                    style={{
                                        flex: 0,
                                        paddingVertical: 4,
                                        paddingHorizontal: 6,
                                        borderColor: this.state.checkboxBorderColor,
                                        borderWidth: 2
                                    }}
                                    onClick={() => this._onConfirmationCheckboxStateChanged()}
                                    isChecked={this.state.checked}
                                />
                                <View style={{
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start'
                                }}>
                                    <Text style={{color: '#212121'}}>
                                        Я принимаю условия
                                    </Text>
                                    <TouchableOpacity
                                        onPress={(e) => this._showEULA()}>
                                        <Text
                                            style={{color: '#1ca9c9', marginLeft: 4, textDecorationLine: 'underline'}}>
                                            соглашения
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{
                                alignSelf: 'stretch',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end',
                                padding: 16
                            }}>
                                <TouchableOpacity style={{marginRight: 32}}
                                                  onPress={(e) => this._navigateTo('Main', {
                                                      envelopesData: envelopesArray,
                                                      block: block,
                                                      userEmails: userEmails,
                                                      scrollToFirst: false
                                                  })}>
                                    <Text style={{fontSize: 16, color: '#7299BF'}}>ОТМЕНА</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={(e) => this._checkFields()}>
                                    <Text style={{fontSize: 16, color: '#7299BF'}}>ДАЛЕЕ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </Image>
        );
    }
}


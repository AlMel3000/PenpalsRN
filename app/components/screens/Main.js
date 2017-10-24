import {
    Alert,
    AsyncStorage,
    BackHandler,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    VirtualizedList,
} from 'react-native';

import React, {Component} from 'react';

import CardView from 'react-native-cardview'

import Modal from 'react-native-modal'

import {NavigationActions} from 'react-navigation';

import Orientation from 'react-native-orientation-locker';

import RotatingView from './../assets/RotatingView';

import Icon2 from 'react-native-vector-icons/FontAwesome';

import RadioButton from 'radio-button-react-native';

import LocalizedStrings from 'react-native-localization';
import {Dropdown} from 'react-native-material-dropdown';

var TimerMixin = require('react-timer-mixin');

let countriesData = require('./../assets/countries.json');


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];
let stampRotationArray = [];
let sealRotationArray = [];

let viewStampRotationArray = [];

let viewsById = {};

let isAppRatedOrRateDeclined = false;

const BLOCKS_RANGE_FOR_RANDOMIZATION = 100;
const ENVELOPES_AMOUNT_PER_BLOCK = 50;
const CARDS_COUNT_FOR_RATING_DIALOG = 35;

let savedBlock;
let blocksAvailable;

let scrollToFirst = false;

let page = 0;
let block = 1;

let countryByISO = {};

let countByIso = {};

let envelopesByCountry = [];

let strings = new LocalizedStrings({
    "en-US": {
        send_letter: "SEND LETTER",
        create_envelope: 'CREATE ENVELOPE',
        delete_envelope: 'DELETE OWN CARD',
        filter: 'FILTER'
    },
    en: {
        send_letter: "SEND LETTER",
        create_envelope: 'CREATE ENVELOPE',
        delete_envelope: 'DELETE OWN CARD',
        filter: 'FILTER'
    },
    ja: {
        send_letter: '手紙を送ります',
        create_envelope: '封筒を作成します。',
        delete_envelope: '自分の封筒を消去',
        filter: 'フィルタ'
    },
    ru: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    be: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    uk: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    az: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    hy: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    kk: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    ky: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    tg: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    tk: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    uz: {
        send_letter: "ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    }

});


export default class Main extends Component {

    static navigationOptions = {
        header: false
    };

    onRefresh = () => {
        this.setState({
            showProgress: true
        });
        this.saveStatus()
            .then(this.getUserStatus())
            .catch((e) => console.log.e)
    };

    z;

    constructor(props) {
        super(props);


        this.state = {
            showProgress: true,
            showError: false,
            refreshing: false,
            showButton: false,
            showMenu: false,
            showRateDialog: false,
            showFilter: false,

            pagesViewed: 0,

            value: 0,

            ownEnvelopesFilterText: 'Показать только собственные конверты',
            ownEnvelopesFilterTextColor: '#212121',

            showOwnEnvelopes: false,
            userEmails: ''
        };


        this.renderEnvelope = this.renderEnvelope.bind(this);
        this._onScrollEnd = this._onScrollEnd.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);
        this.showButton = this.showButton.bind(this);
    }

    componentDidMount() {
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () => {
            BackHandler.exitApp();
            return true;
        });
        this.getCountries().then(console.log(JSON.stringify(countryByISO)));
    }

    componentWillUnmount() {
        this.saveStatus();
        this.updateViews();
    }

    componentWillMount() {
        if (this.props.navigation.state.params !== undefined) {
            envelopesArray = this.props.navigation.state.params.envelopesArray;
            block = this.props.navigation.state.params.block;
            page = this.props.navigation.state.params.page;
            this.setState({
                showProgress: false
            })
        } else {
            this.getUserStatus();
        }

        this.getRateAndEmailsInfo();
    }

    async getUserStatus() {
        try {
            this.setState({
                showProgress: true,
                showMenu: false,
                showButton: false,
                showFilter: false,
                value: 0,
                code: '',
                showOwnEnvelopes: false
            });
            savedBlock = JSON.parse(await AsyncStorage.getItem('block'));


            let lastCardOfUser = JSON.parse(await AsyncStorage.getItem('lastCardOfUser'));

            if (await savedBlock !== null) {
                block = savedBlock;
                if (!scrollToFirst) {
                    page = JSON.parse(await AsyncStorage.getItem('page'));
                }
                if (await lastCardOfUser) {
                    this.getLastCardOfUser(lastCardOfUser);
                } else {
                    this.getCards();
                }
            } else {
                block = this.randomizer(BLOCKS_RANGE_FOR_RANDOMIZATION);
                await this.getCards();
            }


        } catch (message) {
            this.getCards();
        }

    }

    async getLastCardOfUser(email: string) {
        console.log("BOOM START");
        try {
            let response = await fetch(('http://penpal.eken.live/Api/get-last-user-envelope/?email=' + email), {
                method: 'GET'
            });
            let res = JSON.parse(await response.text());
            console.log(JSON.stringify(res));
            if (response.status >= 200 && response.status < 300) {

                if (!res.result) {
                    let tempArray = [{
                        type: "card",
                        data: {
                            id: res.id,
                            first_name: res.first_name,
                            address: res.address,
                            city: res.city,
                            country_name: res.country_name,
                            postal: res.postal,
                            email: res.email,
                            description: res.description,
                            photo: res.image_id,
                            envelope: res.envelope, stamp: res.stamp, seal: res.seal,
                            views: res.views
                        },
                        resources: {envelope: res.envelope, stamp: res.stamp, seal: res.seal}
                    }];
                    tempArray.concat(envelopesArray);
                    envelopesArray = tempArray;
                    console.log("BOOM 4");
                }

            }
        } catch (message) {
            console.log("BOOM 5");
            console.log('catch ' + message)
        } finally {
            console.log("BOOM 6 main");
            this.getCards();
        }
    }

    async saveStatus() {
        try {
            await AsyncStorage.setItem('block', JSON.stringify(block));
            await AsyncStorage.setItem('page', JSON.stringify(page));
            await AsyncStorage.setItem('pagesViewed', JSON.stringify(this.state.pagesViewed));
        } catch (error) {
        }
    }

    async getCards() {
        try {
            this.setState({
                showProgress: true
            });
            const data = new FormData();
            data.append('country', this.state.code);
            data.append('page', block);
            data.append('perPage', ENVELOPES_AMOUNT_PER_BLOCK);


            let response = await fetch(('http://penpal.eken.live/api/get-cards'), {
                method: 'POST',
                body: data
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {
                blocksAvailable = res.pages;
                let envelopesReceived = res.cards;

                // if any user doesn't exceed blocks range - let my user go
                if (block <= blocksAvailable) {
                    // if user exceeds page range (due to card deletion) - get him to 1st page of first block
                    if (this.state.page >= envelopesReceived.length) {
                        page = 0;
                        block = 1;
                    }
                    envelopesArray = envelopesArray.concat(envelopesReceived);
                } else {
                    // if not new user exceeds blocks range (due to card deletion) - get him to 1st page of 1st block
                    if (savedBlock !== null) {
                        page = 0;
                        block = 1;
                        envelopesArray = envelopesArray.concat(envelopesReceived);
                        // if new user exceeds blocks range - randomize him again
                    } else {
                        block = this.randomizer(blocksAvailable);
                        this.getCards();
                        return;
                    }

                }

                this.setState({
                    showProgress: false,
                    showError: false
                });
            } else {
                this.setState({
                    showProgress: false,
                    showError: true
                });
            }
        } catch (message) {
            this.setState({
                showProgress: false,
                showError: true
            });
        }
    }


    async getCountries() {
        try {
            let response = await fetch(('http://penpal.eken.live/api/get-cards?page=' + block + '&perPage=' + ENVELOPES_AMOUNT_PER_BLOCK), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {

                countByIso = res.countries;
                let countryCodesFromServer = Object.keys(countByIso);
                for (let i = 0; i < countryCodesFromServer.length; i++) {
                    let code = countryCodesFromServer[i];
                    let countryname = '';
                    countriesData.filter(value => value.cca2 === code)
                        .map(value => countryname = value.name.common);

                    countryByISO[code] = countryname;

                    envelopesByCountry.push({value: countryname + ' (' + countByIso[code] + ")"})
                }
            }
        } catch (message) {
            this.setState({
                showProgress: false,
                showError: true
            });
        }
    }

    randomizer(max: number) {
        let rand = (Math.random() * max);
        let randomBlock = Math.floor(rand) + 1;
        return randomBlock;
    }

    async getRateAndEmailsInfo() {
        if (JSON.parse(await AsyncStorage.getItem('isAppRatedOrRateDeclined'))) {
            isAppRatedOrRateDeclined = true;
        } else {
            let storedPagesViewed = JSON.parse(await AsyncStorage.getItem('pagesViewed'));
            storedPagesViewed === null ? this.setState({pagesViewed: 0}) : this.setState({pagesViewed: storedPagesViewed});
        }
        this.setState({
            userEmails: JSON.parse(await AsyncStorage.getItem('userEmails'))
        });

    }

    showButton() {

        TimerMixin.requestAnimationFrame(() => {
            if (!this.state.showButton) {
                this.setState({
                    showButton: true
                })
            } else {
                this.setState({
                    showButton: false
                })
            }
            this.setState({
                showMenu: false
            })
        })

    }

    onScroll(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        page = Math.floor(contentOffset.x / viewSize.width);

        this.incrementViews(page);
        this.setState({
            showButton: false
        });

        if (!isAppRatedOrRateDeclined) {
            this.setState({pagesViewed: this.state.pagesViewed + 1});
            console.log('pagesViewed ' + this.state.pagesViewed);
            if (this.state.pagesViewed >= CARDS_COUNT_FOR_RATING_DIALOG) {
                this.setState({
                    pagesViewed: 0,
                    showRateDialog: true
                })
            }
        }
    }

    async deleteOwnEnvelope(id: number) {
        try {
            this.setState({
                showButton: false,
                showMenu: false
            });
            let response = await fetch(('http://penpal.eken.live/Api/delete/?id=' + id), {
                method: 'GET'
            });
            let res = JSON.parse(await response.text());
            console.log(JSON.stringify(res));
            if (response.status >= 200 && response.status < 300) {

                if (res.result === 0) {
                    this.setState({
                        showProgress: true,
                    });
                    envelopesArray = [];
                    if (page > 0) {
                        page--;
                    }
                    if (!this.state.showOwnEnvelopes) {
                        this.getCards();
                    } else {
                        this.getAllCardsOfUser();
                    }
                }


            }
        } catch (message) {
            console.log("BOOM 5");
            console.log('catch ' + message)
        }
    }

    showDeletionWarning(id: number) {
        Alert.alert(
            'Удалить конверт?',
            'Восстановить конверт будет невозможно, даже если он был оплачен.',
            [
                {text: 'ДА', onPress: () => this.deleteOwnEnvelope(id)},
                {text: 'ОТМЕНА'},
            ],
            {cancelable: true}
        )
    }

    renderEnvelope(envelope) {
        console.log("item " + JSON.stringify(envelope.index));

        let buttonIconColor = '#9e9e9e';
        let buttonTextColor = '#9e9e9e';
        let isButtonDisabled = true;
        if (this.state.userEmails !== null && this.state.userEmails.includes(envelope.item.data.email)) {
            buttonIconColor = 'red';
            buttonTextColor = 'red';
            isButtonDisabled = false;
        } else {
            buttonIconColor = '#9e9e9e';
            buttonTextColor = '#9e9e9e';
            isButtonDisabled = true;
        }
        let imageURL;
        if (envelope.item.data.photo < 0) {
            imageURL = 'https://robohash.org/' + envelope.item.data.first_name;
        } else {
            imageURL = 'http://penpal.eken.live/Api/photo/width/300/id/' + envelope.item.data.photo;
        }
        let envelopeNumber = envelope.item.data.envelope;
        let envelopeURL;
        if (envelopeNumber < 10) {
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=00' + envelopeNumber;
        } else if (envelopeNumber > 9 && envelopeNumber < 100) {
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=0' + envelopeNumber;
        } else {
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=' + envelopeNumber;
        }

        let stampNumber = envelope.item.data.stamp;
        let stampURL;
        if (stampNumber < 10) {
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=00' + stampNumber;
        } else if (stampNumber > 9 && stampNumber < 100) {
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=0' + stampNumber;
        } else {
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=' + stampNumber;
        }

        let sealNumber = envelope.item.data.seal;
        let sealURL;
        if (sealNumber < 10) {
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=00' + sealNumber;
        } else if (sealNumber > 9 && sealNumber < 100) {
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=0' + sealNumber;
        } else {
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=' + sealNumber;
        }

        let stampRotation;
        let sealRotation;
        let viewStampRotation;

        let id = envelope.item.data.id;

        if (stampRotationArray.hasOwnProperty(id)) {
            stampRotation = stampRotationArray[id];
        } else {
            stampRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
            stampRotationArray[id] = stampRotation;
        }


        if (id in sealRotationArray) {
            sealRotation = sealRotationArray[id];
        } else {
            sealRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
            sealRotationArray[id] = sealRotation;
        }

        if (id in viewStampRotationArray) {
            viewStampRotation = viewStampRotationArray[id];
        } else {
            viewStampRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
            viewStampRotationArray[id] = viewStampRotation;
        }


        return (
            <TouchableOpacity style={styles.viewPager} key={envelope.item.data.id}
                              activeOpacity={0.8}
                              onPress={(e) => this.showButton()}>
                <Image source={{uri: envelopeURL}} style={styles.envelopeImage}>
                    <View style={styles.topRow}>
                        <View style={styles.topLeftRow}>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row',}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.name}>
                                    {envelope.item.data.first_name}
                                </Text>
                            </View>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.address}>
                                    {envelope.item.data.address}
                                </Text>
                            </View>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.address}>
                                    {envelope.item.data.city}
                                </Text>
                            </View>
                            <View
                                style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                                <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                                <Text style={styles.address}>
                                    {envelope.item.data.country_name + ', ' + envelope.item.data.postal}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.topRightRow}>
                            <Image source={{uri: imageURL}} style={styles.userPhoto}/>
                            <Image source={{uri: stampURL}} style={{
                                height: deviceHeight / 5,
                                width: deviceWidth / 4,
                                resizeMode: 'contain',
                                transform: [{rotate: stampRotation}],
                                alignSelf: 'center',
                                left: deviceWidth / 6,
                                position: 'absolute'
                            }}/>
                            <Image source={{uri: sealURL}} style={{
                                height: deviceHeight / 5,
                                width: deviceWidth / 5,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                left: deviceWidth / 6,
                                position: 'absolute',
                                transform: [{rotate: sealRotation}]
                            }}/>
                        </View>

                        <View style={{
                            height: 38,
                            width: 74,
                            borderColor: 'black',
                            borderWidth: 1.5,
                            position: 'absolute',
                            right: deviceWidth / 20,
                            alignSelf: 'flex-end',
                            transform: [{rotate: viewStampRotation}]
                        }}>
                            <View style={{
                                height: 18,
                                width: 60,
                                borderColor: 'black',
                                borderWidth: 1,
                                position: 'absolute',
                                alignSelf: 'center',
                                marginTop: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'center'
                                }}>{envelope.item.data.views}</Text>
                            </View>
                            <Text style={{color: 'black', fontSize: 8, alignSelf: 'center'}}>ПРОСМОТРЫ</Text>

                        </View>

                    </View>
                    <View
                        style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                        <View style={{flex: 1, width: deviceWidth / 2.6}}/>
                        <View style={{
                            flex: 1,
                            width: deviceWidth / 1.6,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            paddingBottom: deviceHeight * 0.1
                        }}>
                            <Image source={require('./../assets/quote.png')}
                                   style={{height: deviceHeight / 25, resizeMode: 'contain', marginTop: 25}}/>
                            <Text style={{
                                color: '#212121',
                                fontSize: 14,
                                marginLeft: deviceWidth * 0.003125,
                                width: deviceWidth / 2 - 64,
                                marginTop: 25
                            }}>
                                {envelope.item.data.description}
                            </Text>
                        </View>
                    </View>
                    {this.state.showButton &&
                    <View style={{
                        position: 'absolute',
                        bottom: 32,
                        right: 32,
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        flex: 0
                    }}>
                        {this.state.showMenu &&
                        <CardView style={{
                            marginBottom: deviceHeight * 0.011,
                            paddingVertical: deviceHeight * 0.022222,
                            paddingHorizontal: deviceWidth * 0.025
                        }}
                                  cardElevation={2}
                                  cardMaxElevation={2}
                                  cornerRadius={2}>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              onPress={(e) => this._navigateTo('LetterDeparture', {
                                                  envelopesArray: envelopesArray,
                                                  block: block,
                                                  page: page,
                                                  recipientData: envelope.item.data
                                              })}>
                                <Text style={styles.actionButtonText}>{strings.send_letter}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="send-o" style={styles.actionButtonIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              onPress={(e) => this._navigateTo('EnvelopeFillingScreen', {
                                                  envelopesArray: envelopesArray,
                                                  block: block,
                                                  page: page
                                              })}>
                                <Text style={styles.actionButtonText}>{strings.create_envelope}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="envelope-o" style={styles.actionButtonIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              disabled={isButtonDisabled}
                                              onPress={(e) => this.showDeletionWarning(envelope.item.data.id)}>
                                <Text style={{
                                    color: buttonTextColor,
                                    fontSize: 16,
                                    marginRight: deviceWidth * 0.03125
                                }}>{strings.delete_envelope}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="trash-o" style={{fontSize: 22, color: buttonIconColor}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}
                                              onPress={(e) => this.setState({
                                                  showFilter: true,
                                                  showMenu: false,
                                                  showButton: false
                                              })}>
                                <Text style={styles.actionButtonText}>{strings.filter}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="filter" style={styles.actionButtonIcon}/>
                                </View>
                            </TouchableOpacity>
                        </CardView>}
                        <TouchableOpacity style={{
                            backgroundColor: '#ff4444',
                            borderRadius: 64,
                            height: deviceHeight * 0.155,
                            width: deviceHeight * 0.155
                        }}
                                          onPress={(e) => this.onClickFab()}/>
                    </View>}
                    <Modal isVisible={this.state.showRateDialog}
                           backdropOpacity={0.5}>
                        <View style={{flex: 0, marginHorizontal: 56, backgroundColor: 'white', padding: 16}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={require('./../assets/google_play_icon.png')}
                                       style={{resizeMode: 'contain', height: 32, width: 32}}/>
                                <Text style={{fontSize: 18, color: '#257492', marginLeft: 8}}>Penpal on Google
                                    Play</Text>
                            </View>
                            <Text style={{
                                color: '#212121',
                                fontSize: 16,
                                marginTop: 8
                            }}>{'We really care about your experience and want to make app better for you.' +
                            '\nLet us know how it can be improved and we\'ll build it!' +
                            '\nOr just rate us on Google Play.'}</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: 24,
                                marginBottom: 8
                            }}>
                                <TouchableOpacity
                                    style={{flex: 3, justifyContent: 'center', alignItems: 'flex-start'}}
                                    onPress={(e) => this.annihilateFutureRateDialogues()}><Text
                                    style={{color: '#257492', fontSize: 16}}>Don't ask more</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                    onPress={(e) => this.setState({showRateDialog: false})}><Text
                                    style={{color: '#257492', fontSize: 16}}>Later</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                    onPress={(e) => this.rate()}><Text
                                    style={{color: '#257492', fontSize: 16}}>Improve</Text></TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal isVisible={this.state.showFilter}
                           backdropOpacity={0.4}>
                        <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
                            <Text style={{flex: 2, alignSelf: 'center', fontSize: 18, color: '#212121'}}>Фильтр</Text>
                            <View style={{
                                flex: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <RadioButton style={{alignSelf: 'flex-end'}}
                                             currentValue={this.state.value} value={1}
                                             onPress={this.handleOnPress.bind(this)} outerCircleColor={'dodgerblue'}/>
                                <View style={{width: 22, marginLeft: 16, alignSelf: 'center'}}>
                                    <Icon2 name="globe" style={{fontSize: 20, color: 'black'}}/>
                                </View>
                                <View style={{
                                    flex: 1, marginHorizontal: 8, justifyContent: 'flex-start', alignSelf: 'flex-start'
                                }}>
                                    <Dropdown
                                        label={'Страна'}
                                        data={envelopesByCountry}
                                        onChangeText={(data) => this.handleCountrySelection(data)}/>
                                </View>
                            </View>
                            <View style={{
                                flex: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <RadioButton currentValue={this.state.value} value={2}
                                             onPress={this.handleOnPress.bind(this)} outerCircleColor={'dodgerblue'}/>
                                <Text style={{
                                    marginLeft: 16,
                                    color: this.state.ownEnvelopesFilterTextColor,
                                    fontSize: 16
                                }}>{this.state.ownEnvelopesFilterText}</Text>
                            </View>
                            <View style={{
                                flex: 3,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}>
                                <TouchableOpacity
                                    style={{flex: 1.5, justifyContent: 'center', alignItems: 'flex-start'}}
                                    onPress={(e) => this.setState({showFilter: false, value: 0})}><Text
                                    style={{color: '#257492', fontSize: 16}}>Назад</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 8}}
                                    onPress={(e) => this.resetFilter()}><Text
                                    style={{color: '#257492', fontSize: 16}}>Сбросить</Text></TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}
                                    onPress={(e) => this.handleFilter()}>
                                    <Text
                                    style={{color: '#257492', fontSize: 16}}>Применить</Text></TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </Image>
            </TouchableOpacity>
        );
    }


    _onScrollEnd() {
        if (envelopesArray.length > 14 && !this.state.showOwnEnvelopes) {
            this.setState({
                showProgress: true
            });
            let nextBlock;
            if (block < blocksAvailable) {
                nextBlock = block++;

            } else {
                nextBlock = 1;
            }
            console.log('nextBlock ' + nextBlock);
            block = nextBlock;
            this.getCards();
            this.updateViews();
        }
    }

    onClickFab() {
        TimerMixin.requestAnimationFrame(() => {
            if (!this.state.showMenu) {
                this.setState({
                    showMenu: true
                })
            } else {
                this.setState({
                    showMenu: false
                })
            }
        })
    }

    incrementViews(pageNum: number) {
        let id = envelopesArray[pageNum].data.id;

        let email = envelopesArray[pageNum].data.email;

        let viewsToShow = envelopesArray[pageNum].data.views;

        let view = 0;
        if (!this.state.userEmails || this.state.userEmails.indexOf(email) < 1) {
            if (id in viewsById) {
                view = viewsById[id];
            }
            view++;
            viewsToShow++;
            envelopesArray[pageNum].data.views = viewsToShow;
            viewsById[id] = view;
            console.log('id ' + id)
        }

    }

    async updateViews() {
        try {
            if (Object.keys(viewsById).length > 0) {
                let data = new FormData();
                for (let id in viewsById) {
                    data.append(id, viewsById[id])
                }
                let response = await fetch('http://penpal.eken.live/Api/update-views', {
                    method: 'POST',
                    body: data
                });
                console.log('viewsById posted' + JSON.stringify(viewsById));
                let res = JSON.stringify(await response.text());
                console.log("update views" + JSON.stringify(res));
            }
        } catch (message) {
            console.log('catch ' + message)
        }
    }

    async annihilateFutureRateDialogues() {
        isAppRatedOrRateDeclined = true;
        this.setState({showRateDialog: false});
        try {
            await AsyncStorage.setItem('isAppRatedOrRateDeclined', JSON.stringify(true));
        } catch (error) {
        }
    }

    rate() {
        this.annihilateFutureRateDialogues();

        //todo rate for iOS

        let uri = "market://details?id=live.eken.penpal";
        Linking.canOpenURL(uri).then(supported => {
            if (!supported) {
                return Linking.openURL('https://play.google.com/store/apps/details?id=live.eken.penpal');
            } else {
                return Linking.openURL(uri);
            }
        }).catch(err => console.error('An error occurred', err));

    }

    handleOnPress(value) {
        this.setState({value: value});
        if (value === 2) {
            if (this.state.userEmails === null || this.state.userEmails.length === 0) {
                this.setState({
                    ownEnvelopesFilterText: 'Вы ещё не добавляли конверты',
                    ownEnvelopesFilterTextColor: 'red'
                })
            } else {
                this.setState({
                    ownEnvelopesFilterText: 'Показать только собственные конверты',
                    ownEnvelopesFilterTextColor: '#212121'
                })
            }
        }
    }

    handleCountrySelection(country: string) {
        let countryName = country.split(' (')[0];
        const getKey = (obj, val) => Object.keys(obj).find(key => obj[key] === val);
        let code = getKey(countryByISO, countryName);
        this.setState({
            code: '"' + code + '"',
            value: 1
        })

    }

    handleFilter() {
        this.saveStatus();
        if (this.state.value === 1) {
            if (!this.state.code.isEmpty) {
                envelopesArray = [];
                block = 1;
                page = 0;
                this.getCards();
                this.setState({
                    showFilter: false
                });
            }

        } else if (this.state.value === 2) {
            if (this.state.userEmails !== null && this.state.userEmails.length > 0) {
                envelopesArray = [];
                block = 1;
                page = 0;
                this.getAllCardsOfUser();
                this.setState({
                    showFilter: false,
                    showOwnEnvelopes: true
                });
            }
        }
    }


    async getAllCardsOfUser() {
        try {

            this.setState({
                showProgress: true
            });
            const data = new FormData();
            for (let i = 0; i < this.state.userEmails.split(',').length; i++) {
                data.append('emails[]', this.state.userEmails.split(',')[i]);
            }


            let response = await fetch(('http://penpal.eken.live/Api/get-cards-by-email'), {
                method: 'POST',
                body: data
            });
            let res = JSON.parse(await response.text());
            if (response.status >= 200 && response.status < 300) {
                if (res.length === 0) {
                    this.setState({
                        showOwnEnvelopes: false
                    });
                    this.showUserDeletedDialog();
                }
                for (let i = 0; i < res.length; i++) {
                    let tempArray = {
                        type: "card",
                        data: {
                            id: res[i].id,
                            first_name: res[i].first_name,
                            address: res[i].address,
                            city: res[i].city,
                            country_name: res[i].country_name,
                            postal: res[i].postal,
                            email: res[i].email,
                            description: res[i].description,
                            photo: res[i].image_id,
                            envelope: res[i].envelope, stamp: res[i].stamp, seal: res[i].seal,
                            views: res[i].views
                        },
                        resources: {envelope: res[i].envelope, stamp: res[i].stamp, seal: res[i].seal}
                    };

                    envelopesArray.push(tempArray)

                }

                console.log(JSON.stringify(envelopesArray));
                this.setState({
                    showProgress: false,
                    showError: false
                });
            } else {
                this.setState({
                    showProgress: false,
                    showError: true,
                    showOwnEnvelopes: false
                });
            }
        } catch (message) {
            console.log(message);
            this.setState({
                showProgress: false,
                showError: true,
                showOwnEnvelopes: false
            });
        }
    }


    resetFilter() {
        envelopesArray = [];
        this.setState({
                code: ' ',
                showOwnEnvelopes: false
            }
        );
        this.getUserStatus()
    }

    showUserDeletedDialog() {
        Alert.alert(
            'Your envelopes are not found',
            'Возможно Вы удалили свои конверты или истёк срок их размещения',
            [
                {text: 'Ok', onPress: () => this.getUserStatus()},
            ],
            {cancelable: false}
        )
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
            <View style={styles.container}>
                {this.state.showProgress &&
                <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                    flex: 1,
                    width: deviceWidth,
                    height: deviceHeight,
                    alignSelf: "stretch",
                    resizeMode: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <RotatingView
                        style={{height: 48, width: 48, alignSelf: 'center'}}
                        duration={3000}
                        onFinishedAnimating={( (status) => {
                            console.log(status)
                        } )}>
                        <Image
                            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
                            resizeMode='contain'
                            source={require("./../assets/enveolopes_loading_48_px.png")}/>
                    </RotatingView>
                </Image>}
                {this.state.showError &&
                <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                    flex: 1,
                    width: deviceWidth,
                    height: deviceHeight,
                    alignSelf: "stretch",
                    resizeMode: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        alignSelf: 'center',
                        width: deviceWidth - 64,
                        margin: 64,
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }}>
                        <Text
                            style={{color: '#212121', flex: 1, fontSize: 16,}}>
                            {'Что-то пошло не так.\n\nПожалуйста проверьте интернет соединение или зайдите к нам позже'}
                        </Text>
                        <TouchableOpacity style={{
                            flex: 1,
                            alignSelf: 'center',
                            borderColor: '#257492',
                            borderWidth: 0.5,
                            borderRadius: 2,
                            padding: 8,
                            margin: 8
                        }}
                                          onPress={(e) => this.getUserStatus()}>
                            <Image source={require('./../assets/refresh_blue.png')}
                                   style={{flex: 1}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{flex: 1, flexDirection: 'row', alignSelf: 'center'}}
                            onPress={(e) => Linking.openURL('mailto:119@penpal.eken.live?subject=From Penpals app&body=Здравствуйте!\n' +
                                '\n' +
                                'Пожалуйста не изменяйте тему письма.\n' +
                                '\n' +
                                'Мы как и все очень любим Google Translate :)\n' +
                                'И как и все умеем им пользоваться.\n' +
                                'При этом просим Вас всё-таки обратить внимание, что сотрудники нашей службы поддержки говорят на английском языке.\n' +
                                '\n' +
                                'С наилучшими пожеланиями, Ваш Penpals.\n' +
                                '\n---------------------------------------------------------------')}>
                            <Text
                                style={{
                                    flex: 3,
                                    alignSelf: 'center',
                                    color: '#212121',
                                    width: deviceWidth,
                                    fontSize: 16
                                }}>
                                {'По любым вопросам Вы можете написать нам:'}
                            </Text>
                            <Text
                                style={{
                                    flex: 2,
                                    alignSelf: 'center',
                                    color: '#1ca9c9',
                                    width: deviceWidth,
                                    fontSize: 16
                                }}>
                                {'119@penpal.eken.live'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Image>}
                {!( this.state.showProgress || this.state.showError) &&
                <VirtualizedList
                    horizontal
                    pagingEnabled
                    initialNumToRender={1}
                    getItemCount={data => data.length}
                    data={envelopesArray}
                    initialScrollIndex={page}
                    keyExtractor={(item, index) => item.data.id}
                    getItemLayout={(data, index) => ({
                        length: deviceWidth,
                        offset: deviceWidth * index,
                        index
                    })}
                    maxToRenderPerBatch={1}
                    windowSize={1}
                    getItem={(data, index) => ( data[index])}
                    renderItem={this.renderEnvelope}
                    onEndReached={this._onScrollEnd}
                    onEndReachedThreshold={1}
                    onStartReached={this._onScrollEnd}
                    onStartThreshold={1}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    removeClippedSubviews={false}
                    onMomentumScrollEnd={this.onScroll}
                />
                }
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e4e4',
    },
    viewPager: {
        flex: 1,
        width: null, height: null,
        alignSelf: 'center',
        paddingVertical: deviceHeight * 0.025,

    },
    page: {
        flex: 1,
    },
    topRow: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    envelopeImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
    topLeftRow: {
        height: deviceHeight / 1.9,
        width: deviceWidth / 2 - 82,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingLeft: deviceWidth * 0.0225,
        paddingTop: deviceHeight * 0.15
    },
    prefix: {
        height: deviceHeight / 25,
        resizeMode: 'contain'
    },
    topRightRow: {
        height: deviceHeight / 1.9,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: deviceWidth * 0.0375,
        paddingTop: deviceHeight * 0.1125
    },
    userPhoto: {
        height: deviceHeight / 2.5,
        width: deviceWidth / 4,
        resizeMode: 'contain',
        marginTop: deviceHeight * 0.025
    },
    address: {
        color: '#212121',
        fontSize: 14,
        marginLeft: deviceWidth * 0.003125
    },
    name: {
        color: '#212121',
        fontSize: 16,
        marginLeft: deviceWidth * 0.003125
    },
    actionButtonIcon: {
        fontSize: 22,
        color: '#757575',
    },
    actionButtonText: {
        color: '#212121',
        fontSize: 16,
        marginRight: deviceWidth * 0.03125
    }
});


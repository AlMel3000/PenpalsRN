import {
    AsyncStorage,
    BackHandler,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import RotatingView from './../assets/RotatingView';
import Orientation from 'react-native-orientation-locker';
import LocalizedStrings from 'react-native-localization';

let deviceWidth = Dimensions.get('window').width;

const InAppBilling = require("react-native-billing");


const RUSSIAN_LETTER_ID = 'russianletter';

let strings = new LocalizedStrings({
    "en-US": {
        departure: 'Departure\nfrom:',
        from: 'From:',
        pay: 'Pay',
        payment: 'Payment',
        prices_may_not_include_taxes: '*Prices may not include taxes',
        to: 'To:',
        total: 'Total: '
    },
    en: {
        departure: 'Departure\nfrom:',
        from: 'From:',
        pay: 'Pay',
        payment: 'Payment',
        prices_may_not_include_taxes: '*Prices may not include taxes',
        to: 'To:',
        total: 'Total: '
    },
    ja: {
        departure: 'から出発：',
        from: 'から：',
        pay: '支払う',
        payment: '支払い',
        prices_may_not_include_taxes: '*価格は税金が含まれない場合があります',
        to: 'に：',
        total: '合計: '
    },
    ru: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    },
    be: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    },
    uk: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '
    },
    az: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    },
    hy: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    },
    kk: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    },
    ky: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    },
    tg: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '
    },
    tk: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '
    },
    uz: {
        departure: 'Отправить\nиз',
        from: 'От:',
        pay: 'Оплатить',
        payment: 'Оплата услуги',
        prices_may_not_include_taxes: '*Цены могут не включать налоги',
        to: 'Кому:',
        total: 'Итого: '

    }

});

let envelopesArray;
let block;
let page;

let recipientData = [];

let departureCountryID = null;
let text = '';


let avatarURL;


export default class LetterPurchasingAndSending extends Component {

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
        recipientData = this.props.navigation.state.params.recipientData;
        departureCountryID = this.props.navigation.state.params.departureCountryID;
        text = this.props.navigation.state.params.text;

        envelopesArray = this.props.navigation.state.params.envelopesArray;
        block = this.props.navigation.state.params.block;
        page = this.props.navigation.state.params.page;

        this.state = {
            showProgress: true,

            sender_name: this.props.navigation.state.params.sender_name,
            sender_address: this.props.navigation.state.params.sender_address,
            sender_city: this.props.navigation.state.params.sender_city,
            sender_country: this.props.navigation.state.params.sender_country,
            sender_cca2: this.props.navigation.state.params.sender_cca2,
            sender_zip: this.props.navigation.state.params.sender_zip,
            sender_email: this.props.navigation.state.params.sender_email,

            text: this.props.navigation.state.params.text,

            departureCountry: '',
            picture: null,


            price: ''

        };

    }

    componentWillMount() {
        this.setCountry();
        this.setPicture();
        InAppBilling.open().then(() => this.getProductPrice());
    }

    componentWillUnmount() {
        InAppBilling.close();
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.backToAddress();
            return true;
        });
    }


    backToAddress() {
        this._navigateTo('LetterAddress', {
            envelopesArray: envelopesArray,
            block: block,
            page: page,

            recipientData: recipientData,
            departureCountryID: departureCountryID,
            text: text,
        })
    }

    setCountry() {
        if (departureCountryID === RUSSIAN_LETTER_ID) {

            // do not translate country name
            this.setState({
                departureCountry: 'Russia',
                picture: require("./../assets/russia_land.png")
            });
        } else {
            this.setState({
                departureCountry: 'Japan',
                picture: require("./../assets/japan_land.png")
            });
        }
    }

    setPicture() {

        if (recipientData.photo < 0) {
            avatarURL = 'https://robohash.org/' + recipientData.first_name;
        } else {
            avatarURL = 'http://penpal.eken.live/Api/photo/width/300/id/' + recipientData.photo;
        }
    }

    getProductPrice() {
        try {
            InAppBilling.getProductDetailsArray([departureCountryID])
                .then((details) => {
                    console.log(details);
                    for (let i = 0; i < details.length; i++) {
                        this.setState({
                            price: details[i].priceText,
                        });
                    }
                    this.setState({
                        showProgress: false

                    });
                })
                .then(() => {
                    return InAppBilling.close()
                })
        } catch (e) {
            console.log('BILLING ' + e.message)
        }
    }


    purchaseSending() {
        try {
            InAppBilling.close().then(
                InAppBilling.open()
                    .then(() => InAppBilling.purchase(departureCountryID))
                    .then((details) => {
                        console.log('DETAILS try' + JSON.stringify(details));
                        this.setState({details});
                        this.sendLetter();
                        return InAppBilling.consumePurchase(departureCountryID)
                    })
                    .then((consumed) => {
                        this.setState({consumed});
                        return InAppBilling.close()
                    }))
        } catch (e) {
            console.log('DETAILS err' + e.message);
            InAppBilling.close()
        }
    }


    async sendLetter() {
        try {
            this.setState({
                showProgress: true
            });
            const data = new FormData();
            data.append('first_name', recipientData.first_name);
            data.append('address', recipientData.address);
            data.append('city', recipientData.city);
            data.append('country_name', recipientData.country_name);
            data.append('zip', recipientData.postal);

            data.append('sender_name', this.state.sender_name);
            data.append('sender_address', this.state.sender_address);
            data.append('sender_city', this.state.sender_city);
            data.append('sender_country_name', this.state.sender_country);
            data.append('sender_zip', this.state.sender_zip);
            data.append('email', this.state.sender_email);

            data.append('description', text);

            data.append('departure_country', this.state.departureCountry);

            data.append('card_id', recipientData.id);

            data.append('paper', 0);
            data.append('envelope', 0);
            data.append('post_card', 0);
            data.append('calligraphy', 0);


            await fetch('http://penpal.eken.live//Api/add-request', {
                method: 'post',
                body: data
            }).then(res => {
                if (res.status === 200) {
                    AsyncStorage.removeItem('text');
                    text = '';
                }

            });


        } catch (e) {
            console.log("FAIL " + e.message);

        } finally {
            this._navigateTo('Main', {envelopesArray: envelopesArray, block: block, page: page,});
        }
    }

    render() {


        return (
            <View style={styles.container}>

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
                                          onPress={(e) => this.backToAddress()}>
                            <Image source={require('./../assets/back_white.png')}
                                   style={{
                                       width: 24,
                                       height: 24,
                                       alignSelf: 'center',
                                       margin: 6
                                   }}/>
                        </TouchableOpacity>

                        <Text style={{color: 'white', fontSize: 16, flex: 1}}>
                            {strings.payment}
                        </Text>

                    </View>
                    <Image source={require('./../assets/envelope_background.png')}
                           style={{flex: 1, width: null, height: null, resizeMode: 'stretch'}}>
                        {!this.state.showProgress && <View style={{flex: 1, width: null, height: null}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    marginHorizontal: 14
                                }}>

                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        flexDirection: 'row',
                                        paddingVertical: 14
                                    }}>
                                        <Text style={{flex: 1, color: '#212121'}}>
                                            {strings.to}
                                        </Text>

                                        <View style={{flex: 2}}>
                                            <Text style={{color: '#212121'}}>{recipientData.first_name}</Text>
                                            <Text style={{color: '#212121'}}>{recipientData.address}</Text>
                                            <Text style={{color: '#212121'}}>{recipientData.city}</Text>
                                            <Text style={{color: '#212121'}}>{recipientData.country_name}</Text>
                                            <Text style={{color: '#212121'}}>{recipientData.postal}</Text>
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            alignSelf: 'stretch',
                                            borderColor: '#257492',
                                            borderWidth: 1,
                                            borderRadius: 2
                                        }}>
                                            <Image source={{uri: avatarURL}}
                                                   style={{flex: 1, height: null, width: null, resizeMode: 'contain'}}/>
                                        </View>
                                    </View>

                                    <View/>

                                    <View style={{
                                        alignSelf: 'stretch',
                                        height: 1,
                                        backgroundColor: '#e4e4e4'
                                    }}/>

                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        flexDirection: 'row',
                                        paddingVertical: 14
                                    }}>
                                        <Text style={{flex: 1, color: '#212121'}}>
                                            Текст
                                        </Text>

                                        <View style={{flex: 3}}>
                                            <Text style={{color: '#212121'}}>{this.state.text}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        alignSelf: 'stretch',
                                        height: 1,
                                        backgroundColor: '#e4e4e4'
                                    }}/>

                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        flexDirection: 'row',
                                        paddingVertical: 14
                                    }}>
                                        <Text style={{flex: 1, color: '#212121'}}>
                                            {strings.from}
                                        </Text>

                                        <View style={{flex: 3}}>
                                            <Text style={{color: '#212121'}}>{this.state.sender_name}</Text>
                                            <Text style={{color: '#212121'}}>{this.state.sender_address}</Text>
                                            <Text style={{color: '#212121'}}>{this.state.sender_city}</Text>
                                            <Text style={{color: '#212121'}}>{this.state.sender_country}</Text>
                                            <Text style={{color: '#212121'}}>{this.state.sender_zip}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        alignSelf: 'stretch',
                                        height: 1,
                                        backgroundColor: '#e4e4e4'
                                    }}/>

                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        flexDirection: 'row',
                                        paddingVertical: 14
                                    }}>
                                        <Text style={{flex: 1, color: '#212121'}}>
                                            {strings.departure}
                                        </Text>
                                        <Image source={this.state.picture} style={{flex: 3}}/>
                                    </View>

                                    <View/>

                                </View>
                            </ScrollView>
                            <View style={{alignSelf: 'stretch', bottom: 10, backgroundColor: 'white'}}>
                                <View style={{
                                    alignSelf: 'stretch',
                                    height: 1,
                                    backgroundColor: '#257492',
                                    marginHorizontal: 10
                                }}/>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    margin: 14
                                }}>
                                    <Text style={{color: '#212121', fontSize: 16}}>
                                        {strings.total}
                                    </Text>
                                    <Text style={{color: '#257492', fontSize: 16}}>
                                        {this.state.price + '*'}
                                    </Text>
                                </View>
                                <TouchableOpacity style={{alignSelf: 'flex-end'}}
                                                  onPress={(e) => this.purchaseSending()}>
                                    <Text style={{color: '#257492', fontSize: 20, marginHorizontal: 18}}>
                                        {strings.pay}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{color: '#212121', fontSize: 12, margin: 10}}>
                                    {strings.prices_may_not_include_taxes}
                                </Text>
                            </View>
                        </View>}

                        {this.state.showProgress &&
                        <View style={{
                            flex: 1,
                            alignSelf: "stretch",
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
                        </View>}
                    </Image>
                </View>


            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e4e4',
    }
});


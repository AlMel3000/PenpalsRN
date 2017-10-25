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

import CardView from 'react-native-cardview';

import Orientation from 'react-native-orientation-locker';
import LocalizedStrings from 'react-native-localization';

const InAppBilling = require("react-native-billing");


const PUBLICATION_FREE_STATUS = 0;
const PUBLICATION_PAID_STATUS = 1;


const PUBLICATION_FOR_1_YEAR_ID = '1year';
const PUBLICATION_FOR_3_YEARS_ID = '3years';
const PUBLICATION_FOR_5_YEARS_ID = '5years';
const PUBLICATION_FOR_10_YEARS_ID = '10years';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

let envelopesArray;
let block;
let page;

let photo;

let name;
let address;
let city;
let country;
let cca2;
let zip;
let email;
let description;

let strings = new LocalizedStrings({
    "en-US": {
        _10_years: "10 years",
        _3_years: '3 years',
        _5_years: '5 years',
        year: '1 year',
        free_1_month: '1 month',
        free: 'Free',
        placing_period: 'Choose a period placing of envelope',
        prices_may_not_include_taxes: '*Prices may not include taxes'
    },
    en: {
        _10_years: "10 years",
        _3_years: '3 years',
        _5_years: '5 years',
        year: '1 year',
        free_1_month: '1 month',
        free: 'Free',
        placing_period: 'Choose a period placing of envelope',
        prices_may_not_include_taxes: '*Prices may not include taxes'
    },
    ja: {
        _10_years: "10年",
        _3_years: '3年',
        _5_years: '5年',
        year: '1年',
        free_1_month: '1ヶ月',
        free: '無料',
        placing_period: '封筒の表示期間を選択します。',
        prices_may_not_include_taxes: '*価格は税金が含まれない場合があります'
    },
    ru: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'
    },
    be: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'
    },
    uk: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'

    },
    az: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'

    },
    hy: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'
    },
    kk: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'

    },
    ky: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'

    },
    tg: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'
    },
    tk: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'

    },
    uz: {
        _10_years: "10 лет",
        _3_years: '3 года',
        _5_years: '5 лет',
        year: '1 год',
        free_1_month: '1 месяц',
        free: 'Бесплатно',
        placing_period: 'Выбирайте период размещения конверта',
        prices_may_not_include_taxes: '*Цены могут не включать налоги'
    }

});


export default class EnvelopePublication extends Component {

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
        InAppBilling.open().then(() => this.getProductPrice());
        this.getEnvelopeAppearanceAndInfo();
    }

    componentWillUnmount() {
        InAppBilling.close();
    }

    constructor(props) {
        super(props);
        photo = this.props.navigation.state.params.photo;

        name = this.props.navigation.state.params.name;
        address = this.props.navigation.state.params.address;
        city = this.props.navigation.state.params.city;
        country = this.props.navigation.state.params.country;
        cca2 = this.props.navigation.state.params.cca2;
        zip = this.props.navigation.state.params.zip;
        email = this.props.navigation.state.params.email;
        description = this.props.navigation.state.params.description;

        envelopesArray = this.props.navigation.state.params.envelopesArray;
        block = this.props.navigation.state.params.block;
        page = this.props.navigation.state.params.page;

        this.state = {

            showProgress: true,

            envelopeN: 0,
            stampN: 0,
            sealN: 0,

            publicationFor1Year: '',
            publicationFor3Years: '',
            publicationFor5Years: '',
            publicationFor10Years: ''

        };

    }

    getProductPrice() {
        try {
            InAppBilling.getProductDetailsArray([PUBLICATION_FOR_1_YEAR_ID, PUBLICATION_FOR_3_YEARS_ID, PUBLICATION_FOR_5_YEARS_ID, PUBLICATION_FOR_10_YEARS_ID])
                .then((details) => {
                    console.log(details);
                    for (let i = 0; i < details.length; i++) {

                        switch (details[i].productId) {
                            case PUBLICATION_FOR_3_YEARS_ID:
                                this.setState({
                                    publicationFor3Years: details[i].priceText,
                                });
                                break;
                            case PUBLICATION_FOR_5_YEARS_ID:
                                this.setState({
                                    publicationFor5Years: details[i].priceText,
                                });
                                break;
                            case PUBLICATION_FOR_10_YEARS_ID:
                                this.setState({
                                    publicationFor10Years: details[i].priceText,
                                });
                                break;
                            default:
                                this.setState({
                                    publicationFor1Year: details[i].priceText,
                                });
                        }

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

    async getEnvelopeAppearanceAndInfo() {
        try {
            this.setState({
                id: 1,

                pic: JSON.parse(await AsyncStorage.getItem('photo')),

                envelope: JSON.parse(await AsyncStorage.getItem('envelope')),
                stamp: JSON.parse(await AsyncStorage.getItem('stamp')),
                seal: JSON.parse(await AsyncStorage.getItem('seal')),
            });


        } catch (message) {
            console.log(message + '  ' + JSON.stringify(this.state.usersEnvelope))
        }
    }

    purchasePublication(tariffID) {
        try {
            InAppBilling.close().then(
                InAppBilling.open()
                    .then(() => InAppBilling.purchase(tariffID))
                    .then((details) => {
                        console.log('DETAILS try' + JSON.stringify(details));
                        this.setState({details});
                        this.publish(tariffID);
                        return InAppBilling.consumePurchase(tariffID)
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

    publish(tariff) {

        if (tariff === PUBLICATION_FREE_STATUS) {
            this.uploadCard(PUBLICATION_FREE_STATUS, null);
        } else if (tariff === PUBLICATION_FOR_1_YEAR_ID) {
            this.uploadCard(PUBLICATION_PAID_STATUS, "basic");
        } else if (tariff === PUBLICATION_FOR_3_YEARS_ID) {
            this.uploadCard(PUBLICATION_PAID_STATUS, "long");
        } else if (tariff === PUBLICATION_FOR_5_YEARS_ID) {
            this.uploadCard(PUBLICATION_PAID_STATUS, "extreme");
        } else {
            this.uploadCard(PUBLICATION_PAID_STATUS, "eternal");
        }
    }

    componentDidMount() {
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this._navigateTo('EnvelopePreview', {
                envelopesArray: envelopesArray,
                block: block,
                page: page,

                photo: photo,

                name: name,
                address: address,
                city: city,
                country: country,
                cca2: cca2,
                zip: zip,
                email: email,
                description: description
            });
            return true;
        });
    }

    async uploadCard(status: number, type) {
        try {
            this.setState({
                showProgress: true
            });
            const data = new FormData();
            data.append('first_name', name);
            data.append('gender', 2);
            data.append('address', address);
            data.append('city', city);
            data.append('country', cca2);
            data.append('postal', zip);
            data.append('description', description);
            data.append('email', email);
            data.append('envelope', this.state.envelope);
            data.append('stamp', this.state.stamp);
            data.append('seal', this.state.seal);
            data.append('paid', status);
            data.append('plan', type);
            if (this.state.pic) {
                data.append('photo', {
                    uri: this.state.pic.uri,
                    type: 'image/*',
                    name: 'user'
                });
            }

            await fetch('http://penpal.eken.live//Api/card', {
                method: 'post',
                body: data
            }).then(res => {
                if (res.status === 200) {
                    AsyncStorage.multiRemove(['name', 'address', 'city', 'country', 'cca2', 'zip', 'description', 'email', 'photo']);
                }

            });


        } catch (e) {
            console.log("FAIL " + e.message);

        } finally {
            this.saveAndGo()
                .then(this._navigateTo('Main'));
        }
    }

    async saveAndGo() {
        await AsyncStorage.setItem('lastCardOfUser', JSON.stringify(email));
        await AsyncStorage.setItem('page', JSON.stringify(0));
    }



    render() {


        return (
            <View style={styles.container}>
                {!this.state.showProgress &&
                <View style={{flex: 1}}>
                    <Text style={{alignSelf: 'center', fontSize: 20}}>{strings.placing_period}</Text>
                    <ScrollView horizontal={true} style={{flex: 1, alignSelf: 'stretch'}}
                                showsHorizontalScrollIndicator={false}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>

                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                margin: 2,
                                flexDirection: 'column'
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>
                                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
                                                  onPress={(e) => this.publish(PUBLICATION_FREE_STATUS)}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 8
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 138,
                                            height: 48,
                                            backgroundColor: '#757575',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                                  cardElevation={4}
                                                  cardMaxElevation={4}
                                                  cornerRadius={4}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 20,
                                                alignSelf: 'center',
                                                marginRight: 10,
                                                marginBottom: 18
                                            }}>
                                                {strings.free_1_month}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/clock_757575.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>

                                    <View style={{height: 1, width: 144, marginRight: 2, backgroundColor: '#e0e0e0'}}/>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/credit-card-off_757575.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginRight: 8,
                                            marginBottom: 16
                                        }}>
                                            {strings.free}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>


                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                marginVertical: 2,
                                marginRight: 2,
                                flexDirection: 'column'
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>
                                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
                                                  onPress={(e) => this.purchasePublication(PUBLICATION_FOR_1_YEAR_ID)}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 8
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 138,
                                            height: 48,
                                            backgroundColor: '#ad944a',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                                  cardElevation={4}
                                                  cardMaxElevation={4}
                                                  cornerRadius={4}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 20,
                                                alignSelf: 'center',
                                                marginRight: 10,
                                                marginBottom: 18
                                            }}>
                                                {strings.year}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/clock_ad944a.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>

                                    <View style={{height: 1, width: 144, marginRight: 2, backgroundColor: '#e0e0e0'}}/>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/credit-card_ad944a.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <Text style={{
                                            color: '#ad944a',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginRight: 8,
                                            marginBottom: 16
                                        }}>
                                            {this.state.publicationFor1Year + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>


                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                marginVertical: 2,
                                marginRight: 2,
                                flexDirection: 'column'
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>
                                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
                                                  onPress={(e) => this.purchasePublication(PUBLICATION_FOR_3_YEARS_ID)}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 8
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 138,
                                            height: 48,
                                            backgroundColor: '#cfa72e',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                                  cardElevation={4}
                                                  cardMaxElevation={4}
                                                  cornerRadius={4}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 20,
                                                alignSelf: 'center',
                                                marginRight: 10,
                                                marginBottom: 18
                                            }}>
                                                {strings._3_years}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/clock_cfa72e.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>

                                    <View style={{height: 1, width: 144, marginRight: 2, backgroundColor: '#e0e0e0'}}/>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/credit-card_cfa72e.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <Text style={{
                                            color: '#cfa72e',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginRight: 8,
                                            marginBottom: 16
                                        }}>
                                            {this.state.publicationFor3Years + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>


                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                marginVertical: 2,
                                marginRight: 2,
                                flexDirection: 'column'
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>
                                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
                                                  onPress={(e) => this.purchasePublication(PUBLICATION_FOR_5_YEARS_ID)}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 8
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 138,
                                            height: 48,
                                            backgroundColor: '#f0bd24',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                                  cardElevation={4}
                                                  cardMaxElevation={4}
                                                  cornerRadius={4}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 20,
                                                alignSelf: 'center',
                                                marginRight: 10,
                                                marginBottom: 18
                                            }}>
                                                {strings._5_years}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/clock_f0bd24.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>

                                    <View style={{height: 1, width: 144, marginRight: 2, backgroundColor: '#e0e0e0'}}/>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/credit-card_f0bd24.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <Text style={{
                                            color: '#f0bd24',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginRight: 8,
                                            marginBottom: 16
                                        }}>
                                            {this.state.publicationFor5Years + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>


                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                marginVertical: 2,
                                marginRight: 2,
                                flexDirection: 'column'
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>
                                <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}

                                                  onPress={(e) => this.purchasePublication(PUBLICATION_FOR_10_YEARS_ID)}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 8
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 138,
                                            height: 48,
                                            backgroundColor: '#ffc107',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                                  cardElevation={4}
                                                  cardMaxElevation={4}
                                                  cornerRadius={4}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 20,
                                                alignSelf: 'center',
                                                marginRight: 10,
                                                marginBottom: 18
                                            }}>
                                                {strings._10_years}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/clock_ffc107.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>

                                    <View style={{height: 1, width: 144, marginRight: 2, backgroundColor: '#e0e0e0'}}/>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <View style={{flex: 1}}/>
                                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('./../assets/credit-card_ffc107.png')} style={{
                                                flex: 1, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <View style={{flex: 1}}/>
                                        <Text style={{
                                            color: '#ffc107',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginRight: 8,
                                            marginBottom: 16
                                        }}>
                                            {this.state.publicationFor10Years + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>


                        </View>
                    </ScrollView>
                    <Text style={{alignSelf: 'center', bottom: 4}}>{strings.prices_may_not_include_taxes}</Text>
                </View>}

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
        resizeMode: 'contain',
        height: null,
        width: null
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


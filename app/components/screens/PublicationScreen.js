import {AsyncStorage, BackHandler, Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import RotatingView from './../assets/RotatingView';

import CardView from 'react-native-cardview';

import Orientation from 'react-native-orientation-locker';

const InAppBilling = require("react-native-billing");

const PUBLICATION_FOR_1_YEAR_ID = '1year';
const PUBLICATION_FOR_3_YEARS_ID = '3years';
const PUBLICATION_FOR_5_YEARS_ID = '5years';
const PUBLICATION_FOR_10_YEARS_ID = '10years';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];

let scrollToFirst = false;

let userEmails = [];

let block = 1;

let envelopeData;

let photo;


export default class PublicationScreen extends Component {

    static navigationOptions = {
        header: false
    };

    onRefresh = () => {
        this.reloadResources();
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
        envelopeData = this.props.navigation.state.params.envelopesData;
        envelopesArray = envelopeData;
        block = this.props.navigation.state.params.block;
        userEmails = this.props.navigation.state.params.userEmails;
        scrollToFirst = this.props.navigation.state.params.scrollToFirst;
        photo = this.props.navigation.state.params.photo;

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

    componentWillMount() {
        InAppBilling.open().then(() => this.getProductPrice());
        this.getEnvelopeAppearanceAndInfo();
    }

    componentDidMount() {
        Orientation.unlockAllOrientations();
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this._navigateTo('EnvelopePreview', {
                envelopesData: envelopesArray,
                block: block,
                userEmails: userEmails,
                scrollToFirst: false,
                photo: photo
            });
            return true;
        });
    }

    componentWillUnmount() {
        InAppBilling.close();
    }

    getProductPrice() {
        try {
            InAppBilling.getProductDetailsArray([PUBLICATION_FOR_1_YEAR_ID, PUBLICATION_FOR_3_YEARS_ID, PUBLICATION_FOR_5_YEARS_ID, PUBLICATION_FOR_10_YEARS_ID])
                .then((details) => {
                    this.setState({
                        publicationFor1Year: details[0].priceText,
                        publicationFor3Years: details[1].priceText,
                        publicationFor5Years: details[2].priceText,
                        publicationFor10Years: details[3].priceText,
                        showProgress: false

                    });
                })
                .then(() => {
                    return InAppBilling.close()
                })
        } catch (error) {
            console.log('BILLING ' + error)
        }
    }

    async getEnvelopeAppearanceAndInfo() {
        try {
            this.setState({
                id: 1,
                first_name: JSON.parse(await AsyncStorage.getItem('name')),
                address: JSON.parse(await AsyncStorage.getItem('address')),
                city: JSON.parse(await AsyncStorage.getItem('city')),
                country_name: JSON.parse(await AsyncStorage.getItem('country')),
                postal: JSON.parse(await AsyncStorage.getItem('zip')),
                description: JSON.parse(await AsyncStorage.getItem('description')),
                envelope: JSON.parse(await AsyncStorage.getItem('envelope')),
                stamp: JSON.parse(await AsyncStorage.getItem('stamp')),
                seal: JSON.parse(await AsyncStorage.getItem('seal')),
            });

        } catch (message) {
            console.log(message + '  ' + JSON.stringify(this.state.usersEnvelope))
        }
    }


    render() {


        return (
            <View style={styles.container}>
                {!this.state.showProgress &&
                <View style={{flex: 1}}>
                    <Text style={{alignSelf: 'center'}}>Выбирайте период размещения конверта</Text>
                    <ScrollView horizontal={true} style={{flex: 1, alignSelf: 'stretch'}}
                                showsHorizontalScrollIndicator={false}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>

                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                margin: 8,
                                flexDirection: 'column'
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>

                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                    <CardView style={{
                                        marginHorizontal: 16,
                                        top: 16,
                                        height: 32,
                                        backgroundColor: '#757575'
                                    }}
                                              cardElevation={4}
                                              cardMaxElevation={4}
                                              cornerRadius={4}>
                                    </CardView>
                                </View>

                                <View style={{height: 1, marginHorizontal: 8, backgroundColor: '#e0e0e0'}}/>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>


                                </View>
                            </CardView>

                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 160,
                                margin: 8
                            }}
                                      cardElevation={2}
                                      cardMaxElevation={2}
                                      cornerRadius={2}>
                                <Text>{this.state.publicationFor1Year}</Text>
                            </CardView>
                        </View>
                    </ScrollView>
                    <Text style={{alignSelf: 'center', bottom: 4}}>*Цены могут не включать налоги</Text>
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


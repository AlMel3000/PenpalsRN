import {
    Alert,
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

const InAppBilling = require("react-native-billing");


const PUBLICATION_FREE_STATUS = 0;
const PUBLICATION_PAID_STATUS = 1;


const RUSSIAN_LETTER_ID = 'russianletter';
const JAPANESE_LETTER_ID = 'japanletter';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];

let scrollToFirst = false;

let userEmails = [];

let block = 1;

let envelopeData;


export default class LetterDeparture extends Component {

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
        /*envelopeData = this.props.navigation.state.params.envelopesData;
        envelopesArray = envelopeData;
        block = this.props.navigation.state.params.block;
        userEmails = this.props.navigation.state.params.userEmails;
        scrollToFirst = this.props.navigation.state.params.scrollToFirst;*/

        this.state = {

            showProgress: true,

            russianLetter: '',
            japaneseLetter: ''

        };

    }

    componentWillMount() {
        InAppBilling.open().then(() => this.getProductPrice());
    }

    componentWillUnmount() {
        InAppBilling.close();
    }

    componentDidMount() {
        Orientation.unlockAllOrientations();
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.backToMain();
            return true;
        });
    }

    getProductPrice() {
        try {
            InAppBilling.getProductDetailsArray([RUSSIAN_LETTER_ID, JAPANESE_LETTER_ID])
                .then((details) => {
                    console.log(details);
                    for (let i = 0; i < details.length; i++) {

                        switch (details[i].productId) {
                            case RUSSIAN_LETTER_ID:
                                this.setState({
                                    russianLetter: details[i].priceText,
                                });
                                break;
                            case JAPANESE_LETTER_ID:
                                this.setState({
                                    japaneseLetter: details[i].priceText,
                                });
                                break;
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

    backToMain() {
        this._navigateTo('Main', {
            envelopesData: envelopesArray,
            block: block,
            userEmails: userEmails,
            scrollToFirst: false
        });
    }

    navigateToTextFilling(selectedCountry: string) {
        this._navigateTo('LetterText', {
            envelopesData: envelopesArray,
            block: block,
            userEmails: userEmails,
            scrollToFirst: false,
            departureCountryID: selectedCountry
        });
    }

    _showHelp() {
        Alert.alert(
            '',
            '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
            [
                {text: 'OК'}
            ],
            {cancelable: true}
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.showProgress &&
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flex: 0}}
                                          onPress={(e) => this.backToMain()}>
                            <Image source={require('./../assets/back_gray.png')}
                                   style={{
                                       width: 24,
                                       height: 24,
                                       alignSelf: 'center',
                                       margin: 6
                                   }}/>
                        </TouchableOpacity>
                        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                            <Text style={{fontSize: 20}}>Страна отправки письма</Text>
                        </View>

                        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flex: 0}}
                                          onPress={(e) => this._showHelp()}>
                            <Image source={require('./../assets/help-circle.png')}
                                   style={{
                                       width: 24,
                                       height: 24,
                                       alignSelf: 'center',
                                       margin: 6,
                                   }}/>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal={true} style={{flex: 1, alignSelf: 'stretch'}}
                                showsHorizontalScrollIndicator={false}>
                        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>


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
                                                  onPress={(e) => this.backToMain()}>
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
                                                Моя страна
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1, paddingVertical: 16, marginRight: 14, marginLeft: 10}}>
                                            <Text style={{flex: 1, width: 132}}>
                                                {'1.Возьмите ручку\n2.Чистый лист бумаги\n3.Напишите письмо\n4.Заполните конверт, не забудьте свой обратный адрес\n5.Идите на почту и отправьте письмо другу'}
                                            </Text>
                                        </View>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginBottom: 8
                                        }}>
                                            Бесплатно
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
                                                  onPress={(e) => this.navigateToTextFilling(RUSSIAN_LETTER_ID)}>
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
                                                Россия
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1, paddingVertical: 16, marginRight: 14, marginLeft: 10}}>
                                            <Image source={require('./../assets/russia.png')} style={{
                                                flex: 1, width: 130, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginBottom: 8
                                        }}>
                                            {this.state.russianLetter + '*'}
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
                                                  onPress={(e) => this.navigateToTextFilling(JAPANESE_LETTER_ID)}>
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
                                                Япония
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1, paddingVertical: 16, marginRight: 14, marginLeft: 10}}>
                                            <Image source={require('./../assets/japan.png')} style={{
                                                flex: 1, width: 130, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            marginBottom: 8
                                        }}>
                                            {this.state.japaneseLetter + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
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


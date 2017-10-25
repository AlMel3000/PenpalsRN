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
import LocalizedStrings from 'react-native-localization';

const InAppBilling = require("react-native-billing");



const RUSSIAN_LETTER_ID = 'russianletter';
const JAPANESE_LETTER_ID = 'japanletter';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

let strings = new LocalizedStrings({
    "en-US": {
        direct_mail_help: '\t\tThis feature will allow you with the comfort of home send a letter to a friend from whom\'s envelope you have clicked  "Send letter."\n\t\tYou choose the country from which your letter will be sent. List of countries from which we can send letters is small, but we\'ll expand it in the future.\n\t\tWrite letter\'s text on the next screen and provide your return address. Penpals employees will print out your letter, fill out an envelope and send it on your behalf.',
        japan: 'Japan',
        my_location: 'My country',
        you_will_not_be_charged_at_this_stage: '*You will not be charged at this stage',
        russia: 'Russia',
        select_a_country_of_departure_letter: 'Letter departure country',
        take_a_pen: '1.Take a pen\n' +
        '2.Empty sheet of paper\n' +
        '3.Write a letter\n' +
        '4.Fill the envelope, do not forget your return address\n' +
        '5.Go to the post office and send a letter to a friend'
    },
    en: {
        direct_mail_help: '\t\tThis feature will allow you with the comfort of home send a letter to a friend from whom\'s envelope you have clicked  "Send letter".\n\t\tYou choose the country from which your letter will be sent. List of countries from which we can send letters is small, but we\'ll expand it in the future.\n\t\tWrite letter\'s text on the next screen and provide your return address. Penpals employees will print out your letter, fill out an envelope and send it on your behalf.',
        japan: 'Japan',
        my_location: 'My country',
        you_will_not_be_charged_at_this_stage: '*You will not be charged at this stage',
        russia: 'Russia',
        select_a_country_of_departure_letter: 'Letter departure country',
        take_a_pen: '1.Take a pen\n' +
        '2.Empty sheet of paper\n' +
        '3.Write a letter\n' +
        '4.Fill the envelope, do not forget your return address\n' +
        '5.Go to the post office and send a letter to a friend'
    },
    ja: {
        direct_mail_help: '\t\tこの機能を使うと、送りたい相手の封筒から「手紙を送る」をクリックして家にいながら手紙を送ることが可能になります。\n\t\tあなたは自分の手紙をどこの国から発送したいか選択します。発送できる国はまだ少ないですが、私たちは将来的に拡張していきます。 \t\t 次の画面で手紙の内容を書いていきます。そして、あなたの返信先住所を入力します。Penpalsの従業員は、あなたの手紙を印刷して封筒に必要事項を記入し、あなたに代わって発送します。',
        japan: '日本',
        my_location: '私の国',
        you_will_not_be_charged_at_this_stage: '*あなたは、この段階で課金されることはありません',
        russia: 'ロシア',
        select_a_country_of_departure_letter: '手紙を発送する国',
        take_a_pen: '1.ペンを手に取ります。 \n' +
        '2.紙を用意します。 \n' +
        '3.手紙を書きます。 \n' +
        '4.封筒に書きます。あなたの返信用住所を書き忘れないでください。 \n' +
        '5.郵便局言って友達に手紙を送ります。'
    },
    ru: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'
    },
    be: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'

    },
    uk: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'
    },
    az: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'
    },
    hy: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'
    },
    kk: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'
    },
    ky: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'

    },
    tg: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'
    },
    tk: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'

    },
    uz: {
        direct_mail_help: '\t\tЭта функция позволит Вам не выходя из дома отправить письмо Другу, с конверта которого Вы нажали \"Отправить письмо\".\n\t\tВы выбираете страну из которой будет отправлено Ваше письмо. Список стран из которых мы можем отправлять письма пока небольшой, но мы обязательно расширим его в будущем.\n\t\tПишите текст письма на следующем экране, и укажите Ваш обратный адрес. Сотрудники Penpals распечатают Ваше письмо, заполнят конверт и отправят его за Вас.',
        japan: 'Япония',
        my_location: 'Моя страна',
        you_will_not_be_charged_at_this_stage: '*Вы не будете платить на данном этапе',
        russia: 'Россия',
        select_a_country_of_departure_letter: 'Страна отправки письма',
        take_a_pen: '1.Возьмите ручку\n' +
        '2.Чистый лист бумаги\n' +
        '3.Напишите письмо\n' +
        '4.Заполните конверт, не забудьте свой обратный адрес\n' +
        '5.Идите на почту и отправьте письмо другу'

    }

});

let envelopesArray;
let block;
let page;

let recipientData = [];

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

        envelopesArray = this.props.navigation.state.params.envelopesArray;
        block = this.props.navigation.state.params.block;
        page = this.props.navigation.state.params.page;

        recipientData = this.props.navigation.state.params.recipientData;

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
        this._navigateTo('Main', {envelopesArray: envelopesArray, block: block, page: page});
    }

    navigateToTextFilling(selectedCountry: string) {
        this._navigateTo('LetterText', {
            envelopesArray: envelopesArray,
            block: block,
            page: page,

            recipientData: recipientData,
            departureCountryID: selectedCountry
        });
    }

    _showHelp() {
        Alert.alert(
            '',
            strings.direct_mail_help,
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
                            <Text style={{fontSize: 20}}>{strings.select_a_country_of_departure_letter}</Text>
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
                                width: 172,
                                marginVertical: 2,
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
                                        padding: 4
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 150,
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
                                                {strings.my_location}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1, paddingVertical: 4, marginRight: 2, marginLeft: 0}}>
                                            <Text style={{flex: 1, width: 138}}>
                                                {strings.take_a_pen}
                                            </Text>
                                        </View>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            bottom: 8
                                        }}>
                                            Бесплатно
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>

                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 172,
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
                                        padding: 4
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 150,
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
                                        <View style={{flex: 1, paddingVertical: 4, marginRight: 2, marginLeft: 0}}>
                                            <Image source={require('./../assets/russia.png')} style={{
                                                flex: 1, width: 138, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            bottom: 8
                                        }}>
                                            {this.state.russianLetter + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>

                            <CardView style={{
                                backgroundColor: '#FFFFFF',
                                flex: 1,
                                width: 172,
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
                                        padding: 4
                                    }}>
                                        <CardView style={{
                                            flex: 0,
                                            top: 0,
                                            marginRight: 4,
                                            width: 150,
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
                                                {strings.japan}
                                            </Text>

                                        </CardView>
                                        <View style={{flex: 1, paddingVertical: 4, marginRight: 2, marginLeft: 0}}>
                                            <Image source={require('./../assets/japan.png')} style={{
                                                flex: 1, width: 138, resizeMode: 'contain'
                                            }}/>
                                        </View>
                                        <Text style={{
                                            color: '#757575',
                                            fontSize: 20,
                                            alignSelf: 'center',
                                            bottom: 8
                                        }}>
                                            {this.state.japaneseLetter + '*'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </CardView>
                        </View>
                    </ScrollView>
                    <Text
                        style={{alignSelf: 'center', bottom: 4}}>{strings.you_will_not_be_charged_at_this_stage}</Text>
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


import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';


import {AsyncStorage, Dimensions, Image, Linking, Text, TouchableOpacity, View,} from 'react-native';

import RotatingView from './../assets/RotatingView';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

const BLOCKS_RANGE_FOR_RANDOMIZATION = 100;
const ENVELOPES_AMOUNT_PER_BLOCK = 50;

let envelopesArray = [];
let userEmails =[];

let block = 1;


let savedBlock;
let blocksAvailable;


export default class LoadingScreen extends Component {

    static navigationOptions = {
        header: false
    };


    constructor(props) {
        super(props);

        this.state = {
            showProgress: true,
            showError: false
        };
    }

    componentWillMount() {
        this.getUserStatus()
    }

    componentDidMount() {
    }

    async getUserStatus() {
        try {
            savedBlock = JSON.parse(await AsyncStorage.getItem('block'));

            let lastCardOfUser = JSON.parse(await AsyncStorage.getItem('lastCardOfUser'));

            userEmails = JSON.parse(await AsyncStorage.getItem('userEmails'));
            console.log(userEmails);

            if (await savedBlock !== null) {
                block = savedBlock;
                if (await lastCardOfUser === null) {
                    this.getCards();
                } else {
                    this.getLastCardOfUser(lastCardOfUser);
                }

            } else {
                block = this.randomizer(BLOCKS_RANGE_FOR_RANDOMIZATION);
                await this.getCards();
            }

        } catch (message) {
            console.log(message);
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
            this.getCards()
        }
    }

    async getCards() {
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
                    showProgress: false
                });
                console.log(JSON.stringify(envelopesArray));
                this._navigateTo('Main', {envelopesData: envelopesArray, block: block, userEmails: userEmails, scrollToFirst: false});
            } else {
                this.setState({
                    showProgress: false,
                    showError: true
                });
            }
        } catch (message) {
            console.log(message);
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


    _navigateTo = (routeName, params) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName, params})]
        });
        this.props.navigation.dispatch(resetAction)
    };

    render() {
        return (
            <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                flex: 1,
                width: deviceWidth,
                height: deviceHeight,
                alignSelf: "stretch",
                resizeMode: 'stretch',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {this.state.showProgress &&
                        <RotatingView
                            style={{height: 48, width: 48, alignSelf: 'center'}}
                            duration={3000}
                            onFinishedAnimating={( (status) => {console.log(status)} )}>
                            <Image
                                style={{height:'100%', width: '100%', resizeMode: 'contain'}}
                                resizeMode='contain'
                                source={require("./../assets/enveolopes_loading_48_px.png")}/>
                        </RotatingView>}
                {this.state.showError &&
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
                            'С наилучшими пожеланиями, Ваш Penpal.\n' +
                            '\n---------------------------------------------------------------')}>
                        <Text
                            style={{flex: 3, alignSelf: 'center', color: '#212121', width: deviceWidth, fontSize: 16}}>
                            {'По любым вопросам Вы можете написать нам:'}
                        </Text>
                        <Text
                            style={{flex: 2, alignSelf: 'center', color: '#1ca9c9', width: deviceWidth, fontSize: 16}}>
                            {'119@penpal.eken.live'}
                        </Text>
                    </TouchableOpacity>
                </View>}
            </Image>
        );
    }

}


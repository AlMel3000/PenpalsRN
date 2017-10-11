import {
    AsyncStorage,
    BackHandler,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    VirtualizedList
} from 'react-native';

import React, {Component} from 'react';

import {NavigationActions} from 'react-navigation';

import RotatingView from './../assets/RotatingView';

import * as ImageCache from "react-native-img-cache";
import {CachedImage} from "react-native-img-cache";

import CardView from 'react-native-cardview';

import Orientation from 'react-native-orientation-locker';


var TimerMixin = require('react-timer-mixin');

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];

let scrollToFirst = false;

let userEmails = [];

let block = 1;

let envelopeData;

let photo;

let name;
let address;
let city;
let country;
let cca2;
let zip;
let email;
let description;

export default class EnvelopePreview extends Component {

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

        name = this.props.navigation.state.params.name;
        address = this.props.navigation.state.params.address;
        city = this.props.navigation.state.params.city;
        country = this.props.navigation.state.params.country;
        cca2 = this.props.navigation.state.params.cca2;
        zip = this.props.navigation.state.params.zip;
        email = this.props.navigation.state.params.email;
        description = this.props.navigation.state.params.description;

        this.state = {
            refreshing: false,

            showProgress: true,

            name: null,
            address: null,
            city: null,
            country: null,
            zip: null,
            description: null,

            photo: '',

            usersEnvelope: [],

            envelopeN: 0,
            stampN: 0,
            sealN: 0

        };

        this.renderEnvelope = this.renderEnvelope.bind(this);

    }

    componentWillUnmount() {
        this.saveEnvelopeAppearance();
    }

    componentWillMount() {
        this.getEnvelopeAppearanceAndInfo()
    }

    componentDidMount() {
        Orientation.unlockAllOrientations();
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () => {
            this._navigateTo('EnvelopeFillingScreen', {
                envelopesData: envelopesArray,
                block: block,
                userEmails: userEmails,
                scrollToFirst: false
            });
            return true;
        });
    }

    async getEnvelopeAppearanceAndInfo() {
        try {

            let envelopeNumber = (Math.floor(Math.random() * 340));
            let envelopeURL;
            if (envelopeNumber < 10) {
                envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=00' + envelopeNumber;
            } else if (envelopeNumber > 9 && envelopeNumber < 100) {
                envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=0' + envelopeNumber;
            } else {
                envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=' + envelopeNumber;
            }

            let stampNumber = (Math.floor(Math.random() * 340));
            let stampURL;
            if (stampNumber < 10) {
                stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=00' + stampNumber;
            } else if (stampNumber > 9 && stampNumber < 100) {
                stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=0' + stampNumber;
            } else {
                stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=' + stampNumber;
            }

            let sealNumber = (Math.floor(Math.random() * 360));
            let sealURL;
            if (sealNumber < 10) {
                sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=00' + sealNumber;
            } else if (sealNumber > 9 && sealNumber < 100) {
                sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=0' + sealNumber;
            } else {
                sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=' + sealNumber;
            }





            this.setState({
                usersEnvelope: [{
                    type: "card",
                    data: {
                        id: 1,
                        first_name: name,
                        address: address,
                        city: city,
                        country_name: country,
                        postal: zip,
                        description: description,
                    },
                    resources: {
                        envelope: envelopeURL,
                        stamp: stampURL,
                        seal: sealURL
                    }
                }],

                envelopeN: envelopeNumber,
                stampN: stampNumber,
                sealN: sealNumber

            });

        } catch (message) {
            console.log(message + '  ' + JSON.stringify(this.state.usersEnvelope))
        }


    }

    reloadResources() {
        TimerMixin.requestAnimationFrame(() => {
            ImageCache.ImageCache.get().clear();
            this.setState({refreshing: true, showProgress: true, usersEnvelope: []});
            this.getEnvelopeAppearanceAndInfo();
            this.setState({refreshing: false});
        })
    }

    async saveEnvelopeAppearance() {
        try {
            await AsyncStorage.setItem('envelope', JSON.stringify(this.state.envelopeN));
            await AsyncStorage.setItem('stamp', JSON.stringify(this.state.stampN));
            await AsyncStorage.setItem('seal', JSON.stringify(this.state.sealN));

        } catch (error) {
        }
    }

    publish() {
        this.saveEnvelopeAppearance();
        this._navigateTo('PublicationScreen', {
            envelopesData: envelopesArray,
            block: block,
            userEmails: userEmails,
            scrollToFirst: false,
            photo: photo,
            name: name,
            address: address,
            city: city,
            country: country,
            cca2: cca2,
            zip: zip,
            email: email,
            description: description
        })
    }

    renderEnvelope(envelope) {

        let stampRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";
        let sealRotation = (Math.floor(Math.random() * (10) - 5)) + "deg";

        return (
            <View style={styles.viewPager}>
                <CachedImage source={{uri: envelope.item.resources.envelope, cache: 'reload'}} mutable
                             style={styles.envelopeImage}
                             onLoadEnd={(e) => this.setState({showProgress: false})}>
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
                            <Image source={photo} style={styles.userPhoto}/>
                            <CachedImage source={{uri: envelope.item.resources.stamp}} mutable style={{
                                height: deviceHeight / 5,
                                width: deviceWidth / 4,
                                resizeMode: 'contain',
                                transform: [{rotate: stampRotation}],
                                alignSelf: 'center',
                                left: deviceWidth / 6,
                                position: 'absolute'
                            }}/>
                            <CachedImage source={{uri: envelope.item.resources.seal}} mutable style={{
                                height: deviceHeight / 5,
                                width: deviceWidth / 5,
                                resizeMode: 'contain',
                                alignSelf: 'center',
                                left: deviceWidth / 6,
                                position: 'absolute',
                                transform: [{rotate: sealRotation}]
                            }}/>
                        </View>
                    </View>
                    <View
                        style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
                        <View style={{flex: 1, width: deviceWidth / 2}}/>
                        <View style={{
                            flex: 1,
                            width: deviceWidth / 2,
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
                </CachedImage>


                <CardView style={{
                    backgroundColor: '#707070',
                    alignItems: 'center', justifyContent: 'center',
                    paddingHorizontal: 16, paddingVertical: 4,
                    position: 'absolute',
                    left: 8, top: 12,
                }}
                          cardElevation={2}
                          cardMaxElevation={2}
                          cornerRadius={4}>
                    <Text style={{color: 'white', marginBottom: 8}}>
                        Так будет выглядеть конверт после публикации
                    </Text>
                </CardView>


                <View style={{
                    flex: 0,
                    position: 'absolute',
                    left: 12, bottom: 12, flexDirection: 'row'
                }}>
                    <CardView style={{
                        backgroundColor: '#EEEEEE',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                              cardElevation={2}
                              cardMaxElevation={2}
                              cornerRadius={4}>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                          onPress={(e) => this._navigateTo('EnvelopeFillingScreen', {
                                              envelopesData: envelopesArray,
                                              block: block,
                                              userEmails: userEmails,
                                              scrollToFirst: false
                                          })}>
                            <Image source={require('./../assets/back.png')}
                                   style={{
                                       width: 40,
                                       height: 40,
                                       alignSelf: 'center',
                                       marginBottom: 6,
                                       marginRight: 6
                                   }}/>
                        </TouchableOpacity>
                    </CardView>

                    <CardView style={{
                        backgroundColor: '#EEEEEE',
                        alignItems: 'center', justifyContent: 'center', marginHorizontal: 4
                    }}
                              cardElevation={2}
                              cardMaxElevation={2}
                              cornerRadius={4}>
                        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                          onPress={(e) => this.reloadResources()}>
                            <Image source={require('./../assets/refresh.png')}
                                   style={{
                                       width: 40,
                                       height: 40,
                                       alignSelf: 'center',
                                       marginBottom: 6,
                                       marginRight: 6
                                   }}/>
                        </TouchableOpacity>
                    </CardView>

                    <CardView style={{
                        backgroundColor: '#EEEEEE',
                        alignItems: 'center', justifyContent: 'center', marginHorizontal: 4
                    }}
                              cardElevation={2}
                              cardMaxElevation={2}
                              cornerRadius={4}>
                        <TouchableOpacity
                            style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8}}
                            onPress={(e) => this.publish()}>
                            <Text style={{marginBottom: 6, marginRight: 6, color: '#212121'}}>
                                PUBLISH
                            </Text>

                        </TouchableOpacity>
                    </CardView>
                </View>

            </View>
        );
    }

    render() {


        return (
            <View style={styles.container}>
                    <VirtualizedList
                        horizontal
                        pagingEnabled
                        initialNumToRender={1}
                        getItemCount={data => data.length}
                        data={this.state.usersEnvelope}
                        initialScrollIndex={0}
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
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        removeClippedSubviews={false}
                        style={{flex: 1}}
                    />

                {this.state.showProgress &&
                <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                    flex: 1,
                    width: deviceWidth,
                    height: deviceHeight - 24,
                    alignSelf: "stretch",
                    resizeMode: 'stretch',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute'
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


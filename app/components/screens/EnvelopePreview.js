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

import Orientation from 'react-native-orientation-locker';


let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];

let scrollToFirst = false;

let userEmails = [];

let block = 1;

let envelopeData;


export default class EnvelopePreview extends Component {

    static navigationOptions = {
        header: false
    };

    constructor(props) {
        super(props);
        envelopeData = this.props.navigation.state.params.envelopesData;
        envelopesArray = envelopeData;
        block = this.props.navigation.state.params.block;
        userEmails = this.props.navigation.state.params.userEmails;
        scrollToFirst = this.props.navigation.state.params.scrollToFirst;

        this.state = {
            refreshing: false,

            showProgress: true,

            name: null,
            address: null,
            city: null,
            country: null,
            zip: null,
            description: null,

            photo: null,

            usersEnvelope: []

        };

        this.renderEnvelope = this.renderEnvelope.bind(this);

    }


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

    componentDidMount() {
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

    componentWillUnmount() {
        this.saveEnvelopeAppearance();
    }

    async getEnvelopeAppearanceAndInfo() {
        try {
            let name = JSON.parse(await AsyncStorage.getItem('name'));
            let address = JSON.parse(await AsyncStorage.getItem('address'));
            let city = JSON.parse(await AsyncStorage.getItem('city'));
            let country = JSON.parse(await AsyncStorage.getItem('country'));
            let zip = JSON.parse(await AsyncStorage.getItem('zip'));
            let description = JSON.parse(await AsyncStorage.getItem('description'));
            let photo = JSON.parse(await AsyncStorage.getItem('photo'));

            this.setState({
                name: name,
                address: address,
                city: city,
                country: country,
                zip: zip,
                description: description,
                photo: photo,


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
                        photo: photo
                    },
                    resources: {
                        envelope: 'http://penpal.eken.live/Api/get-resource/?type=envelope',
                        stamp: 'http://penpal.eken.live/Api/get-resource/?type=stamp',
                        seal: 'http://penpal.eken.live/Api/get-resource/?type=seal'
                    }
                }],

            });


        } catch (message) {
            console.log(message + '  ' + JSON.stringify(this.state.usersEnvelope))
        }


    }

    async saveEnvelopeAppearance() {

    }



    componentWillMount() {

        this.loadresources();
        this.getEnvelopeAppearanceAndInfo();


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

    async loadresources() {

    }

    renderEnvelope(envelope) {
        let imageURL;
        if (envelope.item.data.photo) {
            imageURL = envelope.item.data.photo;
        } else {
            imageURL = 'https://robohash.org/' + envelope.item.data.first_name;
        }

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
                            <Image source={{uri: imageURL}} style={styles.userPhoto}/>
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
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
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
                                   style={{height: deviceHeight / 25, resizeMode: 'contain'}}/>
                            <Text style={{
                                color: '#212121',
                                fontSize: 14,
                                marginLeft: deviceWidth * 0.003125,
                                width: deviceWidth / 2 - 48
                            }}>
                                {envelope.item.data.description}
                            </Text>
                        </View>
                    </View>
                </CachedImage>
            </View>
        );
    }

    reloadResources() {
        ImageCache.ImageCache.get().clear();
        this.setState({refreshing: true, showProgress: true, usersEnvelope: []});
        this.loadresources();
        this.getEnvelopeAppearanceAndInfo();
        this.setState({refreshing: false});
    }

    render() {


        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
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
                    <TouchableOpacity style={{
                        flex: 0,
                        width: 50,
                        height: 20,
                        backgroundColor: 'white',
                        position: 'absolute',
                        alignSelf: 'flex-end'
                    }} onPress={(e) => this.reloadResources()}>
                        <Text>reload</Text>
                    </TouchableOpacity>
                </View>
                {this.state.showProgress &&
                <Image source={require('./../assets/envelope_background_lanscape.png')} style={{
                    flex: 1,
                    width: deviceWidth,
                    height: deviceHeight,
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
        width: deviceWidth / 2,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingLeft: deviceWidth * 0.0125,
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


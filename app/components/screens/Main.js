import {
    AsyncStorage,
    BackHandler,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    VirtualizedList
} from 'react-native';

import React, {Component} from 'react';

import CardView from 'react-native-cardview';

import {NavigationActions} from 'react-navigation';

import Orientation from 'react-native-orientation-locker';

import RotatingView from './../assets/RotatingView';

import Icon2 from 'react-native-vector-icons/FontAwesome';

import LocalizedStrings from 'react-native-localization';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];
let stampRotationArray = [];
let sealRotationArray = [];

const BLOCKS_RANGE_FOR_RANDOMIZATION = 100;
const ENVELOPES_AMOUNT_PER_BLOCK = 50;

let savedBlock;
let blocksAvailable;

let scrollToFirst = false;

let userEmails = [];

let page = 0;
let block = 1;

let isLastBlockListed = false;

let strings = new LocalizedStrings({
    "en-US":{
        send_letter:"SEND LETTER",
        create_envelope: 'CREATE ENVELOPE',
        delete_envelope: 'DELETE OWN CARD',
        filter: 'FILTER'
    },
    en:{
        send_letter:"SEND LETTER",
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
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    be: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    uk: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    az: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    hy: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    kk: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    ky: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    tg: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    tk: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    },
    uz: {
        send_letter:"ОТПРАВИТЬ ПИСЬМО",
        create_envelope: 'СОЗДАТЬ КОНВЕРТ',
        delete_envelope: 'УДАЛИТЬ СВОЙ КОНВЕРТ',
        filter: 'ФИЛЬТР'

    }

});



export default class Main extends Component {

    static navigationOptions = {
        header: false
    };

    constructor(props){
        super(props);
        envelopesArray = this.props.navigation.state.params.envelopesData;
        block = this.props.navigation.state.params.block;
        userEmails = this.props.navigation.state.params.userEmails;
        scrollToFirst = this.props.navigation.state.params.scrollToFirst;

        this.state = {
            showProgress: true,
            showError: false,
            refreshing: false,
            showButton: false,
            showMenu: false,
        };


        this.renderEnvelope = this.renderEnvelope.bind(this);
        this._onScrollEnd = this._onScrollEnd.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);
    }



    componentWillMount() {
        if (envelopesArray.length<=0){
            this.getUserStatus();
        } else {
            this.setState({
                showProgress: false
            })
        }
        if (scrollToFirst){
            page = 0;
        }

    }

    componentDidMount(){
        Orientation.lockToLandscapeLeft();
        BackHandler.addEventListener('hardwareBackPress', () =>{
            BackHandler.exitApp();
            return true;
        });
    }

    componentWillUnmount(){
        this.saveStatus();
    }

    async getUserStatus(){
        try {
            savedBlock = JSON.parse(await AsyncStorage.getItem('block'));

            let lastCardOfUser = JSON.parse(await AsyncStorage.getItem('lastCardOfUser'));

            userEmails = JSON.parse(await AsyncStorage.getItem('userEmails'));

            if (savedBlock!== null){
                block = savedBlock;
                if (lastCardOfUser===null){
                    this.getCards();
                } else{
                    this.getLastCardOfUser(lastCardOfUser);
                }

            } else{
                block = this.randomizer(BLOCKS_RANGE_FOR_RANDOMIZATION);
                await this.getCards();
            }

        } catch (message) {
            this.getCards();
        }

    }

    async saveStatus(){
        try {
            await AsyncStorage.setItem('block', JSON.stringify(block));
        } catch (error) {}
    }

    async getLastCardOfUser(email: string) {

        try {
            let response = await fetch(('http://penpal.eken.live//Api/get-last-user-envelope/?email='+email), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let res = JSON.parse(await response.text());
            console.log(JSON.stringify(res));
            if (response.status >= 200 && response.status < 300) {
                envelopesArray = [{
                    type: "card",
                    data: {
                        id: res.id,
                        first_name: res.first_name,
                        address: res.address,
                        city: res.city,
                        country_name: res.country_name,
                        postal: res.postal,
                        description: res.description,
                        photo: res.image_id
                    },
                    resources: {envelope: res.envelope, stamp: res.stamp, seal: res.seal}
                }];
                this.getCards();
            }
        } catch (message) {
            this.getCards();
        }
    }

    async getCards() {
        console.log("BOOM " +block);
        try {
            let response = await fetch(('http://penpal.eken.live/api/get-cards?page='+block+'&perPage='+ENVELOPES_AMOUNT_PER_BLOCK), {
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
                if (block<=blocksAvailable){
                    // if user exceeds page range (due to card deletion) - get him to 1st page of first block
                    if (this.state.page>=envelopesReceived.length){
                        page = 0;
                        block = 1;
                    }
                    envelopesArray = envelopesArray.concat(envelopesReceived);
                } else {
                    // if not new user exceeds blocks range (due to card deletion) - get him to 1st page of 1st block
                    if(savedBlock!==null){
                        page = 0;
                        block = 1;
                        envelopesArray = envelopesArray.concat(envelopesReceived);
                        // if new user exceeds blocks range - randomize him again
                    } else{
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

    randomizer(max: number) {
        let rand =  (Math.random() * max);
        let randomBlock = Math.floor(rand) + 1;
        return randomBlock;
    }



    renderEnvelope( envelope){
        console.log("item "+ JSON.stringify(envelope.index));
        const { data } = envelope.item;
        page = envelope.index;

        let buttonIconColor = '#9e9e9e';
        let buttonTextColor = '#9e9e9e';
        if (userEmails !== null && userEmails.includes(envelope.item.data.email) >= 0) {
            buttonIconColor = 'red';
            buttonTextColor = 'red';
        }
        let imageURL;
        if(envelope.item.data.photo < 0){
            imageURL = 'https://robohash.org/'+envelope.item.data.first_name;
        } else{
            imageURL = 'http://penpal.eken.live/Api/photo/width/300/id/'+envelope.item.data.photo;
        }
        let envelopeNumber = envelope.item.resources.envelope;
        let envelopeURL;
        if (envelopeNumber<10){
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=00'+envelopeNumber;
        } else if (envelopeNumber>9 && envelopeNumber< 100){
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=0'+envelopeNumber;
        } else{
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id='+envelopeNumber;
        }

        let stampNumber = envelope.item.resources.stamp;
        let stampURL;
        if (stampNumber<10){
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=00'+stampNumber;
        } else if (stampNumber>9 && stampNumber< 100){
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=0'+stampNumber;
        } else{
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id='+stampNumber;
        }

        let sealNumber = envelope.item.resources.seal;
        let sealURL;
        if (sealNumber<10){
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=00'+sealNumber;
        } else if (sealNumber>9 && sealNumber< 100){
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id=0'+sealNumber;
        } else{
            sealURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=seal&id='+sealNumber;
        }

        let stampRotation;
        let sealRotation;

        if (stampRotationArray.hasOwnProperty(envelope.item.data.id)){
            stampRotation = stampRotationArray[envelope.item.data.id];
        } else{
            stampRotation = (Math.floor(Math.random() * (10) - 5))+"deg";
            stampRotationArray[envelope.item.data.id] = stampRotation;
        }

        let id = envelope.item.data.id;

        if (id in sealRotationArray){
            sealRotation = sealRotationArray[id];
        } else{
            sealRotation = (Math.floor(Math.random() * (10) - 5))+"deg";
            sealRotationArray[id] = sealRotation;
        }




        return (
            <TouchableOpacity style={styles.viewPager}
                              onPress={(e) => this.showButton()}>
                <Image source={{uri: envelopeURL}} style={styles.envelopeImage}>
                <View style={styles.topRow}>
                    <View style={styles.topLeftRow}>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row', }}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.name}>
                                {envelope.item.data.first_name}
                            </Text>
                        </View>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row'}}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.address}>
                                {envelope.item.data.address}
                            </Text>
                        </View>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row'}}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.address}>
                                {envelope.item.data.city}
                            </Text>
                        </View>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row'}}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.address}>
                                {envelope.item.data.country_name+', '+envelope.item.data.postal}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.topRightRow}>
                        <Image source={{uri: imageURL}} style={styles.userPhoto}/>
                        <Image source={{uri: stampURL}} style={{height: deviceHeight/5, width: deviceWidth/4, resizeMode:'contain', transform:[{rotate: stampRotation}], alignSelf:'center', left: deviceWidth/6, position: 'absolute'
                        }}/>
                        <Image source={{uri: sealURL}} style={{height: deviceHeight/5, width: deviceWidth/5, resizeMode:'contain', alignSelf:'center', left: deviceWidth/6, position: 'absolute', transform:[{rotate: sealRotation}]
                        }}/>
                    </View>
                </View>
                <View style={{flex: 2,  justifyContent:'center', alignItems:'center', flexDirection: 'row'}}>
                    <View style={{flex: 1, width: deviceWidth/2}}/>
                    <View style={{flex: 1,width: deviceWidth/2,  justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row', paddingBottom:deviceHeight*0.1}}>
                        <Image source={require('./../assets/quote.png')} style={{height: deviceHeight/25,resizeMode:'contain'}}/>
                        <Text style={{color: '#212121', fontSize: 14, marginLeft: deviceWidth*0.003125, width: deviceWidth/2-48}}>
                            {envelope.item.data.description}
                        </Text>
                    </View>
                </View>
                {this.state.showButton &&
                    <View  style={{position: 'absolute', bottom: 32, right: 16, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end', flex: 0}}>
                        {this.state.showMenu&&
                        <CardView style={{marginBottom: deviceHeight*0.011, paddingVertical: deviceHeight* 0.022222, paddingHorizontal: deviceWidth* 0.025}}
                                  cardElevation={2}
                                  cardMaxElevation={2}
                                  cornerRadius={2}>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end', margin: 4}}>
                                <Text style={styles.actionButtonText}>{strings.send_letter}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="send-o" style={styles.actionButtonIcon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end',  margin: 4}}
                                              onPress={(e) => this._navigateTo('EnvelopeFillingScreen', {envelopesData: envelopesArray, block: block, userEmails: userEmails, scrollToFirst: false})}>
                                <Text style={styles.actionButtonText}>{strings.create_envelope}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="envelope-o" style={styles.actionButtonIcon} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end',  margin: 4}}>
                                <Text style={{color: buttonTextColor, fontSize: 16, marginRight: deviceWidth*0.03125}}>{strings.delete_envelope}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="trash-o" style={{ fontSize: 22, color: buttonIconColor}} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end',  margin: 4}}>
                                <Text style={styles.actionButtonText}>{strings.filter}</Text>
                                <View style={{width: 32, alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon2 name="filter" style={styles.actionButtonIcon} />
                                </View>
                            </TouchableOpacity>
                        </CardView>}
                        <TouchableOpacity style={{backgroundColor:'#ff4444', borderRadius: 64, height:deviceHeight*0.155, width: deviceHeight*0.155}}
                                          onPress={(e) => this.onClickFab()}/>
                    </View>}
                </Image>
            </TouchableOpacity>
        );
    }

    showButton(){
        if (!this.state.showButton){
            this.setState({
                showButton: true
            })
        } else{
            this.setState({
                showButton: false
            })
        }
        this.setState({
            showMenu: false
        })
    }

    onScroll(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        console.log('scrolled to page ', pageNum);

        this.setState({
            showButton: false
        })
    }

    onClickFab(){
        if (!this.state.showMenu){
            this.setState({
                showMenu: true
            })
        } else{
            this.setState({
                showMenu: false
            })
        }
    }

    _onScrollEnd() {
            this.setState({
                showProgress: true
            });
            let nextBlock;
            if (block < blocksAvailable){
                nextBlock = block +1;

            }  else{
                nextBlock = 1;
                isLastBlockListed = true;
            }
        console.log('nextBlock ' + nextBlock);
            block = nextBlock;
            this.getCards();

    }

    onRefresh = () => {
        this.setState({
            showProgress: true
        });
        this.saveStatus()
            .then(this.getUserStatus())
            .catch((e)=> console.log.e)
    };

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
                {this.state.showProgress&&
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
                    onEndReachedThreshold = {1}
                    onStartReached={this._onScrollEnd}
                    onStartThreshold = {1}
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
        flex:1,
        backgroundColor:'#e4e4e4',
    },
    viewPager: {
        flex:1,
        width: null, height: null,
        alignSelf: 'center',
        paddingVertical:deviceHeight*0.025,

    },
    page:{
        flex:1,
    },
    topRow:{
        flex:3,
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row'
    },
    envelopeImage: {
        flex:1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
    topLeftRow:{
        height: deviceHeight/1.9,
        width: deviceWidth/2,
        flex: 1,
        justifyContent:'flex-start',
        alignItems:'flex-start',
        flexDirection: 'column',
        paddingLeft: deviceWidth*0.0125,
        paddingTop:deviceHeight*0.15
    },
    prefix:{
        height: deviceHeight/25,
        resizeMode:'contain'
    },
    topRightRow:{
        height: deviceHeight/1.9,
        flex: 1,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection: 'row',
        paddingRight:deviceWidth*0.0375,
        paddingTop:deviceHeight*0.1125
    },
    userPhoto: {
        height: deviceHeight/2.5,
        width: deviceWidth/4,
        resizeMode:'contain',
        marginTop:deviceHeight*0.025
    },
    address:{
        color: '#212121',
        fontSize: 14,
        marginLeft:deviceWidth*0.003125
    },
    name:{
        color: '#212121',
        fontSize: 16,
        marginLeft:deviceWidth*0.003125
    },
    actionButtonIcon: {
        fontSize: 22,
        color: '#757575',
    },
    actionButtonText:{
        color: '#212121',
        fontSize: 16,
        marginRight: deviceWidth*0.03125
    }
});


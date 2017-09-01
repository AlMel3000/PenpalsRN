import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

import React, {Component} from 'react';


var ViewPager = require('react-native-viewpager');
const ds = new ViewPager.DataSource({pageHasChanged: (r1, r2) => r1 !== r2});

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let envelopesArray = [];
let stampRotationArray = [];
let sealRotationArray = [];

const BLOCKS_RANGE_FOR_RANDOMIZATION = 100;
const ENVELOPES_AMOUNT_PER_BLOCK = 50;

let savedBlock;
let blocksAvailable;


export default class Main extends Component {

    static navigationOptions = {
        header: false
    };

    constructor(props){
        super(props);
        this.state = {
           page: 0,
            block: 1,
            dataSource: ds.cloneWithPages(envelopesArray),
            showProgress: true
        };

        this.renderEnvelope = this.renderEnvelope.bind(this)
    }



    componentWillMount() {
        this.getUserStatus();

    }

    componentWillUnmount(){
        this.saveStatus();
    }

    async getUserStatus(){
        try {
            savedBlock = JSON.parse(await AsyncStorage.getItem('block'));
            let savedPage = JSON.parse(await AsyncStorage.getItem('page'));

            let lastCardOfUser = JSON.parse(await AsyncStorage.getItem('lastCardOfUser'));

            if (savedBlock!== null){
                this.setState({
                    block: savedBlock,
                    page: savedPage
                });
                if (lastCardOfUser===null){
                    this.getCards();
                } else{
                    this.getLastCardOfUser(lastCardOfUser);
                }

            } else{
                let randomBlock = this.randomizer(BLOCKS_RANGE_FOR_RANDOMIZATION);
                this.setState({
                    block: randomBlock
                });
                await this.getCards();
            }

        } catch (message) {
            console.log(message)
        }

    }

    async saveStatus(){
        try {
            await AsyncStorage.setItem('block', JSON.stringify(this.state.block));
            await AsyncStorage.setItem('page', JSON.stringify(this.state.page));
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

                envelopesArray = [{type: "card", data:{id: res.id, first_name: res.first_name, address: res.address, city: res.city, country_name: res.country_name, postal: res.postal, description: res.description,  photo: res.image_id}, resources:{envelope: res.envelope, stamp: res.stamp, seal: res.seal}}];

                this.setState({
                    dataSource: this.state.dataSource.cloneWithPages(envelopesArray),
                });

                this.getCards();
            }
        } catch (message) {
            console.log(message)
        }
    }

    async getCards() {
        console.log("BOOM " +this.state.block);
        try {
            let response = await fetch(('http://penpal.eken.live/api/get-cards?page='+this.state.block+'&perPage='+ENVELOPES_AMOUNT_PER_BLOCK), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let res = JSON.parse(await response.text());
            console.log(JSON.stringify(res));
            if (response.status >= 200 && response.status < 300) {
                blocksAvailable = res.pages;
                let envelopesReceived = res.cards;

                // it was here

                console.log(blocksAvailable+" "+this.state.block);
                // if any user doesn't exceed blocks range - let my user go
                if (this.state.block<=blocksAvailable){
                    // if user exceeds page range (due to card deletion) - get him to 1st page of first block
                    if (this.state.page>=envelopesReceived.length){
                        this.setState({
                            page: 0,
                            block:1
                        })
                    }
                    envelopesArray = envelopesArray.concat(envelopesReceived);
                } else {
                    // if not new user exceeds blocks range (due to card deletion) - get him to 1st page of 1st block
                    if(savedBlock!==null){
                        this.setState({
                            block: 1,
                            page:0
                        });
                        envelopesArray = envelopesArray.concat(envelopesReceived);
                        // if new user exceeds blocks range - randomize him again
                    } else{
                        let randomBlockWithinBounds =  this.randomizer(blocksAvailable);
                        this.setState({
                            block: randomBlockWithinBounds
                        });
                        this.getCards();
                        return;
                    }

                }

                this.setState({
                    dataSource: this.state.dataSource.cloneWithPages(envelopesArray),
                    showProgress: false
                });
            }
        } catch (message) {
            console.log(message)
        }
    }

    randomizer(max: number) {
        let rand =  (Math.random() * max);
        let randomBlock = Math.floor(rand) + 1;
        return randomBlock;
    }


    renderEnvelope( data: Object,
                    pageID: number | string){

        let imageURL;
        if(data.data.photo < 0){
            imageURL = 'https://robohash.org/'+data.data.first_name;
        } else{
            imageURL = 'http://penpal.eken.live/Api/photo/width/300/id/'+data.data.photo;
        }
        let envelopeNumber = data.resources.envelope;
        let envelopeURL;
        if (envelopeNumber<10){
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=00'+envelopeNumber;
        } else if (envelopeNumber>9 && envelopeNumber< 100){
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id=0'+envelopeNumber;
        } else{
            envelopeURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=envelope&id='+envelopeNumber;
        }

        let stampNumber = data.resources.stamp;
        let stampURL;
        if (stampNumber<10){
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=00'+stampNumber;
        } else if (stampNumber>9 && stampNumber< 100){
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id=0'+stampNumber;
        } else{
            stampURL = 'http://penpal.eken.live/Api/get-resource-by-id?type=stamp&id='+stampNumber;
        }

        let sealNumber = data.resources.seal;
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

        if (stampRotationArray.hasOwnProperty(data.data.id)){
            stampRotation = stampRotationArray[data.data.id];
        } else{
            stampRotation = (Math.floor(Math.random() * (10) - 5))+"deg";
            stampRotationArray[data.data.id] = stampRotation;
        }

        ;
        if (data.data.id in sealRotationArray){
            sealRotation = sealRotationArray[data.data.id];
        } else{
            sealRotation = (Math.floor(Math.random() * (10) - 5))+"deg";
            sealRotationArray[data.data.id] = sealRotation;
        }

        return (
            <View style={styles.viewPager}>
                <Image source={{uri: envelopeURL}} style={styles.envelopeImage}/>
                <View style={styles.topRow}>
                    <View style={styles.topLeftRow}>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row', }}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.name}>
                                {data.data.first_name}
                            </Text>
                        </View>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row'}}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.address}>
                                {data.data.address}
                            </Text>
                        </View>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row'}}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.address}>
                                {data.data.city}
                            </Text>
                        </View>
                        <View style={{justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row'}}>
                            <Image source={require('./../assets/prefix.png')} style={styles.prefix}/>
                            <Text style={styles.address}>
                                {data.data.country_name+', '+data.data.postal}
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
                <View style={{flex: 1,  justifyContent:'center', alignItems:'center', flexDirection: 'row'}}>
                    <View style={{flex: 1, width: deviceWidth/2}}/>
                    <View style={{flex: 1,width: deviceWidth/2,  justifyContent:'flex-start', alignItems:'flex-start', flexDirection: 'row', paddingBottom:deviceHeight*0.1, paddingRight:deviceWidth*0.0125}}>
                        <Image source={require('./../assets/quote.png')} style={{height: deviceHeight/25,resizeMode:'contain'}}/>
                        <Text style={{color: '#212121', fontSize: 14, marginRight:deviceWidth*0.02, marginLeft: deviceWidth*0.003125}}>
                            {data.data.description}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    _onChangePage(page: number | string){
        if (page === (this.state.dataSource.getPageCount()-1)){
            let nextBlock;
            if (this.state.block !== blocksAvailable){
                nextBlock = this.state.block +1;
            }  else{
                nextBlock = 1;
            }
            this.setState({
                block: nextBlock,
                showProgress: true
            })
            this.getCards();
        }
        this.setState({
            page: page
        });

    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.showProgress&&
                <View style = {{alignItems: 'center', justifyContent: 'center', flex:1, flexDirection: 'row'}}>
                    <ActivityIndicator size={55} style = {{alignItems: 'center', justifyContent: 'center', flex:1}}/>
                </View>}
                {! this.state.showProgress&&
                <ViewPager style={styles.viewPager}
                           dataSource={this.state.dataSource}
                           renderPage={this.renderEnvelope}
                           renderPageIndicator={false}
                           initialPage={this.state.page}
                           onChangePage={(page)=>this._onChangePage(page)}/>}
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
        width: deviceWidth,
        height: deviceHeight,
        alignSelf: 'center',
        paddingVertical:deviceHeight*0.025,
        paddingHorizontal: deviceWidth*0.034,

    },
    page:{
        width: (deviceWidth - (deviceWidth*0.00625)),
        height: deviceHeight - (deviceHeight*0.0445),
    },
    topRow:{
        height: deviceHeight/1.9,
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row'
    },
    envelopeImage: {
        width: deviceWidth* 0.994,
        height: deviceHeight,
        resizeMode: 'contain',
        position:'absolute',
        marginLeft: deviceWidth*0.003125,
        marginRight:deviceWidth*0.003125
    },
    topLeftRow:{
        height: deviceHeight/1.9,
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
    }
});


import React, { Component } from 'react';

import {
    NavigationActions
} from 'react-navigation';


import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    BackHandler,
    Alert
} from 'react-native';

import Orientation from 'react-native-orientation-locker';

import Icon2 from 'react-native-vector-icons/FontAwesome';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

import CountryPicker, {getAllCountries} from 'react-native-country-picker-modal';

import CheckBox from 'react-native-check-box'

export default class EnvelopeFillingScreen extends Component {

    static navigationOptions = {
        header: false
    };

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            nameUnderlineColor: '#1ca9c9',
            address: '',
            addressUnderlineColor: '#e4e4e4',
            city: '',
            cityUnderlineColor: '#e4e4e4',
            cca2:'',
            country: '',
            zip: '',
            zipUnderlineColor: '#e4e4e4',
            email: '',
            emailUnderlineColor: '#e4e4e4',
            description:'',
            descriptionUnderlineColor: '#e4e4e4',
            checked: false
        };

    }

    componentWillMount() {
    }

    componentDidMount(){
    Orientation.lockToPortrait();
        BackHandler.addEventListener('hardwareBackPress', () =>{
            this._navigateTo('Main');
            return true;
        });
    }

    _onChangeName(text){
        this.setState({
            name: text,
            nameUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeAddress(text){
        this.setState({
            address: text,
            addressUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeCity(text){
        this.setState({
            city: text,
            cityUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeZip(text){
        this.setState({
            zip: text,
            zipUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeEmail(text){
        this.setState({
            email: text,
            emailUnderlineColor: '#1ca9c9',
        });
    }

    _onChangeDescription(text){
        this.setState({
            description: text,
            descriptionUnderlineColor: '#1ca9c9',
        });
    }

    _showEULA(){
        Alert.alert(
            'Terms & Conditions',
            '\t\t\t1) I am of sound mind and memory, in person, without any pressure from outside, decided to publish my personal information in the Penpals Service for finding penpals. \n\n\t\t\t2) Each card is verified by the moderator before it gets into the list of the envelopes. Be worthy of yourself. We\'ll remove all the dirt, trash and spam.Also cards that contain email, phone, links to other sites and profiles in social networks will not be moderated. Moderation takes some time, please be patient a little bit and your address will appear in the Penpals.',
            [
                {text: 'УЗНАТЬ БОЛЬШЕ', onPress: () => this._navigateTo('EulaScreen')},
                {text: 'OК'},
            ],
            { cancelable: true}
        )
    }

    _navigateTo = (routeName: string) => {
        Orientation.unlockAllOrientations();
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName })]
        })
        this.props.navigation.dispatch(resetAction);
    };

    _ConfirmationCheckboxStateChanged(){
        if(this.state.checked){
            this.setState({
                checked:false
            });
        } else{
            this.setState({
                checked:true
            });
        }
    }

    render() {
        return (
               <Image source={require('./../assets/envelope_background.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'stretch'}}>
               <ScrollView showsVerticalScrollIndicator={false}>
                   <View style={{flex: 1, padding: 16, justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch'}}>
                       <Text style={{color: '#212121', alignSelf: 'center', marginVertical:16}}>
                           Specify correct mailing address to receive letters
                       </Text>
                       <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch'}}>
                           <View style={{flex:2,flexDirection: 'column', justifyContent: 'flex-start', alignItems:'flex-start', alignSelf:'stretch'}}>

                              <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                                  <View style={{width:22}}>
                                      <Icon2 name="user-o" style={{ fontSize: 20, color: 'black'}} />
                                  </View>
                                  <View style={{flex:1, marginHorizontal: 8}}>
                                      <TextInput
                                          style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                          placeholder={'Имя, фамилия'}
                                          autoFocus={true}
                                          onFocus={(e)=> this._onChangeName()}
                                          onEndEditing={(e)=>this.setState({nameUnderlineColor: '#e4e4e4'})}
                                          onChangeText={(text) => this._onChangeName(text)}
                                          underlineColorAndroid={'transparent'}
                                          maxLength={40}
                                          value={this.state.name}/>
                                      <View style={{flex:0, height:1, backgroundColor: this.state.nameUnderlineColor}}/>
                                  </View>
                              </View>

                               <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                                   <View style={{width:22}}>
                                       <Icon2 name="map-o" style={{ fontSize: 20, color: 'black'}} />
                                   </View>
                                   <View style={{flex:1, marginHorizontal: 8}}>
                                       <TextInput
                                           style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                           placeholder={'Адрес'}
                                           onFocus={(e)=> this._onChangeAddress()}
                                           onEndEditing={(e)=>this.setState({addressUnderlineColor: '#e4e4e4'})}
                                           onChangeText={(text) => this._onChangeName(text)}
                                           underlineColorAndroid={'transparent'}
                                           value={this.state.address}
                                           maxLength={120}/>
                                       <View style={{flex:0, height:1, backgroundColor: this.state.addressUnderlineColor}}/>
                                   </View>
                               </View>

                               <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                                   <View style={{width:22}}>
                                       <Icon2 name="building-o" style={{ fontSize: 20, color: 'black'}} />
                                   </View>
                                   <View style={{flex:1, marginHorizontal: 8}}>
                                       <TextInput
                                           style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                           placeholder={'Город'}
                                           onFocus={(e)=> this._onChangeCity()}
                                           onEndEditing={(e)=>this.setState({cityUnderlineColor: '#e4e4e4'})}
                                           onChangeText={(text) => this._onChangeName(text)}
                                           underlineColorAndroid={'transparent'}
                                           value={this.state.city}
                                           maxLength={40}/>
                                       <View style={{flex:0, height:1, backgroundColor: this.state.cityUnderlineColor}}/>
                                   </View>
                               </View>

                           </View>

                           <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems:'center', alignSelf:'stretch', borderColor:'#e4e4e4', borderWidth:0.2, padding: 8}}>
                               <Image source={require('./../assets/default_robohash.png')} style={{flex: 0, height: 130, resizeMode:'contain'}}/>
                           </TouchableOpacity>
                       </View>

                       <View style={{justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch'}}>
                           <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                               <View style={{width:22}}>
                                   <Icon2 name="globe" style={{ fontSize: 20, color: 'black'}} />
                               </View>
                               <View style={{flex:1, marginHorizontal: 8}}>
                                   <CountryPicker
                                       onChange={(value)=> {
                                           this.setState({cca2: value.cca2, country: value.name});
                                       }}
                                       cca2={this.state.cca2}
                                       filterable={true}
                                       autoFocusFilter={true}
                                       translation='eng'>
                                   <TextInput
                                       style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                       placeholder={'Страна'}
                                       editable={false}
                                       underlineColorAndroid={'transparent'}
                                       value={this.state.country}/>
                                   <View style={{flex:0, height:1, backgroundColor: '#e4e4e4'}}/>
                                   </CountryPicker>
                               </View>
                           </View>

                           <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                               <View style={{width:22}}>
                                   <Icon2 name="map-signs" style={{ fontSize: 20, color: 'black'}} />
                               </View>
                               <View style={{flex:1, marginHorizontal: 8}}>
                                   <TextInput
                                       style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                       placeholder={'Индекс'}
                                       onFocus={(e)=> this._onChangeZip()}
                                       onEndEditing={(e)=>this.setState({zipUnderlineColor: '#e4e4e4'})}
                                       onChangeText={(text) => this._onChangeName(text)}
                                       underlineColorAndroid={'transparent'}
                                       value={this.state.zip}
                                       maxLength={10}/>
                                   <View style={{flex:0, height:1, backgroundColor: this.state.zipUnderlineColor}}/>
                               </View>
                           </View>

                           <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                               <View style={{width:22}}>
                                   <Icon2 name="envelope-o" style={{ fontSize: 20, color: 'black'}} />
                               </View>
                               <View style={{flex:1, marginHorizontal: 8}}>
                                   <TextInput
                                       style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                       placeholder={'Email'}
                                       keyboardType={'email-address'}
                                       onFocus={(e)=> this._onChangeEmail()}
                                       onEndEditing={(e)=>this.setState({emailUnderlineColor: '#e4e4e4'})}
                                       onChangeText={(text) => this._onChangeName(text)}
                                       underlineColorAndroid={'transparent'}
                                       value={this.state.email}
                                       maxLength={40}/>
                                   <View style={{flex:0, height:1, backgroundColor: this.state.emailUnderlineColor}}/>
                               </View>
                           </View>
                       </View>

                       <View style={{flex:1, alignSelf:'stretch', borderColor: this.state.descriptionUnderlineColor, borderWidth: 1, marginVertical:12}}>
                           <TextInput
                               style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                               placeholder={'p.s.'}
                               maxLength={150}
                               multiline={true}
                               onFocus={(e)=> this._onChangeDescription()}
                               onEndEditing={(e)=>this.setState({descriptionUnderlineColor: '#e4e4e4'})}
                               onChangeText={(text) => this._onChangeName(text)}
                               underlineColorAndroid={'transparent'}
                               value={this.state.description}/>
                       </View>

                       <View style={{alignSelf:'stretch', flexDirection:'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                           <CheckBox
                               style={{flex: 0, paddingVertical:2, paddingHorizontal: 6, borderColor: '#1ca9c9' }}
                               onClick={()=>this._ConfirmationCheckboxStateChanged()}
                               isChecked={this.state.checked}
                           />
                           <Text style={{color: '#212121', alignSelf: 'center'}}>
                               Я принимаю условия
                           </Text>
                           <TouchableOpacity
                               onPress={(e) => this._showEULA()}>
                               <Text style={{color: '#1ca9c9', alignSelf: 'center', marginVertical: 4, marginLeft:3, textDecorationLine:'underline'}}>
                                   соглашения
                               </Text>
                           </TouchableOpacity>
                       </View>

                       <View style={{alignSelf:'stretch', flexDirection:'row', alignItems: 'flex-end', justifyContent: 'flex-end', padding:16}}>
                           <TouchableOpacity style={{marginRight:32}}
                                             onPress={(e) => this._navigateTo('Main')}>
                               <Text style={{fontSize:16, color:'#7299BF'}}>ОТМЕНА</Text>
                           </TouchableOpacity>
                           <TouchableOpacity>
                               <Text style={{fontSize:16, color:'#7299BF'}}>ДАЛЕЕ</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </ScrollView>
               </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 6,
        width: deviceHeight, height: deviceWidth-22
    },
    loading: {
        color: 'red',
        fontSize:16,
    },
});

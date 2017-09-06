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
    TouchableOpacity
} from 'react-native';

import Orientation from 'react-native-orientation-locker';

import Icon2 from 'react-native-vector-icons/FontAwesome';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;


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
            country: '',
            countryUnderlineColor: '#e4e4e4',
        };

    }

    componentWillMount() {
    }

    componentDidMount(){
    Orientation.lockToPortrait();
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

    _onChangeCountry(text){
        this.setState({
            country: text,
            countryUnderlineColor: '#1ca9c9',
        });
    }



    _navigateTo = (routeName: string) => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName })]
        })
        this.props.navigation.dispatch(resetAction);
    };

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
                                           value={this.state.address}/>
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
                                           value={this.state.city}/>
                                       <View style={{flex:0, height:1, backgroundColor: this.state.cityUnderlineColor}}/>
                                   </View>
                               </View>

                           </View>

                           <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch', borderColor:'#e4e4e4', borderWidth:0.2, padding: 8}}>
                               <Image source={require('./../assets/default_robohash.png')} style={{flex: 0, height: 130, resizeMode:'contain'}}/>
                           </TouchableOpacity>
                       </View>

                       <View style={{justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch'}}>
                           <View  style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                               <View style={{width:22}}>
                                   <Icon2 name="globe" style={{ fontSize: 20, color: 'black'}} />
                               </View>
                               <View style={{flex:1, marginHorizontal: 8}}>
                                   <TextInput
                                       style={{flex:0, alignSelf: 'stretch',color: '#212121',fontSize: 14}}
                                       placeholder={'Страна'}
                                       onFocus={(e)=> this._onChangeCountry()}
                                       onEndEditing={(e)=>this.setState({countryUnderlineColor: '#e4e4e4'})}
                                       onChangeText={(text) => this._onChangeName(text)}
                                       underlineColorAndroid={'transparent'}
                                       value={this.state.country}/>
                                   <View style={{flex:0, height:1, backgroundColor: this.state.countryUnderlineColor}}/>
                               </View>
                           </View>
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

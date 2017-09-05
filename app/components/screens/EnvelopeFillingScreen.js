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
    TextInput
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
        };

    }

    componentWillMount() {
    }

    componentDidMount(){
    Orientation.lockToPortrait();
    }

    _onChangeName(text){
        this.setState({
            name: text
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
           <View style={{flex:1}}>
               <Image source={require('./../assets/envelope_background.png')} style={{position:"absolute", flex: 1, width: deviceHeight, height: deviceWidth-22, resizeMode: 'stretch'}}/>
               <ScrollView showsVerticalScrollIndicator={false}>
                   <View style={{padding: 16, justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch'}}>
                       <Text style={{color: '#212121', alignSelf: 'center', marginBottom:16}}>
                           Specify correct mailing address to receive letters
                       </Text>
                       <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch'}}>
                           <View style={{flex:2, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'flex-start', alignSelf:'stretch'}}>
                              <View  style={{flex:0, flexDirection: 'row', justifyContent: 'flex-start', alignItems:'center', alignSelf:'stretch'}}>
                                  <Icon2 name="trash-o" style={{ fontSize: 20, color: 'black'}} />
                                  <TextInput
                                      style={{flex:1, marginLeft: 16, marginRight: 8,color: '#212121',fontSize: 14,alignSelf:'stretch'}}
                                      placeholder={'Город'}
                                      autoFocus={true}
                                      onChangeText={(text) => this._onChangeName(text)}
                                      underlineColorAndroid={'transparent'}
                                      value={this.state.name}/>

                              </View>
                           </View>
                           <View style={{flex: 1, justifyContent: 'center', alignItems:'flex-start', alignSelf:'stretch', backgroundColor:'green'}}>

                           </View>
                       </View>
                   </View>
               </ScrollView>
           </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 6,
        display: 'flex'
    },
    loading: {
        color: 'red',
        fontSize:16,
    },
});

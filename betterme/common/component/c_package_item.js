import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, ActivityIndicator,AsyncStorage} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as base from "../../common/base"
export default class CPackageItem extends Component
{
  constructor(props)
  {
    super(props);
    console.log("CVideo",props);
  }


  render()
  {

    return <TouchableOpacity
      style={[{height: this.props.height || 200, width: this.props.width, flexDirection: "row", margin: 10, backgroundColor: "white",borderRadius:4,borderWidth:1,borderColor:this.props.finished == true?"green":"white"},base.shadow]}
      onPress={() => {
        this.props.navigation.navigate("Package_",{package_id:this.props.package_id,goBackCallBack:this.props.goBackCallBack})
      }}>

      <Image style={{borderRadius:4,width:this.props.width-2,height:this.props.height-2 || 200-2,}} source={{uri:this.props.poster}} />

      <View style={{borderRadius:4,
        position: "absolute", bottom: 0, width: this.props.width-2,padding:4
        , justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)"
      }}>

        <Text style={{fontSize:12,color: "white",textAlign:"center"}}>{this.props.title_cn||this.props.title}</Text>

      </View>

      { this.props.finished == true?
        <View style={{width:30,height:30,borderRadius:15,backgroundColor:"green",justifyContent:"center",alignItems:"center",position:"absolute",left:4,top:4}}>
          <Icon name="check" size={20} color="white" />
        </View>:null}
    </TouchableOpacity>
  }
}
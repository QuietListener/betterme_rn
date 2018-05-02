import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, ActivityIndicator,AsyncStorage} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as base from "../../common/base"

export default class CVideoItem extends Component
{
  constructor(props)
  {
    super(props);
    console.log("CVideo",props);
  }


  render()
  {

    return    <TouchableOpacity
    style={[{height: this.props.height, width: this.props.width, flexDirection: "row", margin: 10, backgroundColor: "white",borderRadius:4},base.shadow]}
    onPress={() => {
      this.props.navigation.navigate("Video", {
        videoUrl: this.props.videoUrl,
        videoPath: this.props.video_path,
        srtPath: this.props.srt_path,
        srtUrl: this.props.srtUrl,
        video_id: this.props.video_id,
        otherSrtUrl:this.props.otherSrtUrl,
        otherSrtPath:this.props.other_srt_path,
        package_id: this.props.package_id,
        goBackCallBack:this.props.goBackCallBack
      })
    }}>

    <Image style={{borderRadius:4,width:this.props.width,height:this.props.height,}} source={{uri:this.props.poster}} />

    <View style={[{borderRadius:4,
      position: "absolute", bottom: 0, width: this.props.width,padding:4
      , justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)"
    },base.shadow]}>
      <Text style={{fontSize:12,color: "white",textAlign:"center"}}>{this.props.title}</Text>
    </View>

    { this.props.finished == true?
      <View style={{width:30,height:30,borderRadius:15,backgroundColor:"green",justifyContent:"center",alignItems:"center",position:"absolute",left:4,top:4}}>
        <Icon name="check" size={20} color="white" />
      </View>:null}

  </TouchableOpacity>
  }
}
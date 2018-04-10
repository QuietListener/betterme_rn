/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';

import Moment from "moment"
import * as base from "./common/base"
const DeviceInfo = require('react-native-device-info');
import Video from "react-native-video"

class Video_ extends Component
{

  constructor(props)
  {
    super(props)
    this.setTime = this.setTime.bind(this);

  }

  componentDidMount()
  {
    setTimeout(()=>{this.player.presentFullscreenPlayer()},1000);
  }

  setTime(time)
  {
    console.log("progress",time);
  }
  //
  // loadStart()
  // {
  //   console.log("loadStart");
  // }
  //
  // setDuration()
  // {
  //   console.log("setDuration");
  // }
  //
  // videoError()
  // {
  //   console.log("videoError")
  // }
  // onBuffer()
  // {
  //   console.log("onBuffer");
  // }
  //
  // onEnd()
  // {
  //   console.log("onEnd");
  // }
  //
  // onTimedMetadata()
  // {
  //   console.log("onTimedMetadata");
  // }

  render()
  {

    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <Video source={require("./resources/video/KasivaMutua_2017G-950k.mp4")}   // Can be a URL or a local file.
               //poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
               ref={(ref) => {
                 this.player = ref
               }}                                      // Store reference
               rate={1.0}                              // 0 is paused, 1 is normal.
               volume={1.0}                            // 0 is muted, 1 is normal.
               muted={false}                           // Mutes the audio entirely.
               paused={false}                          // Pauses playback entirely.
               resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
               repeat={true}                           // Repeat forever.
               playInBackground={false}                // Audio continues to play when app entering background.
               playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
               ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
               progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
               onLoadStart={this.loadStart}            // Callback when video starts to load
               onLoad={this.setDuration}               // Callback when video loads
               onProgress={this.setTime}               // Callback every ~250ms with currentTime
               onEnd={this.onEnd}                      // Callback when playback finishes
               onError={this.videoError}               // Callback when video cannot be loaded
               onBuffer={this.onBuffer}                // Callback when remote video is buffering
               onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
               style={inner_styles.backgroundVideo} />

        <View style={{flex:1,position:"absolute",top:200,zIndex:1000,backgroundColor:"white"}}>
          <View style={{flexDirection:"row"}}><Text onPress={()=>alert("asdfasdf")}>asdfasdf</Text><Text>aaaaa</Text></View>
        </View>
      </View>

    )
  }
}


const inner_styles = {
  item:{
      backgroundColor:"white",
      flexDirection:"row",
      paddingTop:8,
      paddingBottom:8,
      paddingLeft:20,
      justifyContent:"center",
      alignItems:"center",
      marginTop:10
  },

  subitem1:{
    flex:3,
    alignItems:"flex-start",
    justifyContent:"center"

  },

  subitem2:{
    flex:1,
    alignItems:"flex-end",
    justifyContent:"center",
    marginRight:20
  },

  bold_text:{
    fontSize:16,
    color:"rgb(0,0,0)",
  },

  normal_text:{
    fontSize:14,
    color:"rgb(177,180,183)"

  },
  backgroundVideo: {
    width:base.ScreenWidth,
    height:base.ScreenWidth*3/4
  },

};



import _ from "lodash"
_.mixin(Video_.prototype,base.base_component);


import { connect } from "react-redux";
import {clear_all_data} from "./common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {

    clear_all_data:()=>{
      dispatch(clear_all_data())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Video_);


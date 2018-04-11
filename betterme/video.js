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
import Orientation from 'react-native-orientation';

const Subtitle = require('subtitle')
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')
//import fs from "fs"

var RNFS = require('react-native-fs');
import Tts from 'react-native-tts';

class Video_ extends Component
{

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    var headerStyle = {height:0};
    return {headerStyle};
  };


  constructor(props)
  {
    super(props)
    this.state={
      backgroundVideo: {
        width:base.ScreenHeight,
        height:0//base.ScreenWidth
      },
      show_srt_index:-1,
      paused:false,
      popup_left:-1000,
      popup_top:0
    }
    this.setTime = this.setTime.bind(this);
    this.troggle_video = this.troggle_video.bind(this);
    this.measure = this.measure.bind(this);
    this.read_word = this.read_word.bind(this);
  }

  async componentDidMount()
  {
    var url = "https://ted2srt.org/api/talks/13591/transcripts/download/srt?lang=en";
    var res3 = await base.axios({method:"get" , url:url ,data:{}});
    let data = res3;
    console.log(res3.data);

    var srt_data = parse(res3.data);

    this.setState({srt_data});

    console.log(srt_data[1])
    Orientation.lockToLandscape();
    //setTimeout(()=>{this.player.presentFullscreenPlayer()},1000);
  }

  troggle_video()
  {
    this.setState({paused:!this.state.paused})
  }

  pause()
  {
    if(this.state.paused != true)
      this.setState({paused:true})
  }

  play()
  {
    if(this.state.paused != false)
       this.setState({paused:false})
  }

  read_word(word)
  {
    if(word)
    {
      Tts.getInitStatus().then(() => {
        Tts.speak(word);
      });
    }
  }

  word_click(words,word_index, srt_index)
  {
    var word = words[word_index];
    if(word)
    {
      this.pause();
      this.refs_store[word_index].measure(this.measure)
      this.setState({cur_word:word});
      this.read_word(word);
    }
  }

  hide_mean_box()
  {
    this.setState({popup_left:-1000});
    this.play();
  }

  setTime(time)
  {
    var cur_time = time.currentTime*1000;
    console.log("progress",cur_time);

    if(this.state.srt_data)
    {
      var show_srt = null;
      var srt_data = this.state.srt_data;

      for(let i = 0; i < srt_data.length; i++)
      {
          if(cur_time > srt_data[i].end)
            continue;
          else
          {
            if(i != this.state.show_srt_index)
            {
              show_srt = srt_data[i];
              var text = show_srt.text;
              var words = text.split(" ")

              this.refs_store = new Array(words.length);

              var cur_subtitle = words.map((word,index)=>{

                var index_ = _.clone(index);
                return<Text style={{padding:5}}
                      ref={(e)=>{this.refs_store[index_] = e}}
                      onPress={()=>this.word_click(words,index_,i)}>
                  {word}
                </Text>});
              console.log("cur_subtitle",cur_subtitle)
              this.setState({show_srt_index:i,cur_subtitle:cur_subtitle});
            }
            break;
          }
      }


    }
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

  measure(x, y, width, height, left, top)
  {
    console.log("measure",x, y, width, height, left, top);

    var popup_left = left+width/2-160/2;
    var popup_top = 50;
    var param = {popup_left,popup_top};
    console.log(param);
    this.setState(param);
  }

  render()
  {
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

        <View style={{flex:1,width:200,height:150,backgroundColor:"black",justifyContent:"center",alignItems:"center",position:"absolute",left:this.state.popup_left,bottom:this.state.popup_top}}>
         <View style={{flex:1,alignItems:"flex-end",width:200}}>
           <Text
            onPress={()=>{this.hide_mean_box()}}
            style={{marginRight:10,fontSize:20,color:"white"}}>x</Text>
         </View>

          <View style={{width:200,flex:5,alignItems:"flex-start",justifyContent:"flex-start"}}>
            <Text style={{color:"white"}}>{this.state.cur_word}</Text>
          </View>
        </View>

        <Video

          onPress={()=>this.troggle_video()}
          source={require("./resources/video/KasivaMutua_2017G-950k.mp4")}   // Can be a URL or a local file.
               //poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
               ref={(ref) => {
                 this.player = ref
               }}                                      // Store reference
               rate={1.0}                              // 0 is paused, 1 is normal.
               volume={1.0}                            // 0 is muted, 1 is normal.
               muted={false}                           // Mutes the audio entirely.
               paused={this.state.paused}                          // Pauses playback entirely.
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
               style={this.state.backgroundVideo} />
        <View style={{flex:1,position:"absolute",bottom:20,width:base.ScreenWidth,zIndex:1000,backgroundColor:"white"}}>


          <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}} ref={(ref) => {
            this.subtitle_view = ref
          }}>

            {this.state.cur_subtitle}
          </View>

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

  }

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


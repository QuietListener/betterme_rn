/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, ActivityIndicator,StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';

import Moment from "moment"
import * as base from "./common/base"
const DeviceInfo = require('react-native-device-info');
import Video from "react-native-video"
import Orientation from 'react-native-orientation';
var RNFS = require('react-native-fs');

const Subtitle = require('subtitle')
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')
//import fs from "fs"

var RNFS = require('react-native-fs');
import Tts from 'react-native-tts';
var SQLite = require('react-native-sqlite-storage')

const meanWidth = 300
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


    const { state, setParams } = this.props.navigation;

    var videoPath = null;
    var srtPath = null;
    if(state && state.params)
    {
      videoPath = state.params.videoPath;
      srtPath =  state.params.srtPath;
    }

    console.log({srtPath,videoPath})

    this.state={
      backgroundVideo: {
        width:base.ScreenHeight,
        height:0//base.ScreenWidth
      },
      show_srt_index:-1,
      paused:false,
      popup_left:-1000,
      popup_top:0,
      videoPath:videoPath,
      srtPath:srtPath,
      loadingMean:false,
    }
    this.setTime = this.setTime.bind(this);
    this.troggle_video = this.troggle_video.bind(this);
    this.measure = this.measure.bind(this);
    this.read_word = this.read_word.bind(this);
  }


  componentDidMount()
  {
    var that = this;
    RNFS.readFile(this.state.srtPath).then(data=>{
      //console.log("srt",data);
      var srt_data = parse(data);
      that.setState({srt_data});
      console.log(srt_data[1])
    })

    Orientation.lockToLandscape();

  }


  async get_word_info(word,call_back)
  {
    if(!word)
      return {}

    this.setState({loadingMean:true});
    try
    {
      var url = `${base.HOBBY_DOMAIN}/search_word.json?word=${'custom'}`;

      console.log(`HTTP: begin ${url}`);
      var res3 = await base.axios({method: "get", url: url});
      console.log(`HTTP: ${url} : res=${JSON.stringify(res3)}`);
      let data = res3.data;
      this.setState({loadingMean:false});

      var word_info = data && data.data && data.data.word ? data.data.word: {};
      console.log("word_info",word_info);
      call_back(word,word_info)

    }catch(e)
    {
      console.error(e);
      this.setState({loadingMean:false});
    }


    console.log()

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
    var that = this;
    if(word)
    {

      that.pause();
      that.refs_store[word_index].measure(this.measure)

      this.get_word_info(word,(word,word_info)=>{
        that.setState({cur_word:word,word_info:word_info});
      })


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


    var popup_left = left+width/2-meanWidth/2;
    var popup_top = 50;

    if(popup_left<0)
      popup_left = 10

    console.log("popup_left",popup_left,"base.ScreenWidth",base.ScreenWidth);
    if(left+meanWidth >= base.ScreenWidth-20)
    {
      popup_left = base.ScreenWidth - meanWidth-20;
    }

    console.log("popup_left1",popup_left,"base.ScreenWidth",base.ScreenWidth);
    var param = {popup_left,popup_top};
    console.log(param);
    this.setState(param);
  }

  render()
  {
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

        <View style={{flex:1,width:meanWidth,height:150,
          backgroundColor:"black",justifyContent:"center",alignItems:"center",position:"absolute",
          left:this.state.popup_left,bottom:this.state.popup_top,
          zIndex:1000
        }}>

         <View style={{backgroundColor:"black",
           height:22,alignItems:"flex-end",justifyContent:'flex-start',width:meanWidth-2}}>
           <Text onPress={()=>{this.hide_mean_box()}}
            style={{paddingRight:4,fontSize:20,color:"white"}}>x</Text>
         </View>


          {this.state.loadingMean == true?
            <View style={{
              width: meanWidth - 2,
              flex: 5,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ActivityIndicator
                animating={true}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width:16,height:16,
                }}
                size="small"
              />
            </View>
            :
            <View style={{
              width: meanWidth - 2,
              flex: 5,

              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}>
              <View style={{backgroundColor:"red",height: 28, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                <Text style={{
                  flex: 2,
                  color: "white",
                  fontSize: 20
                }}>{this.state.word_info ? this.state.word_info.word : "空"} </Text>

                <Text style={{
                  flex: 2,
                  color: "white",
                  fontSize: 16,
                  marginLeft: 10,
                  marginRight: 10
                }}>  {this.state.word_info ? this.state.word_info.accent : "空"} </Text>

                <Text style={{flex: 1, color: "white"}}
                      onPress={() => this.read_word(this.state.word_info ? this.state.word_info.word : null)}>播放</Text>
              </View>

              <View style={{width: meanWidth - 3, flex: 1, flexDirection: "row"}}>
                <Text style={{
                  color: "white",
                  fontSize: 16
                }}>  {this.state.word_info ? this.state.word_info.mean_cn : "空"} </Text>
              </View>
            </View>


          }
        </View>



        <Video

          onPress={()=>this.troggle_video()}
          source={{uri:this.state.videoPath}}   // Can be a URL or a local file.
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
        <View style={{flex:1,position:"absolute",bottom:1,width:base.ScreenWidth,zIndex:1000,backgroundColor:"white"}}>


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


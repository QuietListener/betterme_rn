/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, ActivityIndicator,AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';

import Moment from "moment"
import * as base from "./common/base"
const DeviceInfo = require('react-native-device-info');
import Video from "react-native-video"
import Orientation from 'react-native-orientation';

const Subtitle = require('subtitle')
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')
//import fs from "fs"

import Tts from 'react-native-tts';
var SQLite = require('react-native-sqlite-storage')
var RNFS = require('react-native-fs');

//const fromUrl = 'http://wvoice.spriteapp.cn/voice/2015/0818/55d2248309b09.mp3';
const downloadDir = `${RNFS.DocumentDirectoryPath}/files/`;
const fromUrl = "http://assets.baicizhan.com/judu/xsk_1_3_none_srt.mp4";
const url = "http://assets.baicizhan.com/judu/xsk_1_3_none_srt.mp4";
const srt_url = "https://ted2srt.org/api/talks/13591/transcripts/download/srt?lang=en";

const name = "KasivaMutua_2017G-950k.mp4";
const downloadDest = `${downloadDir}/${name}`;
const srtDest = `${downloadDir}/KasivaMutua_2017G-950k.srt`;


class VideoList extends Component
{
  constructor(props)
  {
    super(props)
    this.state={
    }
  }


  componentDidMount()
  {

    var video_list = [{
      title: "José Andrés: How a team of chefs fed Puerto Rico after Hurricane Maria",
      poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/122e98d18e724ddf4d68b83db28d6c4a8b9d3a1c_2880x1620.jpg",
      title_cn: "",
      videoUrl: "https://download.ted.com/talks/JoseAndres_2017X-320k.mp4",
      srtUrl: "https://ted2srt.org/api/talks/13778/transcripts/download/srt?lang=en",
      videoFileName: "123.mp4",
      srtFileName: "123.srt",
    },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
      }
    ]

    this.setState({video_list});
  }


  async download(url,path,key)
  {
    RNFS.mkdir(downloadDir);
    console.log(`###download: ${url} \r\n###to ${path}`);

    var that = this;
    const options = {
      fromUrl: url,
      toFile: path,
      background: true,
      begin: (res) => {
        console.log('begin', res);
        console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
      progress: (res) => {

        let pro = res.bytesWritten*1.0 / res.contentLength;
        console.log("progress:",res,pro)

        var params = {}
        params[key] = pro;
        this.setState(params);
      }
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise.then(res => {
        console.log('success', res);
        console.log('file://' + downloadDest)
      }).catch(err => {
        console.log('err', err);
      });
    }
    catch (e) {
      console.log(error);
    }

  }

  render()
  {

    var videos_views = [];

    if(!this.state.video_list)
    {
      return <View style={{
        flex: 1,
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
    }

    videos_views = this.state.video_list.map((item)=>{

     var key_srt = `progress_${item.srtFileName}`;
     var key_video = `progress_${item.videoFileName}`;

     var video_path = `${downloadDir}/${item.videoFileName}`;
     var srt_path = `${downloadDir}/${item.srtFileName}`;

     return <View style={{height:200,width:base.ScreenWidth,flexDirection:"row",padding:4,margin:4,marginBottom:8,borderWidth:1,}}>
               <View style={{width:150+2,height:190}}>
                 <Image style={{width:150,height:190,}} source={{uri:item.poster}} />
               </View>

               <View style={{width:base.ScreenWidth-180}}>
                 <Text>{item.title}</Text>

                 <Text style={{margin:10}} onPress={()=>this.download(item.videoUrl,video_path, key_video)}>下载视频 {this.state[key_video] ? this.state[key_video]*100 : 0 }%</Text>

                 <Text  style={{margin:10}} onPress={()=>this.download(item.srtUrl,srt_path,key_srt)} >下载字幕  {this.state[key_srt] ? this.state[key_srt]*100 : 0 }%</Text>

                 <Text style={{marginTop:20}} onPress={()=>{
                   this.props.navigation.navigate("Video",{videoPath:video_path,srtPath:srt_path})
                 }}>play</Text>

               </View>
      </View>
    });


    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        {videos_views}
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
_.mixin(VideoList.prototype,base.base_component);


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
(VideoList);


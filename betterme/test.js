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

import Tts from 'react-native-tts';
var SQLite = require('react-native-sqlite-storage')
var RNFS = require('react-native-fs');

class Test extends Component
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


  }


  async componentDidMount()
  {

  }


  async download(url,name)
  {

   ;
    var fromUrl = 'http://wvoice.spriteapp.cn/voice/2015/0818/55d2248309b09.mp3';
    var downloadDir = `${RNFS.DocumentDirectoryPath}/files/`;
    var downloadDest = `${downloadDir}/${name}`;
    RNFS.mkdir(downloadDir);

    console.log(`###download: ${fromUrl} \r\n###to ${downloadDest}`);

    const options = {
      fromUrl: fromUrl,
      toFile: downloadDest,
      background: true,
      begin: (res) => {
        console.log('begin', res);
        console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
      progress: (res) => {

        let pro = res.bytesWritten*1.0 / res.contentLength;
        console.log("progress:",res)
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
    var url = "https://pc.tedcdn.com/talk/stream/2017G/Blank/KasivaMutua_2017G-950k.mp4";
    var name = "KasivaMutua_2017G-950k.mp4";
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text onPress={()=>{this.download(url,name)}}>开始下载</Text>
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
_.mixin(Test.prototype,base.base_component);


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
(Test);


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
import Icon from 'react-native-vector-icons/FontAwesome';
import Tts from 'react-native-tts';
//var SQLite = require('react-native-sqlite-storage')
var RNFS = require('react-native-fs');
import CPagination from "../betterme/common/component/c_pagination"
import CCalendar from "../betterme/common/component/c_calendar"

//const fromUrl = 'http://wvoice.spriteapp.cn/voice/2015/0818/55d2248309b09.mp3';
const downloadDir = `${RNFS.DocumentDirectoryPath}/files/`;
const fromUrl = "http://assets.baicizhan.com/judu/xsk_1_3_none_srt.mp4";
const url = "http://assets.baicizhan.com/judu/xsk_1_3_none_srt.mp4";
const srt_url = "https://ted2srt.org/api/talks/13591/transcripts/download/srt?lang=en";

const name = "KasivaMutua_2017G-950k.mp4";
const downloadDest = `${downloadDir}/${name}`;
const srtDest = `${downloadDir}/KasivaMutua_2017G-950k.srt`;

import {UPDATE_DATA_STATUS} from "./common/redux/actions/actions.js"


const DownloadError = -100;
//
// import Realm from "realm"
import {DownloadItem} from "./db/models"

class Mine extends Component
{

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    var headerRight =   <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center",paddingRight:8,paddingLeft:8}}  activeOpacity={0.9}
                                          onPress={()=>navigation.navigate("Setting")}>
      <Icon name="cog" size={26} color="black" />
    </TouchableOpacity>

    return {headerRight,title:"我的"};
  };


  constructor(props)
  {
    super(props)
    this.state= {
        page:1,
        total_page:1
      }

  }

  async componentDidMount()
  {

    var video_list = [];
    video_list = [];

    this.props.user_info(this.load_package);
    this.props.statistics();
  }



  componentWillUnmount()
  {
  }



  render()
  {

    if(!this.props.data[base.URLS.user_info.name]
      || !this.props.data[base.URLS.user_info.name].data
      || !this.props.data[base.URLS.statistics.name]
      || !this.props.data[base.URLS.statistics.name].data
    )
    {
      return null;
    }

    var user_info = this.props.data[base.URLS.user_info.name].data;
    var user_info_status = this.props.data[base.URLS.user_info.name].status;

    var statistics = this.props.data[base.URLS.statistics.name].data;
    var statistics_status = this.props.data[base.URLS.statistics.name].status;


    var show_view = null;
    if(statistics_status ==  UPDATE_DATA_STATUS.FAILED|| user_info_status == UPDATE_DATA_STATUS.FAILED ||  (user_info && user_info.status !=1) || (statistics && statistics.status !=1))
    {
      show_view=<Text>加载失败</Text>
    }
    else if( user_info_status == UPDATE_DATA_STATUS.LOADING || statistics_status == UPDATE_DATA_STATUS.LOADING)
    {
      show_view=<View style={{
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
    else if(user_info_status == UPDATE_DATA_STATUS.SUCCEED || user_info_status == UPDATE_DATA_STATUS.SUCCEED)
    {
      var user_info_data = {};
      user_info_data = user_info.data;
      var package_ = user_info_data.package

      var package1 = null;
      var statistics_data = statistics.data;

      var userInfoView = null;

      if(user_info_data && user_info_data.package)
      {
        userInfoView = <View style={{height:100,backgroundColor:"#f2f2f2",justifyContent:"center",alignItems:"center"}}>
        <View style={{height:40,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
          <Icon name="id-badge" size={20} color="green" />
          <Text style={{marginLeft:4,fontSize:18} }>{base.getUserName(user_info_data.name)}</Text>

        </View>
          <Text style={{marginLeft:4,fontSize:12} }>正在学习: <Text style={{marginLeft:4,fontSize:14,color:"green"} }>{user_info_data.package.title_cn}</Text></Text>
      </View>
      }

      var statistics_view = null;
      var calendar_view = null;
      if(statistics_data)
      {
        var today = new Moment();

           var events = [];
           if(statistics_data.watched_video)
           {
             events = statistics_data.watched_video.map(item2=>item2[1]);
           }

           statistics_view = <View style={{backgroundColor:"white",borderTopWidth:1,borderColor:"#f2f2f2"}}>
             <View style={{flexDirection:"row",justifyContent:"space-around"}}>



               <View style={{flex:1,alignItems:"center",padding:10}}>
                 <Text  style={{fontSize:24,fontWeight:"bold",color:"green"}}>{statistics_data.listen_word_count}</Text>
                 <Text>听过单词数</Text>
               </View>
               
               <View style={{flex:1,alignItems:"center",padding:10}}>
                 <Text style={{fontSize:24,fontWeight:"bold",color:"green"}}>{statistics_data.watched_video_count}</Text>
                 <Text style={{}}>学习视频数</Text>
               </View>

               <View style={{flex:1,alignItems:"center",padding:10}}>
                 <Text  style={{fontSize:24,fontWeight:"bold",color:"green"}}>{statistics_data.finished_package_count}</Text>
                 <Text>完成专辑数</Text>
               </View>



             </View>
           </View>


          calendar_view =  <View style={{marginTop:20,backgroundColor:"white"}}>
              <View style={{justifyContent:"center",alignItems:"center",flex:1,padding:6,marginBottom:10}}>
              <Text style={{fontSize:16,fontWeight:"bold"}}>我的学习日历</Text>
              </View>
                <CCalendar width={base.ScreenWidth} today={today} events={events} style={{marginLeft:10,marginRight:10}} />
              </View>
       }
    }



    return (

        <ScrollView style={{flex:1,width:base.ScreenWidth}}>
          {userInfoView}
          {statistics_view}

          {calendar_view}
        </ScrollView>

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
      marginTop:20
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
_.mixin(Mine.prototype,base.base_component);


import { connect } from "react-redux";
import {videos,user_info,utypes,package_,statistics} from "./common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    videos:(page,utype_id,callback)=>{
      dispatch(videos({utype_id:utype_id,page:page},callback))
    },
    user_info:(call_back)=>{
      dispatch(user_info(call_back))
    },
    utypes:()=>{
      dispatch(utypes())
    },

    statistics:()=>{
      dispatch(statistics(null))
    },

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Mine);


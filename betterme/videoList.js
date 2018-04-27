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
var SQLite = require('react-native-sqlite-storage')
var RNFS = require('react-native-fs');
import CPagination from "../betterme/common/component/c_pagination"

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

class VideoList extends Component
{

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    var headerRight =   <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center",paddingRight:8,paddingLeft:8}}  activeOpacity={0.9}
                                          onPress={()=>navigation.navigate("Setting")}>
      <Icon name="cog" size={26} color="black" />
    </TouchableOpacity>


    var headerStyle = params.headerStyle;
    return {headerStyle, headerLeft:null, headerRight,title:"主页"};
  };


  constructor(props)
  {
    super(props)
    this.state= {
        page:1,
        total_page:1
      }

    this.load_package = this.load_package.bind(this);
  }

  load_package(data)
  {

    try
    {
      //console.log("+++",data)
      if(data && data.data && data.data.package_id)
      {
        this.props.package_(data.data.package_id,(data)=>{this.setState({my_package:data})});
      }
    }
    catch (e)
    {
      console.error(e);
    }

    return data;
  }

  async componentDidMount()
  {

    var video_list = [];
    video_list = [];

    this.props.user_info(this.load_package);

    var video_key_list = video_list.map((item)=>{});
    var orgin_download_state = {};
    this.setState({video_list, orgin_download_state});
  }



  componentWillUnmount()
  {
  }



  render()
  {

    if(!this.props.data[base.URLS.user_info.name]
      || !this.props.data[base.URLS.user_info.name].data
    )
      return null;

    var user_info = this.props.data[base.URLS.user_info.name].data;
    var user_info_status = this.props.data[base.URLS.user_info.name].status;


    var show_view = null;
    if(user_info_status == UPDATE_DATA_STATUS.FAILED ||  (user_info && user_info.status !=1))
    {
      show_view=<Text>加载失败</Text>
    }
    else if( user_info_status == UPDATE_DATA_STATUS.LOADING)
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
    else if(user_info_status == UPDATE_DATA_STATUS.SUCCEED)
    {
      var user_info_data = {};
      user_info_data = user_info.data;
      var package_ = user_info_data.package

      var videos_views = [];
      var package1 = null;
      if(this.state.my_package && this.state.my_package.data && this.state.my_package.data.videos)
      {
        var package1 = this.state.my_package.data;
        console.log("package1",package1)
        var videos_status = package1.videos_status

        videos_views = this.state.my_package.data.videos.map((item_) => {
          var vses = videos_status.filter(item1=>{return (item1[0]==item_.id && item1[1] == 2)}) //2是watched
          var item = { title:item_.title,
                   poster: item_.poster,
                   title_cn: item_.title_cn,
                   videoUrl: item_.video_url,
                   srtUrl:  item_.srt_url,
                   videoFileName:  item_.video_file_name,
                   srtFileName:   item_.srt_file_name,
                   otherSrtFileName:   item_.other_srt_file_name,
                   otherSrtUrl:  item_.other_srt_url,
                   id:item_.id,
                   utype_id:item_.utype_id,
                    finished:vses.length > 0
                 }


        console.log("video :",item);

        var key_srt = `progress_${item.srtFileName}`;
        var key_video = `progress_${item.videoFileName}`;

        var video_path = `${downloadDir}/${item.videoFileName}`;
        var srt_path = `${downloadDir}/${item.srtFileName}`;
        var other_srt_path = `${downloadDir}/${item.otherSrtFileName}`;


        let width_ = base.ScreenWidth / 3 - 20

        return <TouchableOpacity
          style={{height: 150, width: width_, flexDirection: "row", margin: 10, backgroundColor: "white"}}
          onPress={() => {
            this.props.navigation.navigate("Video", {
              videoUrl: item.videoUrl,
              videoPath: video_path,
              srtPath: srt_path,
              srtUrl: item.srtUrl,
              video_id: item.id,
              otherSrtUrl:item.otherSrtUrl,
              otherSrtPath:other_srt_path,
              package_id: package_.id
            })
          }}>

          <Image style={{width:width_,height:150,}} source={{uri:item.poster}} />

          <View style={{
            position: "absolute", bottom: 0, width: width_,padding:4
            , justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)"
          }}>
            <Text style={{fontSize:16,color: "white",textAlign:"center"}}>{item.title}</Text>
          </View>

          { item.finished == true?
            <View style={{width:30,height:30,borderRadius:15,backgroundColor:"green",justifyContent:"center",alignItems:"center",position:"absolute",right:4,top:4}}>
              <Icon name="check" size={20} color="white" />
            </View>:null}

          <View style={{width: width_ - 180}}>
          </View>
        </TouchableOpacity>
      });
      }


      show_view = <View>

        <View style={{flex:1,flexDirection:"row",padding:12,backgroundColor:"white"}}>

          <View style={{flex:3,flexDirection:"row",justifyContent:"flex-start",alignItems:"center"}}>
            <Icon name="id-badge" size={20} color="black" />
            <Text style={{marginLeft:4,fontSize:18} }>{base.getUserName(user_info_data.name)}</Text>
         </View>


          <View style={{flex:1,justifyContent:"center",alignItems:"flex-end"}}>
            <TouchableOpacity style={{borderWidth:1,padding:6,borderRadius:4}} onPress={()=>this.props.navigation.navigate("Wordbook")}>
              <Text style={{fontSize:18}}>{'收藏的单词'}</Text>
            </TouchableOpacity>
          </View>

        </View>

        {package_ ?
          <View style={{height: 100, flexDirection: "row", marginTop:4,paddingLeft: 10, paddingTop: 4, backgroundColor: "white"}}>
            <View style={{width:80,justifyContent:"center",alignItems:"center"}}>
              <Image style={{width: 75, height: 90,}} source={{uri: package_.poster}}/>
            </View>

            <View style={{flex: 2, marginLeft: 20, padding: 4}}>
              <View>
                <Text style={{fontSize: 20,fontWeight:"bold"}}>{package_.title_cn}</Text>
              </View>

              <View>
                <Text style={{fontSize: 16}}>{package_.title}</Text>
              </View>

              {package1&&package1.finished == true?
              <View style={{marginTop:6,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"green",width:120,padding:4,borderRadius:2,padding:6}}>
                <Icon name="check" size={16} color="white" /> <Text style={{fontSize:16,color:"white"}}>专辑完成</Text>
              </View>

                :null}

            </View>


            <View style={{flex:1,justifyContent:"center",alignItems:"flex-end"}}>
              <TouchableOpacity style={{borderWidth:1,padding:6,borderRadius:4,marginRight:10}} onPress={()=>this.props.navigation.navigate("Packages")}>
                <Text style={{fontSize:18}}>{'选新专辑'}</Text>
              </TouchableOpacity>
            </View>



          </View>:null
        }


        <View  style={{flex: 4, marginTop:8,backgroundColor:"white",flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap"}}>
          {videos_views}
        </View>
      </View>
    }

    return (

        <ScrollView style={{flex:1,width:base.ScreenWidth}}>
          {show_view}
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
import {videos,user_info,utypes,package_} from "./common/redux/actions/actions.js"


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

    package_:(id,callback)=>{
      dispatch(package_({id:id},callback))
    },

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(VideoList);


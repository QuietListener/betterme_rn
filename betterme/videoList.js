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
import CVideoItem from "./common/component/c_video_item"

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
    this.componentDidMount = this.componentDidMount.bind(this);
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

  componentDidMount()
  {

    console.log("componentDidMount  VideoList")
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
        var videos = this.state.my_package.data.videos;

        console.log("###videos_status")
        console.log(videos_status);
        var finished_length = 0;

        var videos_length = videos.length;

        videos_views = videos.map((item_) => {
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

          if(vses.length > 0)
            finished_length+=1;

        console.log("video :",item);

        var key_srt = `progress_${item.srtFileName}`;
        var key_video = `progress_${item.videoFileName}`;

        var video_path = `${downloadDir}/${item.videoFileName}`;
        var srt_path = `${downloadDir}/${item.srtFileName}`;
        var other_srt_path = `${downloadDir}/${item.otherSrtFileName}`;


        let width_ = base.ScreenWidth / 2 - 20

        return <CVideoItem navigation={this.props.navigation}
          width={width_} height={150}
                           videoUrl={item.videoUrl}
                           srtUrl={item.srtUrl}
                           otherSrtUrl={item.otherSrtUrl}
                           video_path={video_path}
                           srt_path={srt_path}
                           other_srt_path ={other_srt_path}
                           package_id={package_.id}
                           poster={item.poster}
                           title={item.title}
                           finished={item.finished}
                           video_id={item.id}
                           goBackCallBack={()=>{this.componentDidMount()}}
        />
      });
      }


      var gotoPackages = null;
      if(user_info_data && user_info_data.package_id == null)
      {
        gotoPackages = <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <View style={{flex:1,marginTop:base.ScreenWidth/3-50}}>
            <Text style={{fontSize:17,justifyContent:"flex-end",textAlign:"center"}}>你还没有学习的视频专辑~</Text>
            <Text style={{fontSize:17,justifyContent:"flex-end",textAlign:"center"}}>去选一个吧~</Text>
          </View>

          <TouchableOpacity
            onPress={()=>this.props.navigation.navigate("Packages")}
            style={[{width:base.ScreenWidth/2,height:base.ScreenWidth/2,borderRadius:base.ScreenWidth/4,backgroundColor:"red",marginTop:10,justifyContent:"center",alignItems:"center"},base.shadow]}>
            <Text style={{color:"white",fontSize:18}}>选择视频专辑</Text>
          </TouchableOpacity>
        </View>
      }

      var package_view = gotoPackages;

      var package_status_view = null;
      if(!!package1 && package1.finished == true)
      {
        package_status_view = <View style={[{flexDirection:"row",justifyContent:"center",alignItems:"center"}]}>

          <View style={[{flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"green",width:120},inner_styles.touchItem]}>
            <Icon name="check" size={14} color="white" />
            <Text style={{fontSize:14,color:"white"}}>专辑完成</Text>
          </View>

          <TouchableOpacity style={[inner_styles.touchItem,{backgroundColor:"red",marginLeft:6},base.shadow]}
                            onPress={()=>this.props.navigation.navigate("Packages")}>
            <Text style={{fontSize:13,color:"white"}}>{'选个新专辑吧~'}</Text>
          </TouchableOpacity>
        </View>
      }
      else
      {
          package_status_view =  <Text>进度:  <Text style={{fontSize:20,color:"green",fontWeight:"bold"}}>{finished_length}</Text>
            <Text style={{fontSize:18,color:"black",fontWeight:"bold"}}>/  {videos_length}</Text></Text>
      }


      if(!!package_)
      {
        package_view = <View style={{flex:1}}>

          <View style={{flex:1,alignItems:"center",justifyContent:"flex-end",padding:8}}>
          <Text style={{textAlign:"center"}}>正在学习的专辑</Text>
          </View>

          <View style={{height: 120, flexDirection: "row",paddingLeft: 10, paddingTop: 4, backgroundColor: "white"}}>
            <View style={{width:80,justifyContent:"center",alignItems:"center"}}>
            <Image style={{width: 75, height: 90,}} source={{uri: package_.poster}}/>
            </View>

            <View style={{flex: 2, marginLeft: 20, padding: 4}}>
              <View>
              <Text style={{fontSize: 14,fontWeight:"bold"}}>{package_.title_cn}</Text>
              </View>

              <View>
              <Text style={{fontSize: 12}}>{package_.title}</Text>
              </View>

              <View style={{flexDirection:"row",justifyContent:"flex-start",alignItem:"center",borderTopWidth:1,borderColor:"#f2f2",paddingTop:8}}>
                {package_status_view}
              </View>

            </View>

          </View>
        </View>
      }

      show_view = <View>

        <View style={{flex:1,flexDirection:"row",padding:4,backgroundColor:"white"}}>

          <TouchableOpacity
            onPress={()=>this.props.navigation.navigate("Mine")}
            style={{flex:1,flexDirection:"row",justifyContent:"flex-start",alignItems:"center",}}>
            <Icon name="id-badge" size={20} color="black" />
            <Text style={{marginLeft:4,fontSize:14} }>{base.getUserName(user_info_data.name)}</Text>
         </TouchableOpacity>


            <View style={{flex:2,flexDirection:"row",padding:0,paddingTop:6,paddingBottom:6,backgroundColor:"white"}}>

              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity style={inner_styles.touchItem} onPress={()=>this.props.navigation.navigate("Wordbook")}>
                  <Text style={{fontSize:14}}>{'单词本'}</Text>
                </TouchableOpacity>
              </View>


              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

                <TouchableOpacity style={inner_styles.touchItem}
                                  onPress={()=>{this.props.navigation.navigate("MyPackages",{goBackCallBack:this.componentDidMount})}}>
                  <Text style={{fontSize:14}}>我的专辑</Text>
                </TouchableOpacity>

              </View>


              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <TouchableOpacity style={[inner_styles.touchItem,{backgroundColor:"green"}]}
                                  onPress={()=>this.props.navigation.navigate("Packages")}>
                  <Text style={{fontSize:14,color:"white"}}>{' 选专辑 '}</Text>
                </TouchableOpacity>
              </View>

            </View>


        </View>

        {package_view}


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

  },
  touchItem:{borderWidth:1,padding:4,borderRadius:4,borderColor:"#f2f2"}

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


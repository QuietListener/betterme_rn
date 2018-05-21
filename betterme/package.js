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
import CVideoItem from "../betterme/common/component/c_video_item"

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

class Package extends Component
{

  static navigationOptions = ({ navigation }) => {
    // const { params = {} } = navigation.state;
    // var headerRight =   <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center",paddingRight:8,paddingLeft:8}}  activeOpacity={0.9}
    //                                       onPress={()=>navigation.navigate("Setting")}>
    //   <Icon name="cog" size={26} color="black" />
    // </TouchableOpacity>
    //
    //
    // var headerStyle = params.headerStyle;
    return {title:"选专辑"};
  };


  constructor(props)
  {
    super(props)
    const { state, setParams } = this.props.navigation;
    console.log("state.params.package_id",state.params.package_id);

    this.state= {
        page:1,
        package_id: state.params.package_id,
        total_page:1
      }

    this.star_callback = this.star_callback.bind(this);
    this.unstar_callback = this.unstar_callback.bind(this);
    this.add_package = this.add_package.bind(this);

  }

  componentDidMount()
  {
    this.props.package_(this.state.package_id,null);
  }

  componentWillUnmount()
  {

  }

  star_callback(data)
  {
    console.log("star_callback",data);

    if(data.status == 1)
    {
      this.setState({stared:true})
    }

    return data;
  }

  unstar_callback(data)
  {
    console.log("unstar_callback",data);
    if(data.status == 1)
    {
      this.setState({stared:false})
    }

    return data;
  }


  add_package()
  {
    this.props.add_my_package(this.state.package_id,()=>{this.props.navigation.navigate("VideoList")});
  }

  render()
  {

    if(!this.props.data
      || !this.props.data[base.URLS.package.name]
      || !this.props.data[base.URLS.package.name].data
    )
      return null;

    var data = this.props.data[base.URLS.package.name].data;
    var status = this.props.data[base.URLS.package.name].status;


    var words_data = data.data;
    var show_view = null;
    if(status == UPDATE_DATA_STATUS.FAILED ||  (data && data.status !=1))
    {
      show_view=<Text>加载失败</Text>
    }
    else if (status == UPDATE_DATA_STATUS.LOADING)
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
    else if(status == UPDATE_DATA_STATUS.SUCCEED)
    {
      var package_views = [];
      var package_ = data.data;
      var videos = package_.videos;
      let width_ = base.ScreenWidth / 2 - 20

      console.log("packages+++",data)


      var  like_btn = null;

      var started_ = false;
      var star_count = 0;
      if(this.state.stared != null)
      {
         star_count = package_.star_count;
         started_ = this.state.stared
         if(started_ == true)
         {
           star_count += 1;
         }
         else if(star_count > 0)
         {
           star_count-=1
         }
      }
      else
      {
        star_count = package_.star_count;
        started_ = package_.like;
      }

      console.log("started_",started_);
      var like_btn = <TouchableOpacity
        onPress={() => {
          started_ == false ? this.props.like_package(package_.id, this.star_callback)
            : this.props.unlike_package(package_.id, this.unstar_callback)
        }}
        style={{flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
        {
          started_?<Icon name="heart" size={26} color="#ff0066"/>:<Icon name="heart" size={26} color="#f2f2f2"/>
        }
        <Text style={{fontSize: 20, marginLeft: 4}}>{star_count}</Text>
      </TouchableOpacity>

      if(package_)
      {
        var videos_status = package_.videos_status

        var videos_view = videos.map(item_=>{

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
            finished:vses.length > 0,
          }


          var key_srt = `progress_${item.srtFileName}`;
          var key_video = `progress_${item.videoFileName}`;

          var video_path = `${downloadDir}/${item.videoFileName}`;
          var srt_path = `${downloadDir}/${item.srtFileName}`;
          var other_srt_path = `${downloadDir}/${item.otherSrtFileName}`;

          return  <CVideoItem navigation={this.props.navigation}
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
        })
      }
      console.log("data");

    }

    return (

      <View style={{flex:1}}>
        <ScrollView style={{flex:1,width:base.ScreenWidth}}>
          {package_ ?
            <View style={{backgroundColor: "white"}}>
            <View style={{height: 100, flexDirection: "row", paddingLeft: 10, paddingTop: 4}}>
              <View style={{width:base.ScreenWidth / 4}}>
                <Image style={{width: base.ScreenWidth / 4-10, height: 100,}} source={{uri: package_.poster}}/>
              </View>

              <View style={{flex: 2, marginLeft: 6, padding: 4}}>
                <View>
                  <Text style={{fontSize: 18,fontWeight:"bold"}}>{package_.title_cn}</Text>
                  <Text style={{fontSize: 16}}>{package_.title}</Text>
                </View>
              </View>
            </View>

              <Text style={{flex:11,padding:8,fontSize:10}} numberOfLines={6}>{package_.desc}</Text>
            </View>:null
          }


          {package_ ?
          <View style={{height:30,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"white",marginTop:6,marginBottom:6}}>

            <TouchableOpacity

              style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>

              <Icon name="eye" size={26} color="black" />
              <Text style={{fontSize:20,marginLeft:4}}>{package_.play_count}</Text>

            </TouchableOpacity>

            {like_btn}
          </View>
            :null
          }


          <View style={{marginTop:4,backgroundColor:"white",flexDirection:"row",flexWrap: "wrap"}}>
            {videos_view}

         </View>

        </ScrollView>

        <TouchableOpacity
          onPress={this.add_package}
          style={{position:"absolute",width:80,height:80,borderRadius:40,bottom:20,right:20,backgroundColor:"rgba(0,0,0,0.7)",borderColor:"white",borderWidth:1,justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:"white",fontSize:50,marginTop:-10}}>+</Text>
        </TouchableOpacity>
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
_.mixin(Package.prototype,base.base_component);

import { connect } from "react-redux";
import {videos,user_info,utypes,package_,like_package,unlike_package,add_my_package} from "./common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    package_:(id,callback)=>{
      dispatch(package_({id:id},callback))
    },
    like_package:(id,callback)=>{
      dispatch(like_package({package_id:id},callback))
    },
    unlike_package:(id,callback)=>{
      dispatch(unlike_package({package_id:id},callback))
    },
    add_my_package:(id,callback)=>{
      dispatch(add_my_package({package_id:id},callback))
    },

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Package);


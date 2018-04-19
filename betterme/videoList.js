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

    this.paginate = this.paginate.bind(this);
    this.goTo = this.goTo.bind(this);
    //this.realm = new Realm({schema: [DownloadItem]});
  }

  async componentDidMount()
  {

    // base.set_cookie("access_token","7110eda4d09e062aa5e4a390b0a572ac0d2c0220596",expire_in_seconds = 31536000, domain = "172.16.35.224")

    var video_list = [];
    video_list = [
    ];

    this.props.videos(this.state.page,null,this.paginate);
    this.props.user_info();
    this.props.utypes();
    //
    //  var url = `${base.HOBBY_DOMAIN}/api/videos.json`
    //
    // console.log(`HTTP: begin ${url}`);
    //  try
    //  {
    //    var res3 = await base.axios({method: "get", url: url});
    //    console.log(`HTTP: ${url} : res=${JSON.stringify(res3)}`);
    //    let data = res3.data;
    //    if(data && data.data)
    //    {
    //      video_list = data.data.map(item=>{
    //       return  {
    //          title:item.title,
    //          poster: item.poster,
    //          title_cn: item.title_cn,
    //          videoUrl: item.video_url,
    //          srtUrl:  item.srt_url,
    //          videoFileName:  item.video_file_name,
    //          srtFileName:   item.srt_file_name,
    //        }
    //      })
    //    }
    //  }
    //  catch(e)
    //  {
    //     console.error(e);
    //     alert("加载数据失败");
    //  }

    var video_key_list = video_list.map((item)=>{});

    var orgin_download_state = {};
    // try
    // {
    //   if(this.realm == null)
    //   {
    //     this.realm = await Realm.open({schema: [DownloadItem], deleteRealmIfMigrationNeeded: true});
    //   }
    //
    //   var download_items = this.realm.objects(DownloadItem.name)
    //   download_items.forEach((item)=>{
    //     orgin_download_state[item.id] = item.progress;
    //   })
    // }
    // catch(e)
    // {
    //     console.error(e);
    // }

    this.setState({video_list, orgin_download_state});
  }

  paginate(data)
  {
    if(data && data.data && data.data.total_page)
    {
      this.setState({total_page:data.data.total_page} );
    }

    console.log("paginate",data)
    return data;
  }

  componentWillUnmount()
  {
    if(this.realm)
    {
      try
      {
        this.realm.close()
      }
      catch(e)
      {
        e.close();
      }
    }
  }
  //
  // async createOrUpdate(modal,value)
  // {
  //
  //   try
  //   {
  //     if(this.realm == null)
  //     {
  //       this.realm = await Realm.open({schema: [modal], deleteRealmIfMigrationNeeded: true});
  //     }
  //
  //     this.realm.write(() => {
  //       this.realm.create(modal.name, value,true);
  //     });
  //   }
  //   catch(e)
  //   {
  //     console.error(e);
  //     try
  //     {
  //       this.realm.close();
  //     }
  //     catch(e1)
  //     {
  //       console.error(e1);
  //     }
  //   }
  // }

  // async download(url,path,key)
  // {
  //   RNFS.mkdir(downloadDir);
  //   console.log(`###download: ${url} \r\n###to ${path}`);
  //   alert(`###download: ${url} \r\n###to ${path}`)
  //
  //   var that = this;
  //   const options = {
  //     fromUrl: url,
  //     toFile: path,
  //     readTimeout:5000,
  //     background: true,
  //     begin: (res) => {
  //       alert(`开始下载`)
  //       console.log('begin', res);
  //       console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
  //
  //     },
  //     progress: (res) => {
  //
  //       let pro = res.bytesWritten*100.0 / res.contentLength
  //       console.log("progress:",res,pro)
  //
  //       if(pro%5 < 0.1)
  //       {
  //         that.createOrUpdate(DownloadItem,{id:key,progress:pro})
  //       }
  //       var params = {}
  //       params[key] = pro;
  //       that.setState(params);
  //     }
  //   };
  //   try {
  //     const ret = RNFS.downloadFile(options);
  //     ret.promise.then(res => {
  //       console.log('success', res);
  //       console.log('file://' + downloadDest)
  //       var params = {}
  //       params[key] = 100;
  //       this.setState(params);
  //       this.createOrUpdate(DownloadItem,{id:key,progress:100})
  //     }).catch(err => {
  //       console.log('err', err);
  //
  //       alert(err)
  //       that.createOrUpdate(DownloadItem,{id:key,progress:DownloadError})
  //       var params = {}
  //       params[key] = DownloadError;
  //       that.setState(params);
  //     });
  //   }
  //   catch (e) {
  //     console.error(e);
  //     alert(e)
  //
  //     that.createOrUpdate(DownloadItem,{id:key,progress:DownloadError})
  //     var params = {}
  //     params[key] = DownloadError;
  //     that.setState(params);
  //   }
  //
  // }


  goTo(page)
  {
    if(page <= 0)
      return;

    if(page > this.state.total_page)
      return;

    this.setState({page:page});
    this.props.videos(this.state.page,null,this.paginate);
  }


  render()
  {

    if(!this.props.data
      || !this.props.data[base.URLS.videos.name]
      || !this.props.data[base.URLS.videos.name].data
      || !this.props.data[base.URLS.user_info.name]
      || !this.props.data[base.URLS.user_info.name].data
      || !this.props.data[base.URLS.utypes.name]
      || !this.props.data[base.URLS.utypes.name].data
    )
      return null;

    var data = this.props.data[base.URLS.videos.name].data;
    var status = this.props.data[base.URLS.videos.name].status;

    var user_info = this.props.data[base.URLS.user_info.name].data;
    var user_info_status = this.props.data[base.URLS.user_info.name].status;

    var utypes = this.props.data[base.URLS.utypes.name].data;
    var utypes_status = this.props.data[base.URLS.utypes.name].status;


    var words_data = data.data;
    var show_view = null;
    if(utypes_status == UPDATE_DATA_STATUS.FAILED || user_info_status == UPDATE_DATA_STATUS.FAILED || status == UPDATE_DATA_STATUS.FAILED || (data && data.status !=1))
    {
      show_view=<Text>加载失败</Text>
    }
    else if(utypes_status == UPDATE_DATA_STATUS.LOADING || user_info_status == UPDATE_DATA_STATUS.LOADING || status == UPDATE_DATA_STATUS.LOADING)
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
      console.log(data);
      var data = data.data.videos;

      var utype_datas = [];
      var utype_map = {}
      console.log("utypes.data",utypes.data);
      if(utypes && utypes.data)
      {
        utype_datas = utypes.data;
        utype_datas.forEach(item=>{
          utype_map[item.id] = item;
        })
      }

      console.log("utype_map",utype_map);

      var videos_views = [];
      videos_views = data.map((item_) => {

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
                   utype_id:item_.utype_id
                 }


        console.log("video :",item);

        var key_srt = `progress_${item.srtFileName}`;
        var key_video = `progress_${item.videoFileName}`;

        var video_path = `${downloadDir}/${item.videoFileName}`;
        var srt_path = `${downloadDir}/${item.srtFileName}`;
        var other_srt_path = `${downloadDir}/${item.otherSrtFileName}`;

        var progress_video = null;
        if (this.state[key_video])
        {
          progress_video = this.state[key_video];
        }
        else if (this.state.orgin_download_state)
        {
          progress_video = this.state.orgin_download_state[key_video];
        }

        var progress_video_str = null;
        if (progress_video)
        {
          if (progress_video >= 0)
          {
            progress_video_str = `${progress_video.toFixed(1)}%`;
          }
          else if (progress_video == DownloadError)
          {
            progress_video_str = "下载失败请重试"
          }
        }


        var progress_srt = null;
        if (this.state[key_video])
        {
          progress_srt = this.state[key_srt];
        }
        else if (this.state.orgin_download_state)
        {
          progress_srt = this.state.orgin_download_state[key_srt];
        }

        var progress_srt_str = null;
        if (progress_srt)
        {
          if (progress_srt >= 0)
          {
            progress_srt_str = `${progress_srt.toFixed(1)}%`;
          }
          else if (progress_srt == DownloadError)
          {
            progress_srt_str = "下载失败请重试"
          }
        }

        let width_ = base.ScreenWidth / 2 - 20

        var utype_view = null;
        if(item.utype_id && utype_map[item.utype_id])
        {
          let utype_ = utype_map[item.utype_id];
          utype_view = <TouchableOpacity style={{position:"absolute",top:4,right:4,padding:6,backgroundColor:"rgba(0,0,0,0.6)",borderRadius:2}}><Text style={{color:"white"}}>{utype_.name}</Text></TouchableOpacity>
          //console.log("utype_.name",utype_.name);
        }

        return <TouchableOpacity
          style={{height: 200, width: width_, flexDirection: "row", margin: 10, backgroundColor: "white"}}
          onPress={() => {
            this.props.navigation.navigate("Video", {
              videoUrl: item.videoUrl,
              videoPath: video_path,
              srtPath: srt_path,
              srtUrl: item.srtUrl,
              video_id: item.id,
              otherSrtUrl:item.otherSrtUrl,
              otherSrtPath:other_srt_path,
            })
          }}>

          <Image style={{width:width_,height:200,}} source={{uri:item.poster}} />

          {utype_view}

          <View style={{
            position: "absolute", bottom: 0, width: width_,padding:4
            , justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)"
          }}>

            <Text style={{fontSize:16,color: "white",textAlign:"center"}}>{item.title}</Text>
          </View>

          <View style={{width: width_ - 180}}>

            {/*<Text style={{margin:10}} onPress={()=>this.download(item.videoUrl,video_path, key_video)}>下载视频 {progress_video_str}</Text>*/}

            {/*<Text  style={{margin:10}} onPress={()=>this.download(item.srtUrl,srt_path,key_srt)} >下载字幕  {progress_srt_str}</Text>*/}
          </View>
        </TouchableOpacity>
      });


      var user_info_data = {};
      user_info_data = user_info.data;

      show_view = <View>

        <View style={{flex:1,flexDirection:"row",padding:12,backgroundColor:"white"}}>

          <View style={{flex:3,flexDirection:"row",justifyContent:"flex-start",alignItems:"center"}}>
            <Icon name="id-badge" size={20} color="black" />
            <Text style={{marginLeft:4,fontSize:18} }>{base.getUserName(user_info_data.name)}</Text>
         </View>


          <View style={{flex:1,justifyContent:"center",alignItems:"flex-end"}}>
            <TouchableOpacity style={{borderWidth:1,padding:4,borderRadius:4}} onPress={()=>this.props.navigation.navigate("Wordbook")}>
              <Text style={{fontSize:16}}>{'收藏的单词'}</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View  style={{flex: 4, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap"}}>
          {videos_views}
        </View>
      </View>
    }

    return (

        <ScrollView style={{flex:1,width:base.ScreenWidth}}>
          {show_view}
          <CPagination page={this.state.page} total_page={this.state.total_page} goTo={this.goTo}></CPagination>

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
import {videos,user_info,utypes} from "./common/redux/actions/actions.js"


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
    user_info:()=>{
      dispatch(user_info())
    },
    utypes:()=>{
      dispatch(utypes())
    },

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(VideoList);


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


const DownloadError = -100;
//
// import Realm from "realm"
import {DownloadItem} from "./db/models"

class VideoList extends Component
{
  constructor(props)
  {
    super(props)
    this.state={
    }

    //this.realm = new Realm({schema: [DownloadItem]});
  }


  async componentDidMount()
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
      },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
      },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
      },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
      },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
      },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
      },
      {
        title: "Malika Whitley: How the arts help homeless youth heal and build",
        poster: "https://pi.tedcdn.com/r/pe.tedcdn.com/images/ted/01d7d581e5beecfab87e575bb301ef5c1b9d8859_2880x1620.jpg",
        title_cn: "",
        videoUrl: "https://download.ted.com/talks/MalikaWhitley_2017S-320k.mp4",
        srtUrl: "https://ted2srt.org/api/talks/13022/transcripts/download/srt?lang=en",
        videoFileName: "124.mp4",
        srtFileName: "124.srt",
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

    this.setState({video_list,orgin_download_state});
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

     var progress_video = null;
     if(this.state[key_video])
     {
       progress_video = this.state[key_video];
     }
     else if(this.state.orgin_download_state)
     {
       progress_video = this.state.orgin_download_state[key_video];
     }

     var progress_video_str = null;
     if(progress_video)
     {
          if(progress_video>=0)
          {
            progress_video_str = `${progress_video.toFixed(1)}%`;
          }
          else if(progress_video == DownloadError)
          {
            progress_video_str = "下载失败请重试"
          }
     }


      var progress_srt = null;
      if(this.state[key_video])
      {
        progress_srt = this.state[key_srt];
      }
      else if(this.state.orgin_download_state)
      {
        progress_srt = this.state.orgin_download_state[key_srt];
      }

      var progress_srt_str = null;
      if(progress_srt)
      {
        if(progress_srt>=0)
        {
          progress_srt_str = `${progress_srt.toFixed(1)}%`;
        }
        else if(progress_srt == DownloadError)
        {
          progress_srt_str = "下载失败请重试"
        }
      }

      let width_ = base.ScreenWidth/2-20


     return <TouchableOpacity style={{height:200,width:width_,flexDirection:"row",margin:10,backgroundColor:"white"}}
                  onPress={()=>{ this.props.navigation.navigate("Video",{videoUrl:item.videoUrl,videoPath:video_path,srtPath:srt_path,srtUrl:item.srtUrl})}}>

               {/*<Image style={{width:width_,height:200,}} source={{uri:item.poster}} />*/}


               <View style={{position:"absolute",bottom:0,width:width_
                 ,justifyContent:"center",alignItems:"center",backgroundColor:"black"}}>
                 <Text style={{color:"white"}}>{item.title}</Text>
               </View>

       <View style={{width:width_-180}}>

                 {/*<Text style={{margin:10}} onPress={()=>this.download(item.videoUrl,video_path, key_video)}>下载视频 {progress_video_str}</Text>*/}

                 {/*<Text  style={{margin:10}} onPress={()=>this.download(item.srtUrl,srt_path,key_srt)} >下载字幕  {progress_srt_str}</Text>*/}
               </View>
      </TouchableOpacity>
    });


    return (

        <ScrollView style={{flex:1,width:base.ScreenWidth}}>
          <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",alignItems:"center",flexWrap:"wrap"}}>
          {videos_views}
          </View>
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


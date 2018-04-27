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

class Packages extends Component
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
    this.props.packages(this.state.page,this.paginate);
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

  }

  goTo(page)
  {
    if(page <= 0)
      return;

    if(page > this.state.total_page)
      return;

    this.setState({page:page});
    this.props.packages(this.state.page,this.paginate);
  }


  render()
  {

    if(!this.props.data
      || !this.props.data[base.URLS.packages.name]
      || !this.props.data[base.URLS.packages.name].data
    )
      return null;

    var data = this.props.data[base.URLS.packages.name].data;
    var status = this.props.data[base.URLS.packages.name].status;

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
      var packages = data.data.packages;

      let width_ = base.ScreenWidth / 2 - 20

      console.log("packages+++",data)

      if(packages)
      {
        package_views = packages.map(item=>{
          return <TouchableOpacity
            style={{height: 200, width: width_, flexDirection: "row", margin: 10, backgroundColor: "white"}}
            onPress={() => {
              this.props.navigation.navigate("Package_")
            }}>

            <Image style={{width:width_,height:200,}} source={{uri:item.poster}} />

            <View style={{
              position: "absolute", bottom: 0, width: width_,padding:4
              , justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)"
            }}>

              <Text style={{fontSize:16,color: "white",textAlign:"center"}}>{item.title_cn}</Text>
              <Text style={{fontSize:16,color: "white",textAlign:"center"}}>{item.title}</Text>
            </View>

            <View style={{width: width_ - 180}}>

            </View>
          </TouchableOpacity>
        })
      }
      console.log("data");

    }


    return (

        <ScrollView style={{flex:1,width:base.ScreenWidth}}>
          {package_views}
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
_.mixin(Packages.prototype,base.base_component);


import { connect } from "react-redux";
import {videos,user_info,utypes,packages} from "./common/redux/actions/actions.js"


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

    packages:(page,callback)=>{
      dispatch(packages({page:page},callback))
    },

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Packages);


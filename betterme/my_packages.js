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
import CPackageItem from "../betterme/common/component/c_package_item"

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

class MyPackages extends Component
{

  static navigationOptions = ({ navigation }) => {
    return {title:"我的专辑"};
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
    this.props.my_packages(1,null)
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

    if(!this.props.data[base.URLS.my_packages.name]
      || !this.props.data[base.URLS.my_packages.name].data
    )
      return null;

    var my_package_data = this.props.data[base.URLS.my_packages.name].data;
    var my_package_status = this.props.data[base.URLS.my_packages.name].status;

    var show_view = null;
    if(my_package_status == UPDATE_DATA_STATUS.FAILED ||(my_package_data&&my_package_data.status !=1))
    {
      show_view=<Text>加载失败</Text>
    }
    else if ( my_package_status == UPDATE_DATA_STATUS.LOADING)
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
    else if(my_package_status == UPDATE_DATA_STATUS.SUCCEED)
    {
      var liked_package_views = [];
      var finished_package_views = [];
      var played_package_views = []
      var packages = my_package_data.data;

      console.log("packages +++",packages);
      let width_ = base.ScreenWidth / 3 - 20
      let height_ = width_*4/3;

      var my_packages = my_package_data.data;
      console.log("my_packages",my_packages);

      if(packages)
      {
        liked_package_views = packages.filter(item1=>{return item1.ttype==1}).map(item12=>{
          var item =item12.package;
          if(!item)  return null

          return <CPackageItem poster={item.poster} package_id={item.id} title={item.title} title_cn={item.title_cn} finished={false} height={height_} width={width_} navigation={this.props.navigation}/>
        })


        finished_package_views = packages.filter(item1=>{return item1.ttype==0}).map(item12=>{
          var item =item12.package;
          if(!item)  return null

          return <CPackageItem poster={item.poster} package_id={item.id} title={item.title} title_cn={item.title_cn} finished={false} height={height_} width={width_} navigation={this.props.navigation}/>
        })

        played_package_views = packages.filter(item1=>{return item1.ttype==2}).map(item12=>{
          var item =item12.package;
          if(!item)  return null

          return <CPackageItem poster={item.poster} package_id={item.id} title={item.title} title_cn={item.title_cn} finished={false} height={height_} width={width_} navigation={this.props.navigation}/>
        })

      }

    }


    return (

      <ScrollView>
        <View style={{flex:1}}>
          {show_view}

          <View style={[inner_styles.packageBox,{marginTop:0}]}>
            <View style={[inner_styles.tiphead,{marginTop:0}]}><Text style={inner_styles.title}>我收藏的专辑</Text></View>
            <View style={{flex:1,flexWrap:"wrap",flexDirection:"row",marginTop:6}}>
            {liked_package_views}
            </View>
          </View>

          <View style={inner_styles.packageBox}>
            <View style={inner_styles.tiphead}><Text style={inner_styles.title}>我完成的专辑</Text></View>
            <View style={{flex:1,flexWrap:"wrap",flexDirection:"row",marginTop:6}}>
              {finished_package_views}
            </View>
          </View>



          <View style={inner_styles.packageBox}>
            <View style={inner_styles.tiphead}><Text style={inner_styles.title}>我播放过的专辑</Text></View>
            <View style={{flex:1,flexWrap:"wrap",flexDirection:"row",marginTop:6}}>
              {played_package_views}
            </View>
          </View>



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

  },
  tiphead:{
    backgroundColor:"#999",
    padding:6,
    fontWeight:"bold",
    alignItems:"flex-start"
  },
  packageBox:{
    flex:1,
    marginBottom:4,
    marginTop:20
  },
  title:{fontSize:16,color:"white",fontWeight:"bold"}


};



import _ from "lodash"
_.mixin(MyPackages.prototype,base.base_component);


import { connect } from "react-redux";
import {videos,user_info,utypes,packages,my_packages} from "./common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    user_info:()=>{
      dispatch(user_info())
    },

    my_packages:(page,callback)=>{
      dispatch(my_packages({page:page},callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(MyPackages);


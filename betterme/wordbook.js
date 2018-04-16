/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, ActivityIndicator,AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';

import Moment from "moment"
import * as base from "./common/base"
const DeviceInfo = require('react-native-device-info');
import Orientation from 'react-native-orientation';

const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')
//import fs from "fs"

import Tts from 'react-native-tts';
import {UPDATE_DATA_STATUS} from "./common/redux/actions/actions.js"


const DownloadError = -100;
class Wordbook extends Component
{
  constructor(props)
  {
    super(props)
    this.state={
    }
  }


  componentDidMount()
  {
    base.set_cookie("access_token","7110eda4d09e062aa5e4a390b0a572ac0d2c0220596",  31536000,   "172.16.35.224")

    //setTimeout(()=>this.props.get_my_words(1),1000)
  }


  componentWillUnmount()
  {

  }

  mean_cn_view(mean_cn)
  {
    if(!mean_cn)
    {
      return null;
    }

    var mean_cn_view = null;
    try
    {
      mean_cn_view= JSON.parse(mean_cn).map(item => {
        return <View style={{flex: 1}}><Text style={{color: "black"}}>{item}</Text></View>
      });
    }
    catch(e)
    {
      mean_cn_view = <View sytle={{flex: 1,color: "black"}}>{mean_cn}</View>
    }

    return mean_cn_view;
  }

  render()
  {

    // if(!this.props.data || !this.props.data[base.URLS.my_words.name])
    //   return null;

    // var data = this.props.data[base.URLS.my_words.name].data;
    // var status = this.props.data[base.URLS.my_words.name].status;

    var data = {"status":1,"smsg":"ok","data":[{"id":1,"user_id":6,"learn_word_id":100,"status":0,"created_at":"2018-01-01T12:12:12.000+08:00","updated_at":"2018-01-01T12:12:12.000+08:00","video_id":1,"subtitle":null,"learn_word":{"id":100,"word":"abates","accent":null,"mean_cn":"[\"n. 双硫磷\",\"vi. 减缓（abate的第三人称单数形式）\"]","word_audio":null,"created_at":"2017-05-29T09:55:27.000+08:00","updated_at":"2017-05-29T09:55:27.000+08:00","accent_en":null}},{"id":2,"user_id":6,"learn_word_id":35380,"status":0,"created_at":"2018-04-16T14:32:47.000+08:00","updated_at":"2018-04-16T14:32:47.000+08:00","video_id":null,"subtitle":null,"learn_word":{"id":35380,"word":"good","accent":"[ɡʊd]","mean_cn":"[\"adj. 好的；优良的；愉快的；虔诚的\",\"n. 好处；善行；慷慨的行为\",\"adv. 好\",\"n. (Good)人名；(英)古德；(瑞典)戈德\"]","word_audio":null,"created_at":"2017-05-29T10:01:55.000+08:00","updated_at":"2017-05-29T10:01:55.000+08:00","accent_en":"[gʊd]"}},{"id":3,"user_id":6,"learn_word_id":202777,"status":0,"created_at":"2018-04-16T14:34:50.000+08:00","updated_at":"2018-04-16T14:34:50.000+08:00","video_id":null,"subtitle":null,"learn_word":{"id":202777,"word":"NAP","accent":"[næp]","mean_cn":"[\"n. 小睡，打盹儿；细毛；孤注一掷\",\"vt. 使拉毛\",\"vi. 小睡；疏忽\",\"n. (Nap)人名；(朝、越)纳\"]","word_audio":null,"created_at":"2017-05-29T13:55:54.000+08:00","updated_at":"2017-05-29T13:55:54.000+08:00","accent_en":"[næp]"}},{"id":4,"user_id":6,"learn_word_id":48750,"status":0,"created_at":"2018-04-16T14:34:53.000+08:00","updated_at":"2018-04-16T14:34:53.000+08:00","video_id":null,"subtitle":null,"learn_word":{"id":48750,"word":"love","accent":"[lʌv]","mean_cn":"[\"n. 恋爱；亲爱的；酷爱；喜爱的事物；爱情，爱意；疼爱；热爱；爱人，所爱之物\",\"v. 爱，热爱；爱戴；赞美，称赞；喜爱；喜好；喜欢；爱慕\",\"n. （英）洛夫（人名）\"]","word_audio":null,"created_at":"2017-05-29T10:05:47.000+08:00","updated_at":"2017-05-29T10:05:47.000+08:00","accent_en":"[lʌv]"}},{"id":5,"user_id":6,"learn_word_id":184727,"status":0,"created_at":"2018-04-16T14:42:07.000+08:00","updated_at":"2018-04-16T14:42:07.000+08:00","video_id":null,"subtitle":"{\"start\":12580,\"end\":14116,\"text\":\"Don't you love a good nap?\"}","learn_word":{"id":184727,"word":"Don't","accent":"[dont]","mean_cn":"[\"n. 禁忌（等于do not）\"]","word_audio":null,"created_at":"2017-05-29T13:36:48.000+08:00","updated_at":"2017-05-29T13:36:48.000+08:00","accent_en":"[dəʊnt]"}}]};


    var words = data.data;
     var show_view = null;
    // if(status == UPDATE_DATA_STATUS.FAILED)
    // {
    //   show_view=<Text>加载失败</Text>
    // }
    // else if(status == UPDATE_DATA_STATUS.LOADING)
    // {
    //   show_view=<ActivityIndicator
    //     animating={true}
    //     style={{
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       width:16,height:16,
    //     }}
    //     size="small"
    //   />
    // }
    // else if(status == UPDATE_DATA_STATUS.SUCCEED)
    // {
    //   show_view =  <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
    //         <Text>{JSON.stringify(data)}</Text>
    //   </View>
    // }

    var words_view = [];
    if(words.length > 0 )
    {
      words_view = words.map(item=>{

        let learn_word = item.learn_word;
        if(!learn_word)
          return null;


        return <View style={{height:80,width:base.ScreenWidth-60}}>
            <View style={{flex:1,flexDirection:"row"}} >
              <Text>{learn_word.word}</Text>
              <Text style={{marginLeft:20}}>{learn_word.accent}</Text>
            </View>
          <View style={{flex:1,flexDirection:"row",flexWrap:"wrap"}} >
            <Text>{this.mean_cn_view(learn_word.mean_cn)}</Text>
          </View>
        </View>
      })
    }

    show_view =  <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
              {words_view}
         </View>

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
_.mixin(Wordbook.prototype,base.base_component);


import { connect } from "react-redux";
import {get_my_words} from "./common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    get_my_words:(page)=>{

      dispatch(get_my_words({page:page}))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Wordbook);


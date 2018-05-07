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
import Icon from 'react-native-vector-icons/FontAwesome';
import CPagination from "../betterme/common/component/c_pagination"

const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')
//import fs from "fs"

import Tts from 'react-native-tts';
Tts.addEventListener('tts-start', (event) => console.log("start", event));
Tts.addEventListener('tts-finish', (event) => console.log("finish", event));
Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

import {UPDATE_DATA_STATUS} from "./common/redux/actions/actions.js"


const DownloadError = -100;
class Wordbook extends Component
{

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return { title:"单词本"};
  };

  constructor(props)
  {
    super(props)
    this.state={
      show_mean:true,
      page:1,
      total_page:1,
    }

    this.read_word = this.read_word.bind(this);
    this.paginate = this.paginate.bind(this);
    this.goTo = this.goTo.bind(this);
  }


  componentDidMount()
  {
    //base.set_cookie("access_token","7110eda4d09e062aa5e4a390b0a572ac0d2c0220596",  31536000,   "172.16.35.224")
    //
    // base.set_cookie("access_token","7110eda4d09e062aa5e4a390b0a572ac0d2c0220596",  31536000,   "192.168.1.101")
    this.goTo(this.state.page);
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


  componentWillReceiveProps(props)
  {
    if(props)
    {
      if(this.state.key != props.key)
      {
        this.setState({key:props.key});
        this.componentDidMount();
      }
    }
  }

  componentWillUnmount()
  {

  }


  read_word(word)
  {
    if(word)
    {
      Tts.getInitStatus().then(() => {
        Tts.speak(word);
      });
    }
  }

  mean_cn_view(mean_cn)
  {
    if(!mean_cn)
    {
      return null;
    }

    var ret = null;
    try
    {
      ret= JSON.parse(mean_cn).map(item => {
        return item
      });

      ret = ret.join(";  ")
    }
    catch(e)
    {
      ret = mean_cn
    }

    return ret;
  }

  subtitlePressed(subtitleObj)
  {
    if(this.props.onSubtitlePress)
      this.props.onSubtitlePress(subtitleObj)
  }

  goTo(page)
  {
    if(page <= 0)
      return;

    if(page > this.state.total_page)
      return;

    this.setState({page:page});
    this.props.get_my_words(this.props.video_id||'',page,this.paginate)
  }

  render()
  {

    if(!this.props.data || !this.props.data[base.URLS.my_words.name] || !this.props.data[base.URLS.my_words.name].data)
      return null;

    var data = this.props.data[base.URLS.my_words.name].data;
    var status = this.props.data[base.URLS.my_words.name].status;


    var words_data = data.data;
    var show_view = null;
    if(status == UPDATE_DATA_STATUS.FAILED || (data && data.status !=1))
    {
      show_view=<Text>加载失败</Text>
    }
    else if(status == UPDATE_DATA_STATUS.LOADING)
    {
      show_view=<View style={{flex:1,paddingTop:30,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator
        animating={true}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width:16,height:16,
        }}
        size="large"
      />
      </View>
    }
    else if(status == UPDATE_DATA_STATUS.SUCCEED)
    {


    //  alert(JSON.stringify(data));
    var words_view = [];

    var words = words_data.words;
    if(words.length > 0 )
    {

      words_view = words.map(item=>{

        let learn_word = item.learn_word;
        if(!learn_word)
          return null;


        var date = null;
        try
        {
          date = new Moment(item.updated_at).format("YYYY-MM-DD");
        }catch(e)
        {
          console.error(e);
        }
        var subtitle = item.subtitle;

        var subtitle_text = null;
        if(subtitle)
        {
          try
          {
            var subtitleObj = JSON.parse(subtitle);
            subtitle_text = subtitleObj.text;
          }
          catch(e)
          {
            subtitle_text = null;
          }

        }

        console.log(item);
        var video = item.video;


        return <View style={{width:base.ScreenWidth-30,borderBottomWidth:1,borderTopWidth:1, padding:8,margin:6,borderRadius:6,borderColor:"#f2f2f2"}}>
            <View style={{flex:1,flexDirection:"row"}} >
              <View style={{flexDirection:"row",flex:6,justifyContent:"flex-start",alignItems:"center",marginBottom:4}}>
                <Text style={{fontSize:20}}>{learn_word.word}</Text>
                <Text style={{marginLeft:20}}>{learn_word.accent}</Text>
              </View>

              <View  style={{flex:1,justifyContent:"center",alignItems:"flex-end"}}>

              <TouchableOpacity style={{justifyContent:"center",alignItems:"flex-end",padding:8,paddingBottom:4}}
                                onPress={() => { this.read_word(learn_word.word)} }>
                <Icon name="volume-up" size={18} color="black" />
              </TouchableOpacity>
            </View>

            </View>

          <View style={{flex:1,flexDirection:"row",flexWrap:"wrap",alignItems:"flex-start"}} >
            <Text style={inner_styles.tip}>词意</Text><Text style={{flex:1,fontWeight:"bold",fontSize:13}}>{this.mean_cn_view(learn_word.mean_cn)}</Text>
          </View>

          {subtitle_text?
          <TouchableOpacity
            onPress={()=>{this.subtitlePressed(subtitleObj)}}
            style={{flex:1,flexDirection:"row",flexWrap:"wrap",alignItems:"flex-start",marginTop:4}} >
            <Text style={inner_styles.tip}>字幕</Text><Text style={{fontWeight:"bold",flex:1,fontSize:13}}>{subtitle_text}</Text>
          </TouchableOpacity>:null}

          {this.props.show_video_title != false && video && video.title?
            <View style={{flex:1,flexDirection:"row",flexWrap:"wrap",alignItems:"flex-start",marginTop:4}} >
              <Text style={inner_styles.tip}>视频</Text><Text style={{flex:1,fontSize:12}}>{video.title}</Text>
            </View>:null}

          <View style={{flex:1,flexDirection:"row",justifyContent:'flex-end',flexWrap:"wrap",alignItems:"flex-start",marginTop:4}} >
            <Text style={[inner_styles.tip,{borderWidth:0}]}>{date}</Text>
          </View>

        </View>
      })
    }

    show_view =  <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
              {words_view}
      {
        (words && words.length > 0) ?<CPagination page={this.state.page} total_page={this.state.total_page} goTo={this.goTo}></CPagination>:

          <View style={{alignItems:"center",justifyContent:"flex-start"}}>
            <Text style={{fontSize:16,color:"red"}}> 点击字幕上的单词可以查词喔~</Text>
        </View>

      }
         </View>
    }




    return (
        <ScrollView style={[{flex:1,backgroundColor:"white",width:base.ScreenWidth}]}>
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
    fontSize:14,
    color:"rgb(0,0,0)",
  },

  normal_text:{
    fontSize:12,
    color:"rgb(177,180,183)"

  },

  tip:{
    marginRight:8,
    fontSize:12,
    borderWidth:1
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
    get_my_words:(video_id,page,call_back)=>{
      dispatch(get_my_words({video_id:video_id,page:page},call_back))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Wordbook);


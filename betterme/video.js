/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, Modal,ActivityIndicator,PanResponder,StyleSheet,Slider,TouchableOpacity, ScrollView,Alert,Switch, AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Moment from "moment"
import * as base from "./common/base"
const DeviceInfo = require('react-native-device-info');
import Video from "react-native-video"
import Orientation from 'react-native-orientation';
var RNFS = require('react-native-fs');


const Subtitle = require('subtitle')
const { parse, stringify, stringifyVtt, resync, toMS, toSrtTime, toVttTime } = require('subtitle')
//import fs from "fs"

var RNFS = require('react-native-fs');
import Tts from 'react-native-tts';
Tts.addEventListener('tts-start', (event) => console.log("start", event));
Tts.addEventListener('tts-finish', (event) => console.log("finish", event));
Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

const meanWidth = 300
const ProgressShowTime = 15000

var chineseReg = /[\u4e00-\u9fa5]/g

class Video_ extends Component
{
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    var headerStyle = {height:0};
    return {headerStyle,headerLeft:null};
  };


  constructor(props)
  {
    super(props)

    const { state, setParams } = this.props.navigation;

    var videoPath = null;
    var srtPath = null;
    var otherSrtPath = null;
    var videoUrl = null;
    var srtUrl = null;
    var otherSrtUrl = null;
    var video_id = null;

    if(state && state.params)
    {
      videoPath = state.params.videoPath;
      srtPath =  state.params.srtPath;
      videoUrl = state.params.videoUrl;
      srtUrl =  state.params.srtUrl;
      video_id = state.params.video_id
      otherSrtUrl = state.params.otherSrtUrl;
      otherSrtPath = state.params.otherSrtPath;
    }

    console.log({srtPath,otherSrtUrl,videoPath})

    this.state={
      backgroundVideo: {
        width:base.ScreenWidth,
        height:base.ScreenHeight
      },
      show_srt_index:-1,
      show_srt_index1:-1,
      paused:false,
      popup_left:-1000,
      popup_top:0,
      videoPath:videoPath,
      srtPath:srtPath,
      srtUrl:srtUrl,
      otherSrtUrl:otherSrtUrl,
      loadingMean:false,
      orientation:"LANDSCAPE",
      videoUrl:videoUrl,
      showProgressBar:true,
      video_id:video_id,
      subtitleFontSize:20,
      show_subtitle_en:true,
      show_subtitle_other:true,
      rate:1.0,
      showSettingModal:false,
    }

    console.log('video state:',this.state);

    this.setTime = this.setTime.bind(this);
    this.troggle_video = this.troggle_video.bind(this);
    this.measure = this.measure.bind(this);
    this.read_word = this.read_word.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.loadStart = this.loadStart.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.showProgress = this.showProgress.bind(this);
    this.videoError = this.videoError.bind(this);
    this.save_word = this.save_word.bind(this);
    this.englishPercent = this.englishPercent.bind(this);
    this._orientationLisener = this._orientationLisener.bind(this);
    RNFS.exists(videoPath).then(videoFileExist=>this.setState({videoFileExist:videoFileExist}));

    this.load_file = this.load_file
    var that = this;
    [{path:srtPath,url:srtUrl},{path:otherSrtPath,url:otherSrtUrl}].forEach((item_,index)=>{

      var filePath_ = item_.path;
      var srtUrl_ = item_.url;
      this.load_file(filePath_,srtUrl_,index);

    });

    Orientation.lockToLandscape();

  }


  load_file(filePath_,srtUrl_,index)
  {
    var that = this;
    RNFS.exists(filePath_).then((srtFileExist)=>{
    console.log("##>>",index);

    if(srtFileExist == true)
    {
      //alert("srt exist")
      RNFS.readFile(filePath_).then(data=>{
        //console.log("srt",data);
        var srt_data = parse(data);
        if(index == 0)
        {
          that.setState({srt_data});
        }
        else
        {
          that.setState({srt_data1:srt_data});
        }
        console.log(srt_data[1])
      })
    }
    else if(srtUrl_)
    {
      //alert("srt not exist,url = ",srtUrl_)
      base.axios({method:"get" , url:srtUrl_ }).then(res3=>{
        console.log("subtitle",res3.data);
        var srt_data = parse(res3.data);
        if(index == 0)
        {
          that.setState({srt_data});
        }
        else
        {
          that.setState({srt_data1:srt_data});
        }
        console.log(srt_data[1])
        console.log(`load  subtitle : ${srtUrl_} 成功`);
      }).catch(e=>{
        console.error(e);
        alert("字幕加载失败,重新进入视频试试呢?")
      });

    }
    });
  }

  componentWillUnmount()
  {
    Orientation.removeOrientationListener(this._orientationLisener);
    Orientation.lockToPortrait()
  }

  componentDidMount()
  {

    var that = this;

    //base.set_cookie("access_token","7110eda4d09e062aa5e4a390b0a572ac0d2c0220596",  31536000,   "172.16.35.224")

    Orientation.addOrientationListener(this._orientationLisener);

  }

  _orientationLisener(orientation)
  {
      console.log("orientation changed",orientation);
      Orientation.lockToLandscape();
      //this.onLoad(null,orientation);
  }
  componentWillMount(){

  }



  async get_word_info(word,call_back)
  {
    if(!word)
      return {}

    this.setState({loadingMean:true});
    try
    {
      var url = `${base.HOBBY_DOMAIN}/api/search_word.json?word=${word}`;

      console.log(`HTTP: begin ${url}`);
      var res3 = await base.axios({method: "get", url: url});
      console.log(`HTTP: ${url} : res=${JSON.stringify(res3)}`);
      let data = res3.data;
      this.setState({loadingMean:false});

      var word_info = data && data.data && data.data.word ? data.data.word: {};
      console.log("word_info",word_info);
      call_back(word,word_info)

    }catch(e)
    {
      console.error(e);
      this.setState({loadingMean:false});
    }


    console.log()

  }

  troggle_video()
  {
    console.log("paused = ",this.state.paused)
    this.setState({paused:!this.state.paused})

  }

  pause()
  {
    if(this.state.paused != true)
    {
      this.setState({paused:true})
    }
  }

  play()
  {
    if(this.state.paused != false)
    {
      console.log("paused = ",false)
      this.setState({paused:false})
    }
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

  word_click(words,word_index, srt_index)
  {
    var that = this;
    that.pause();

    var word_ = words[word_index]||"";

    var word = word_.replace(/^[\(|\)|'|’|"|“|”|！|!|.|?|,]+/g ,"").replace(/\(|\)|['|’|"|“|”|！|!|.|?|,]+$/g ,"")
    console.log(`search word:${word_}=>${word}`)

    if(word)
    {
      that.refs_store[word_index].measure(this.measure)

      this.get_word_info(word,(word,word_info)=>{
        try
        {
          word_info['mean_cn_view'] = JSON.parse(word_info.mean_cn).map(item => {
            return <View style={{flex: 1}}><Text style={{color: "white"}}>{item}</Text></View>
          });
        }
        catch(e)
        {
          word_info['mean_cn_view'] = <View sytle={{flex: 1}}>{word_info.mean_cn}</View>
        }

        that.setState({cur_word:word,word_info:word_info});
      })
    }


  }

  hide_mean_box()
  {
    this.setState({popup_left:-1000});
    this.play();
  }

  englishPercent(str)
  {
    if(str == null || _.trim(str) == "")
      return 0;

    var str_ =  str.replace(/[\(|\)|'|’|"|“|”|！|!|.|?|,]+/g ,"");
    var originLength = str_.length;
    var englishLength = originLength - str_.replace(/[A-Za-z]+/g ,"").length

    return englishLength*1.0/originLength;
  }

  setTime(time)
  {
    var cur_time = time.currentTime*1000;
    console.log("progress",cur_time);

    var cur_subtitle = null;
    var cur_subtitle_org = null;
    var show_srt_index = -1;
    var show_srt_index1 = -1;
    var otherText = null;

    if(this.state.srt_data)
    {
      var show_srt = null;
      var srt_data = this.state.srt_data;
      var srt_data1 = this.state.srt_data1;

      for(let i = 0; i < srt_data.length; i++)
      {
          if(cur_time > srt_data[i].end)
            continue;
          else
          {
            if(i != this.state.show_srt_index)
            {
              show_srt = srt_data[i];
              var text = show_srt.text;
              var splites = text.split(/[\r|\n|\r\n]/);
              var splites = splites.filter((item)=>{
                  return (item != null && _.trim(item) != "")
              });

              var text = null; //英语字幕
              var otherText = null; //其他字幕
              if(splites.length == 0)
              {
                text = splites[0];
              }
              else
              {
                var text0 = splites[0] || "";
                var text1 = splites[1] || "";

                if(text0 == null || _.trim(text0) == "")
                {
                  text = text1;
                  otherText = text0;
                }
                else if(text1 == null || _.trim(text1) == "")
                {
                  text = text0;
                  otherText = text1;
                }
                else
                {
                  var enPercent0 = this.englishPercent(text0);
                  var enPercent1 = this.englishPercent(text1);

                  if(enPercent0>=enPercent1)
                  {
                    text = text0;
                    otherText = text1;
                  }
                  else
                  {
                    text = text1;
                    otherText = text0;
                  }
                }
              }

              console.log("en text:", text);
              console.log("other text:", otherText);

              var words = text.split(" ")

              this.refs_store = new Array(words.length);

              cur_subtitle_org = show_srt;
              cur_subtitle = words.map((word,index)=>{
                var index_ = _.clone(index);
                return<TouchableOpacity style={{paddingRight:4,overflow:"visible"}}
                      ref={(e)=>{this.refs_store[index_] = e}}
                      onPress={()=>this.word_click(words,index_,i)}>
                  <Text style={{fontSize:this.state.subtitleFontSize}}>{word}</Text>
                </TouchableOpacity>});

              console.log("cur_subtitle",cur_subtitle)

              show_srt_index = i;
            }

            break;
          }
      }


      if(srt_data1)
      {
        for(let j = 0; j < srt_data1.length; j++)
        {
          if(cur_time > srt_data1[j].end)
            continue;
          else
          {
            if (j != this.state.show_srt_index1)
            {
              var show_srt_ = srt_data1[j];
              otherText = show_srt_.text;
              show_srt_index = j;
              break;
            }
          }
        }
      }


     }


    if(cur_subtitle != null && show_srt_index >= 0)
    {
      this.setState({cur_subtitle:cur_subtitle,
        cur_subtitle_org:cur_subtitle_org,otherText:otherText
        ,show_srt_index:show_srt_index,show_srt_index1:show_srt_index1});
    }

    this.setState({cur_time:cur_time/1000});
    console.log("cur_time",this.state.cur_time,this.state.cur_subtitle_org,this.state.otherText,);
  }


  loadStart(res)
  {
    console.log("loadStart",res);
    this.setState({videoLoading:true, cur_time:0});
  }

  // setDuration()
  // {
  //   console.log("setDuration");
  // }

  onBuffer(buffer)
  {
    console.log("onBuffer",buffer);
    if(buffer && buffer.isBuffering == true)
    {
      //console.log("onBuffer paused = ",true)
      this.setState({videoLoading:true,showProgressBar:true})
    }
    else
    {
      //console.log("onBuffer paused = ",false)
      this.setState({videoLoading:false})
      this.showProgress();
    }
  }

  changeCurrentTime(currentTime)
  {
    if(this.player)
      this.player.seek(currentTime)

  }

  showProgress()
  {
    var that = this;
    if(that.state.showProgressBar == false)
    {
      that.setState({showProgressBar: true})
      setTimeout(() => {
        if (that && that.setState)
        {
          that.setState({showProgressBar: false})
        }
      },ProgressShowTime);
    }
  }

  videoError(e)
  {
    this.setState({videoLoading:false});
    alert("视频加载失败");
  }
  //
  // onEnd()
  // {
  //   console.log("onEnd");
  // }
  //
  // onTimedMetadata()
  // {
  //   console.log("onTimedMetadata");
  // }


  onLoad(response,orientation)
  {
      console.log("onLoad",response);
      var that = this;
      this.setState({showProgressBar:true,orientation:orientation});


    setTimeout(()=>{
      if(that && that.setState)
      {
        that.setState({videoLoading:false})
      }
    },1000);

    setTimeout(()=>{
        if(that && that.setState)
        {
          that.setState({showProgressBar:false})
        }
      },ProgressShowTime);


      var width = 0;
      var height = 0;

      if(response && response.naturalSize)
      {
        width = response.naturalSize.width;
        height = response.naturalSize.height;
        this.setState({videoWidth:width,videoHeight:height});
        console.log("onLoad1")
      }
      else if(this.state.videoWidth && this.state.videoHeight)
      {
          width = this.state.videoWidth;
          height = this.state.videoHeight;
        console.log("onLoad2")
      }
      else
      {
        width = 16;
        height = 9;
        console.log("onLoad3")
      }


      var videoWH = width * 1.0 / height;

      console.log("video width,height",width,height);
      var screenWidth = base.ScreenWidth;
      var screenHeight = base.ScreenHeight;

      if(orientation == "LANDSCAPE")
      {
        var tmp = screenWidth;
        screenHeight = screenHeight;
        screenHeight = tmp;
      }

      var screenWH = screenWidth * 1.0/ screenHeight;

      var actualWidth = 0;
      var actualHeight = 0;

      if(videoWH < screenWidth )
      {
          actualWidth = screenWidth;
          actualHeight = height * actualWidth * 1.0 / width;
      }
      else
      {
        actualHeight= screenHeight;
        actualWidth = width * actualHeight * 1.0 / height;
      }

      var duration = response?response.duration:this.state.duration;
      this.setState({duration:duration,
                     backgroundVideo: {
                           width:actualWidth,
                            height:actualHeight}});

  }

  measure(x, y, width, height, left, top)
  {
    console.log("measure",x, y, width, height, left, top);
    var popup_left = left+width/2-meanWidth/2;
    var popup_top = 60;

    if(popup_left<0)
      popup_left = 10

    console.log("popup_left",popup_left,"base.ScreenWidth",base.ScreenWidth);
    if(left+meanWidth >= base.ScreenWidth-20)
    {
      popup_left = base.ScreenWidth - meanWidth-20;
    }

    console.log("popup_left1",popup_left,"base.ScreenWidth",base.ScreenWidth);
    var param = {popup_left,popup_top};
    console.log(param);
    this.setState(param);
  }

  formatedCurrentTime(seconds)
  {
    var miniseconds = seconds*1000;
    var str = new Moment(miniseconds).format("mm:ss");
    return str;
  }

  goback()
  {
    if(this.player)
    {
      var time = this.state.cur_time;
      if(time && time >= 5)
      {
        time = time - 5;
      }
      this.player.seek(time)
      this.setState({rate:this.state.rate+0.1});
      setTimeout(()=>this.setState({rate:this.state.rate-0.1}),100)
    }
  }

  goforward()
  {
    if(this.player)
    {
      var time = this.state.cur_time;
      if(time && this.state.duration && time < this.state.duration)
      {
        time = time + 5;
      }
      this.player.seek(time)
      this.setState({rate:this.state.rate+0.1});
      setTimeout(()=>this.setState({rate:this.state.rate-0.1}),100)
    }
  }

  save_word(id,word,video_id,subtitle)
  {
    //alert("srt not exist,url = ",srtUrl)
    var url = `${base.HOBBY_DOMAIN}/dict/save_word.json`;

    var subtitle_str = null;
    if(subtitle)
    {
      try
      {
        subtitle_str = JSON.stringify(subtitle);
      }
      catch(e)
      {
        console.error(e);
      }
    }

    base.axios({method:"post" , url:url ,data:{id:id,word:word,video_id:video_id,subtitle:subtitle_str}}).then(res3=>{
      if(res3 && res3.data && res3.data.status == 1)
      {

        if(this.state.word_info)
        {
          var word_info = _.clone(this.state.word_info);
          word_info.saved = true
          this.setState({word_info});
        }
      }
    }).catch(e=>{
      alert("保存单词失败",e);
    });
  }

  render()
  {

    var loadingView = null;

    if(this.state.videoLoading == true)
    {
      var playView = null;

      loadingView =  <View style={{
        position:"absolute",
        width:base.ScreenWidth,
        height:base.ScreenHeight-200,
        left:0,
        top:0,
        zIndex:100,
        backgroundColor:"rgba(0,0,0,0.0)",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop:150
      }}>
        <ActivityIndicator
          animating={true}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width:30,height:30,
          }}
          size="large"
        />
      </View>;
    }

    var btn = null;
    if(this.state.paused == false)
    {
      btn = <TouchableOpacity style={{flex:1,justifyContent:"center", padding:6,alignItems:"center"}} onPress={() => { this.troggle_video()}} >
        <Icon name="pause" size={16} color="black" />
      </TouchableOpacity>;
    }
    else
    {
      btn = <TouchableOpacity style={{flex:1,justifyContent:"center",padding:6, alignItems:"center"}} onPress={() => { this.troggle_video()}}>
        <Icon name="play" size={16} color="black" />
      </TouchableOpacity>;
    }

    var progressBar = <View style={{flexDirection:"row",alignItems:"center"
      ,justifyContent:"center",height:44,width:this.state.orientation == "LANDSCAPE"? base.ScreenHeight: base.ScreenWidth
      ,position:"absolute",zIndex:1001,top:0, backgroundColor:"rgba(255,255,255,0.4)"}}>

      <TouchableOpacity activeOpacity={0.8}
                        style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}
                        onPress={()=>{this.props.navigation.goBack();}}
      >
        <Icon name={'angle-left'} size={32} color="black" />
        <Text style={{fontSize:14,color:"black"}}>  </Text>

      </TouchableOpacity>


        <Text style={{alignSelf:"center",fontSize:15,color:"black"}} > {this.formatedCurrentTime(this.state.cur_time)} </Text>

        <Slider
          //thumbImage={require('../resources/images/circle2.png')}
          style={{backgroundColor:"rgba(0,0,0,0.0)",flex:5.5}}
          value={this.state.cur_time}
          step = { 1 }
          minimumValue = { 0 }
          maximumValue = { this.state.duration }
          minimumTrackTintColor = "black"
          onValueChange={(ChangedValue) => this.changeCurrentTime(ChangedValue)}
        />

        <Text style={{width:50,alignSelf:"center",fontSize:15,color:"black"}} > {this.formatedCurrentTime(this.state.duration||0)} </Text>

        {btn}
      </View>


    var settingView =  this.state.showProgressBar ? <TouchableOpacity
      onPress={()=>{this.pause();this.setState({showSettingModal:true }) }}
                          style={{width:40,height:40,position:"absolute",top:50,right:10 ,
                            justifyContent:"center",padding:10,alignItems:"center"
                            ,backgroundColor:"rgba(0,0,0,0.3)",zIndex:102
                            ,borderRadius:20,
                          }}>
          <Icon name={'cog'} size={20} color="white" />
        </TouchableOpacity>:null



    var touchView = <TouchableOpacity activeOpacity={0.8}
      style={{position:"absolute",left:0,top:0,zIndex:101,
        flexDirection:"row",justifyContent:"center",alignItems:"center"
        ,width:base.ScreenWidth,height:base.ScreenHeight
        ,backgroundColor:"rgba(0,0,0,0.0)"}}

      onPress={()=>{this.showProgress();
            this.troggle_video();
            if(this.state.popup_left > 0)
              this.hide_mean_box()
      }}


    >

      {this.state.showProgressBar?
       <TouchableOpacity onPress={()=>this.goback()}
         style={{flex:1,justifyContent:"center",padding:10,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)"}}>
          <Icon name={'angle-left'} size={36} color="white" />
       </TouchableOpacity>:null
      }

      <View style={{flex:10}}>

      </View>

      {this.state.showProgressBar?
        <TouchableOpacity
          onPress={()=>this.goforward()}
          style={{flex:1,justifyContent:"center",padding:10,alignItems:"center",backgroundColor:"rgba(0,0,0,0.1)"}}>
          <Icon name={'angle-right'} size={36} color="white" />
      </TouchableOpacity>:null
      }

    </TouchableOpacity>




    var speedView =  [0.8,0.9,1.0,1.1,1.2].map((item)=>{
        var active = this.state.rate == item;
        return <Text style={{borderWidth:1,borderRadius:6,padding:4,margin:4,color:active?"white":"black",borderColor:active?"white":"black",fontSize:14}} onPress={()=>this.setState({rate:item})}>
          {item==1.0?"常速":`${item}x`}
        </Text>
    });

    var settingModal = <Modal
      animationType={"slide"}
      transparent={true}
      visible={this.state.showSettingModal}
      supportedOrientations={['portrait', 'landscape']}>

      <TouchableOpacity onPress={()=>{this.setState({showSettingModal:false }) }}

        style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.4)"}}>

        <TouchableOpacity activeOpacity={1} style={{flex:1,marginTop:30,paddingTop:20,paddingBottom:20,borderRadius:4}}>
          <View style={inner_styles.settingItem}>
            <Text style={inner_styles.tip}>显示英文字幕:</Text>
            <Switch value={this.state.show_subtitle_en}
                    onValueChange={(val)=>{this.setState({show_subtitle_en:!this.state.show_subtitle_en})}}></Switch>
          </View>

          <View style={inner_styles.settingItem}>

            <Text style={inner_styles.tip}>显示中文字幕:</Text>

            <Switch value={this.state.show_subtitle_other}
                    onValueChange={(val)=>{this.setState({show_subtitle_other:!this.state.show_subtitle_other})}}></Switch>
          </View>

          <View style={{height:90,justifyContent:"flex-start",alignItems:"center",backgroundColor:"gray"}}>
          <View style={inner_styles.settingItem}>

            <Text style={inner_styles.tip}>字幕大小:</Text>

            <Slider
              //thumbImage={require('../resources/images/circle2.png')}
              style={{backgroundColor:"rgba(0,0,0,0.0)",flex:5.5}}
              value={this.state.subtitleFontSize}
              step = { 1 }
              minimumValue = { 14 }
              maximumValue = { 30 }
              minimumTrackTintColor = "black"
              onValueChange={(ChangedValue) => this.setState({subtitleFontSize:ChangedValue})}
            />
          </View>
           <Text style={{fontSize:this.state.subtitleFontSize,color:"yellow"}}>字幕:here we go!</Text>
          </View>

          <View style={[inner_styles.settingItem,{height:46+20,paddingBottom:30}]}>

            <Text style={inner_styles.tip}>速度:</Text>
            {speedView}
          </View>

        </TouchableOpacity>




      </TouchableOpacity>


    </Modal>

    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"black"}}>
        {this.state.showProgressBar == true ?progressBar:null}

        {settingView}
        {loadingView}
        {touchView}
        {settingModal}

        <Video key={121321}


          source={{uri:this.state.videoFileExist == true? this.state.videoPath:this.state.videoUrl}}   // Can be a URL or a local file.
               //poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
               ref={(ref) => {
                 this.player = ref
               }}                                      // Store reference
               rate={this.state.rate}                              // 0 is paused, 1 is normal.
               volume={1.0}                            // 0 is muted, 1 is normal.
               muted={false}                           // Mutes the audio entirely.
               paused={this.state.paused}                          // Pauses playback entirely.
               resizeMode="cover"                      // Fill the whole screen at aspect ratio.*
               repeat={true}                           // Repeat forever.
               playInBackground={false}                // Audio continues to play when app entering background.
               playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
               ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
               progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
               onLoadStart={this.loadStart}            // Callback when video starts to load
               onLoad={(res)=>{
                 setTimeout(()=>this.onLoad(res,"Landscape"), 1);}}               // Callback when video loads
               onProgress={this.setTime}               // Callback every ~250ms with currentTime
               onEnd={this.onEnd}                      // Callback when playback finishes
               onError={this.videoError}               // Callback when video cannot be loaded
               onBuffer={this.onBuffer}                // Callback when remote video is buffering
               onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
               style={this.state.backgroundVideo} />



        <View style={{flex:2,position:"absolute",bottom:1,width:base.ScreenWidth ,zIndex:1000,backgroundColor:"rgba(255,255,255,0.9)"}}>

          {this.state.cur_subtitle && (this.state.show_subtitle_en)?
          <View style={{backgroundColor:"rgba(255,255,255,0.6)",flexDirection:"row",justifyContent:"center",alignItems:"center",flexWrap:"wrap",paddingBottom:2,paddingTop:2}} ref={(ref) => {
            this.subtitle_view = ref
          }}>
            {this.state.cur_subtitle}
          </View>
          :null}

          {(this.state.otherText && _.trim(this.state.otherText) != "" && this.state.show_subtitle_other)?
            <View style={{
              paddingBottom: 2,
              backgroundColor: "rgba(255,255,255,0.8)",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Text style={{fontSize:this.state.subtitleFontSize}}>{this.state.otherText}</Text>
            </View>:null
          }

        </View>



        <View style={{flex:2,width:meanWidth,minHeight:120,
          backgroundColor:"rgba(0,0,0,0.8)",justifyContent:"center",alignItems:"center",position:"absolute",borderRadius:6,
          left:this.state.popup_left,bottom:this.state.popup_top,
          zIndex:1000
        }}>

          {this.state.loadingMean == true?
            <View style={{
              width: meanWidth - 2,
              flex: 5,
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
            :

            <View style={{
              width: meanWidth,
              flex: 5,
              left:0,
              alignItems: "flex-start",
              justifyContent: "flex-start"
            }}>
              { this.state.word_info && this.state.word_info.word?
                <View style={{flex:1}}>
                <View style={{height: 32,  margin:2, flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>

                  <Text style={{
                    flex: 6,
                    color: "white",
                    fontSize: 20,
                    marginLeft:8,
                  }}>
                    { this.state.word_info.word }
                  </Text>


                  <TouchableOpacity style={{flex:1,marginRight:2,justifyContent:"center",padding:6, alignItems:"center"}} onPress={() => {

                    if(this.state.word_info && this.state.word_info.logined != true)
                    {
                       alert("登录后才能搜藏喔~")
                       return;
                    }

                    this.save_word(this.state.word_info.id,
                    this.state.word_info.word,
                    this.state.video_id,
                      this.state.cur_subtitle_org,
                    ) }}>

                    <Icon name={`${(this.state.word_info.saved == true && this.state.word_info.logined == true) ? 'star':'star-o'}`} size={18} color="white" />
                  </TouchableOpacity>

                </View>

                <View  style={{height: 32,   margin:2,flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>

                  <Text style={{
                    flex: 6,
                    color: "white",
                    fontSize: 14,
                    marginRight: 10
                  }}>  {this.state.word_info.accent} </Text>

                  <TouchableOpacity style={{flex:1,justifyContent:"center",padding:6, alignItems:"center"}} onPress={() => { this.read_word(this.state.word_info.word)} }>
                    <Icon name="volume-up" size={18} color="white" />
                  </TouchableOpacity>

                </View>

                <ScrollView>
                  <View style={{width: meanWidth - 3, marginLeft:8,flex: 1, flexDirection: "column"}}>
                    {this.state.word_info['mean_cn_view'] }
                  </View>
                </ScrollView>
                </View>
                :
                <View style={{flex:1,width:meanWidth,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{fontSize:16,color:"white"}}>没有找到数据喃~</Text>
                </View>
              }
            </View>

          }
        </View>

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

  },
  settingItem:{
    height:46,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center",
    backgroundColor:"gray",
    padding:4
  },

  tip:{
    fontSize:14,
    color:"white",
    margin:4
    }

};



import _ from "lodash"
_.mixin(Video_.prototype,base.base_component);


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
(Video_);


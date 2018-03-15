/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {WebView,Text,Button,View,ActivityIndicator,Image,TouchableOpacity,AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter} from 'react-navigation';
import _ from "lodash"

import * as base from '../common/base'

import WKWebView from 'react-native-wkwebview-reborn';
//const Wechat = require('react-native-wechat');
import KeepAlive from "react-native-keep-awake"

export default class CWebViewMall extends Component
{
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerLeft = (
      <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center"}}  activeOpacity={0.9}>

        <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center"}}
                          onPress={
                            ()=>{
                              params.goBack ? params.goBack() : null;
                              if(params.call_back)
                                params.call_back();
                            }
                          }>
          <Image style={{marginLeft:10,height:16}} source={require("../resources/images/back-icon.png")} />
          <Text style={{fontSize:18,marginLeft:4,color:"rgb(71, 175, 255)"}}>返回</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity style={{marginLeft:16}} onPress={()=>{*/}
          {/*navigation.goBack();*/}
          {/*if(params.call_back)*/}
            {/*params.call_back();*/}
        {/*}}><Text style={{fontSize:18,color:"rgb(71, 175, 255)"}}>关闭</Text></TouchableOpacity>*/}

      </TouchableOpacity>
    );

    var headerRight =  <View style={{flex:1}}>
      <Button title={"setting"} onPress={()=>navigation.navigate("Setting")}/>
    </View>

    var headerStyle = params.headerStyle;
    return {headerStyle, headerLeft, headerRight};
  };

  constructor(props)
  {
    super(props);

    const { state, setParams } = this.props.navigation;
    console.log("this.props.navigation.state = ",state);

    var url = null;
    var onTodoClick = null;
    if(this.props.url)
    {
      url = this.props.url;
    }
    else if (state && state.params)
    {
      url = state.params.url;
      onTodoClick = state.params.onTodoClick;
    }

    var url_ = url;

    console.log("CWebViewMall url",url_);
    this.state = {url:url_,show_share:false,keep:1,loading:false};
    this.url = url_;
    this.goBack = this.goBack.bind(this);

    console.log("CWebViewMall...");
    this.headers = {"Pay-Support":"weixin_app;"}

    var that = this;
    base.get_cookie("Pay-Support",(cookie)=>{
      console.log("Cookie Pay-Support",cookie);
    })

    that.access_token = null;
    base.get_cookie("access_token",(access_token)=>{
      console.log("access_token",access_token);
      that.access_token = access_token;
    })

    this.webview_key = new Date().toDateString();
    this.headerStyle = this.headerStyle.bind(this);
  }

  renderError()
  {
    var url = this.state.url;
    console.log("render error")
    return <CErrorView reload={()=>{
      if(url.indexOf("?")>=0)
      {
        url = url+"&a__=1"
      }
      else
      {
        url = url+"?a__=1"
      }
      this.setState({url:url, loading:false})
    }} />
    //
    // <View style={{alignItems:"center",justifyContent:"center"}}>
    //   <Text>error...</Text>
    //   <Button title={"reload"} onPress={()=>this.setState({url:url+"?a=a"})}
    //   >  </Button>
    // </View>
  }

  renderLoading()
  {
    return null;
  }

  headerStyle()
  {
    var stack = this.state.url_stack

    //alert(stack);

    if(!!!stack || stack.length >1 )
    {
      return {height:0};
    }
    else
    {
      return null;
    }
  }

  cancel_share()
  {
    console.log("cancel share")
    this.setState({show_share:false,
      share_data:null});
  }

  //如果在webview内跳转的话,2种情况：1.跳回上一个网页，2.跳回上一个screen
  goBack()
  {
    console.log("Go Back Pressed")
    var url_stack = this.state.url_stack;
    console.log("url_stack",url_stack);

    if(url_stack || url_stack.length > 0)
    {
      url_stack.splice(url_stack.length-1,1)
    }
    this.setState({url_stack:url_stack,loading:false});
    if(this.webview)
    {
      this.webview.goBack();
    } //跳回上一个网页

    if(url_stack == null||url_stack.length == 0)
    {
      const { params = {} } = this.props.navigation.state;
      var goback_refresh =  null;
      if(params)
      {
        goback_refresh = params.goback_refresh;
      }

      this.props.navigation.goBack(); //跳回上一个screen
      if(goback_refresh != null)
      {
        goback_refresh();
      }
    }
  }



  componentDidMount() {
    // We can only set the function after the component has been initialized
    this.props.navigation.setParams({ goBack: this.goBack, headerStyle:this.headerStyle});
  }

  componentWillUnmount() {
    if(this.webview)
    {
      try
      {
        this.webview.evaluateJavaScript(`window.location.href="about:blank";`)
      }
      catch(e)
      {
        console.error(e);
      }
    }

  }


  //如果在webview内跳转的话,将url压栈
  onNavigationStateChange = (navState) => {


    var url = navState.url;
    var url_stack = this.state.url_stack || [];

    //alert(JSON.stringify(navState));
    console.log("onNavigationStateChange",JSON.stringify(navState));
    console.log(this.state.url_stack);

    //react-betterme-navigation是页面js执行并没有实际跳转，不用管
    if(url == null || url == undefined || url == ""  )
    {
      return null;
    }


    if(url_stack.indexOf(url) >= 0)
      return null;

    url_stack.push(url);

    this.setState({
      url_stack: _.clone(url_stack),
    });
  };


  test_share(id,args)
  {
    console.log("test_share receive "+JSON.stringify(args));
    var that = this;
    setTimeout(()=>that.msger.send(id,["a1aa",'bbasdfabb']),20);
  }

  render()
  {
    var share_modal = null;

    //顶部的假loading
    var loading = null;

    let { navigation } = this.props;

    let url = this.state.url;

    var key = 0;
    if(url != null &&  url.indexOf("order")>=0)
    {
      key = 1;
    }

    console.log("header",this.headers)
    console.log("key",key);

    // var top_nav_bar =  <TouchableOpacity style={{height:44,flexDirection:"row",alignItems:"center"}}  activeOpacity={0.9}>
    //
    //     {this.state.url_stack && this.state.url_stack.length >= 2 ?
    //
    //     <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center"}}
    //                       onPress={()=>{this.goBack()}}>
    //       {/*<Image style={{marginLeft:10}} source={require("../resources/images/back-icon.png")} />*/}
    //       <Text style={{fontSize:18,marginLeft:4,color:"rgb(71, 175, 255)"}}>返回</Text>
    //     </TouchableOpacity>
    //     :
    //     <TouchableOpacity style={{flex:1,flexDirection:"row",alignItems:"center"}}></TouchableOpacity>
    //   }
    //
    //
    //   <Button title={"setting"} onPress={()=>navigation.navigate("Setting")}/>
    //   </TouchableOpacity>

    return (
      <View style={{flex:1,...this.props.style,borderWidth:0}}>
        <KeepAlive/>
        <Text style={{width:1,height:1}}>{this.state.url}</Text>

        {/*{top_nav_bar}*/}

        <WKWebView
            key={this.webview_key} onMessage={this.handleMessage}
                    onProgress={(progress) => {console.log(progress);

                      if(this.loading_view == null)
                        return;
                      //this.loading_view.setProgress(progress);

                    }}

                    injectedJavaScript={`${base.get_set_cookie_js_str("access_token",this.access_token)}`}
                    //injectedJavaScript={`document.write("<h1>Test</h1>")`}
                    //bounces={true}
                    sendCookies={true}

                    startInLoadingState={true}
                    renderLoading={this.renderLoading}
                    onNavigationStateChange={this.onNavigationStateChange}
                    onLoadStart={(navState)=>{console.log("onLoadStart");}}
                    onLoadEnd={()=>{console.log("onLoadEnd");}}
                    ref={w => this.webview = w}
                    source={{uri:this.url}}>
        </WKWebView>
      </View>
    )
  }
}

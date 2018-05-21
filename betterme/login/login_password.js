/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import * as base from "../common/base.js"
import {TouchableOpacity,AsyncStorage,Image,Button,TextInput,Alert,NativeModules,Modal} from "react-native"
import * as BaseStyle from  "../styles/base_style.js"
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CHeadTip from "../common/component/c_header_tip"

import { connect } from "react-redux";
import {login,register,ensure_code,update_data_state,UPDATE_DATA_STATUS,UPDATE_DATA_STATE} from "../../betterme/common/redux/actions/actions.js"
import CookieManager from 'react-native-cookies';

const codeBtnText = "获取验证码"
const codeBtnDisabled = "秒后重新发送"
let AnotherToastAndroid = NativeModules.AnotherToastAndroid;

class LoginPassword extends Component {

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    var headerStyle = {height:0}
    return {header:"登录",headerStyle}
  };

  constructor(props)
  {
    super(props)
    this.state = {
      account:null,
      password:null,
      code:null,
      register:true,
      codeBtnText:codeBtnText,
      tip:null,
      marginTop:50,
    }

    this.countdown = this.countdown.bind(this);
    // AnotherToastAndroid.show('Another Toast', AnotherToastAndroid.LONG);
    this.setCookieAndroid = this.setCookieAndroid.bind(this);
  }

  toggle()
  {
    if(this.interval)
      clearInterval(this.interval);

    this.setState({register:!this.state.register})
  }

  setCookieAndroid()
  {

    // Get cookies as a request header string
    CookieManager.get( base.URLS.user_info.url())
      .then((res) => {
        console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
      });

    CookieManager.setFromResponse(
      base.URLS.user_info.url(),"").then((res) => {
        // `res` will be true or false depending on success.
        console.log('CookieManager.setFromResponse =>', res);
      })
  }

  login()
  {
      var account = this.state.account;
      var password = this.state.password;
      this.props.login({username:account,password:password},(data)=>{
        console.log("data11111",data);
         if(data && data.data && data.data.access_token)
         {
           AsyncStorage.setItem("access_token", data.data.access_token);
           base.access_token = data.data.access_token;
         }

         return data;
      });
  }

  register()
  {
    var account = this.state.account;
    var password = this.state.password;
    var code = this.state.code;
    var params = {username: account, password: password, code: code};
    this.props.register(params, () => this.login());
  }

  async countdown()
  {
    try
    {
      var account = this.state.account;
      var password = this.state.password;

      var params = {username: account, password: password}
      var url = base.URLS.ensure_code.url();
      var method = base.HttpType.POST;

      this.setState({ensure_code_loading:true});
      var res3 = await base.axios({method: method, url:url , data: params});
      this.setState({ensure_code_loading:false});
      console.log(`HTTP: ${method} : ${JSON.stringify(params)} : ${url} : res=${JSON.stringify(res3)}`);

      if (!!res3 && !!res3.data && res3.data.status == 1)
      {
        if(this.interval != null)
        {
          clearInterval(this.interval);
        }

        this.setState({count: 60});
        this.interval = setInterval(() => {
          var precount = this.state.count||60;
          var count = precount - 1;

          if(count <= 0 )
          {
            if(this.interval)
            {
              clearInterval(this.interval);
            }

            this.setState({count: count, codeBtnText:codeBtnText});
          }
          else
          {
            this.setState({count: count, codeBtnText: `${count}${codeBtnDisabled}`});
          }

        }, 1000);
      }
      else
      {

        var msg = "error"
        if (!!res3 && !!res3.data && (res3.data.smsg ||  res3.data.msg))
        {
          msg = res3.data.smsg ||  res3.data.msg;
        }

        Alert.alert(msg);
      }
    }
    catch(e)
    {
      console.error(e);
      this.setState({ensure_code_loading:false});
    }
  }

  goto_home()
  {
    //this.props.navigation.navigate("CWebViewMall",{url:`${base.HOBBY_DOMAIN}/home#/`});
    //this.props.navigation.navigate("CWebViewMall",{url:`https://m.baidu.com`});
  }

  // componentWillReceiveProps(props)
  // {
  //   console.log("componentWillReceiveProps" , props);
  //   if(props.user_info && props.user_info.data && props.user_info.data && props.user_info.data.data.access_token )
  //   {
  //     base.set_cookie("set access_token",props.user_info.data.data.access_token);
  //     //this.goto_home();
  //   }
  // }



  loading()
  {
    if(!this.props.data[base.URLS.login.name]
      || !this.props.data[base.URLS.register.name]
    )
      return null;

    var login_data = this.props.data[base.URLS.login.name].data;
    var login_status = this.props.data[base.URLS.login.name].status;

    var register_data = this.props.data[base.URLS.register.name].data;
    var register_status = this.props.data[base.URLS.register.name].status;

    if(login_status == UPDATE_DATA_STATUS.LOADING || register_status == UPDATE_DATA_STATUS.LOADING)
    {
      return <Modal>
        <View>
          <Text>loading</Text>
        </View>
      </Modal>
    }

  }
  render() {


    console.log("user_info",this.props.user_info);

    var tip = null;
    if(this.props.user_info && this.props.user_info.data && this.props.user_info.data.status != 1)
    {
        var tipTxt = this.props.user_info.data.msg || this.props.user_info.data.smsg;
        tip = <CHeadTip  style={{width:base.ScreenWidth}} tip={tipTxt}/>
    }

    var show_view = null;
    if(this.state.register == true)
    {
      show_view =  <View style={[BaseStyle.base_styles.base_view_style, {flex: 10, justifyContent: "flex-start"}]}>

          <TextInput underlineColorAndroid="transparent" style={[styles.input_text, {marginTop: 4}]} placeholderTextColor="rgb(153, 153, 153)"
                     placeholder={"  手机号"} autoCapitalize={"none"}
                     keyboardType={"default"}
                     onFocus={()=>{this.setState({marginTop:4})}}
                     onBlur={()=>{this.setState({marginTop:50})}}
                     onChangeText={txt => this.setState({account: txt})}/>

          <TextInput underlineColorAndroid="transparent" style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}
                     onFocus={()=>{this.setState({marginTop:4})}}
                     onBlur={()=>{this.setState({marginTop:50})}}
                     onChangeText={txt => this.setState({password: txt})}/>


          <TouchableOpacity onPress={() => {this.login()}}
                            style={[styles.login_item, ]}>
            <Text style={styles.login_text}>登录</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.toggle();
          }}
                            style={[styles.tip_item]}>
            <Text style={styles.login_text}>没有账号去注册</Text>
          </TouchableOpacity>

        {/*<TouchableOpacity onPress={() => {*/}
          {/*this.props.navigation.navigate("CWebViewMall",{url:`${base.HOBBY_DOMAIN}/home#/`});*/}
        {/*}}*/}
                          {/*style={[styles.tip_item, {marginTop: 20}]}>*/}
          {/*<Text style={styles.login_text}>首页</Text>*/}
        {/*</TouchableOpacity>*/}


        {/*<TouchableOpacity onPress={() => {*/}
         {/*this.props.navigation.navigate("Setting");*/}
        {/*}}*/}
                          {/*style={[styles.tip_item, {marginTop: 20}]}>*/}
          {/*<Text style={styles.login_text}>setting</Text>*/}
        {/*</TouchableOpacity>*/}


      </View>


    }
    else
    {
      show_view =


        <View style={[BaseStyle.base_styles.base_view_style, {flex: 10, justifyContent: "flex-start"}]}>

          <View style={[{flexDirection:"row",justifyContent:"center",alignItems:"center"},{marginTop: 4}]}>
          <TextInput underlineColorAndroid="transparent" style={[styles.input_text, ]} placeholderTextColor="rgb(153, 153, 153)"
                     placeholder={"  手机号"} autoCapitalize={"none"}
                     keyboardType={"default"}
                     onFocus={()=>{this.setState({marginTop:4})}}
                     onBlur={()=>{this.setState({marginTop:50})}}
                     onChangeText={txt => this.setState({account: txt})}/>

          <TouchableOpacity style={{position:"absolute",right:18}}
                            disabled={this.state.count > 0 && this.state.ensure_code_loading == false}
                            onPress={this.countdown}>
                    <Text style={{fontSize:12,color:this.state.count > 0?"#999":"red"}}>{this.state.codeBtnText}</Text>
          </TouchableOpacity>

          </View>

            <TextInput underlineColorAndroid="transparent" style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"验证码"}
                       autoCapitalize={"none"} secureTextEntry={false}
                       keyboardType={"default"}
                       onFocus={()=>{this.setState({marginTop:4})}}
                       onBlur={()=>{this.setState({marginTop:50})}}
                       onChangeText={txt => this.setState({code: txt})}/>




          <TextInput underlineColorAndroid="transparent" style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}
                     onFocus={()=>{this.setState({marginTop:4})}}
                     onBlur={()=>{this.setState({marginTop:50})}}

                     onChangeText={txt => this.setState({password: txt})}/>

          <TouchableOpacity onPress={() => {
            this.register()
          }}
                            style={[styles.login_item,]}>
            <Text style={styles.login_text}>注册</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {this.toggle();}}
                            style={[styles.tip_item,]}>
            <Text style={styles.login_text}>我有账号去登陆</Text>
          </TouchableOpacity>
        </View>

    }

    var show_view_ = <View style={{flex:1}}>
      <View style={{flex:1,justifyContent:"center",paddingTop:20,alignItems:"center",backgroundColor:"white"}}>
        <Image source={require("../resources/images/bee.jpg")} style={{marginBottom:20,width:50,height:56}}/>
        <Text style={{marginBottom:2,fontSize:16,textAlign:"left",fontWeight:"bold",fontFamily: 'System'}}>小蜜蜂播放器</Text>
        {/*<Text style={{fontSize:14,fontWeight:"bold",textAlign:"left",fontFamily: 'System'}}>为学习而生</Text>*/}
      </View>
      <View style={{flex:5,paddingTop:0}}>{show_view}</View>
    </View>

    return (
      <View style={BaseStyle.base_styles.base_view_style}>
        {this.loading()}
        {tip}
        {show_view_}
      </View>
    );
  }
}


const styles = StyleSheet.create(
  {
    input_text: {
      width: 275,
      lineHeight: 32,
      height:36,
      borderRadius: 20,
      borderStyle: "solid",
      borderWidth: 0.5,
      borderColor: "#cccccc",
      padding:4,
      color:"black",
      margin:4,
      fontSize:16
    },
    tip_item:{
      flexDirection:"row",
      width: 275,
      height: 36,
      borderRadius: 23,
      backgroundColor: "gray",
      justifyContent:"center",
      alignItems:"center",
      marginTop:6
    },
    login_item:{
      flexDirection:"row",
      width: 275,
      height: 36,
      borderRadius: 23,
      backgroundColor: "#1abd0a",
      justifyContent:"center",
      alignItems:"center",
      marginTop:6}
    ,
    login_text:{
      fontSize: 16,
      color: "#ffffff"}
  });




const mapStateToProps = state => {
  return {
    data: state.update_state,
    nav:state.nav,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login:(params,call_back)=>{
      dispatch(login(params,call_back))
    },

    register:(params,call_back)=>{
      dispatch(register(params,call_back))
    },

    ensure_code:(params,call_back)=>{
      dispatch(ensure_code(params,call_back))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(LoginPassword);

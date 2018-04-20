/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import * as base from "../common/base.js"
import {TouchableOpacity,Button,TextInput,Alert,NativeModules} from "react-native"
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
      tip:null
    }

    this.countdown = this.countdown.bind(this);
    // AnotherToastAndroid.show('Another Toast', AnotherToastAndroid.LONG);
  }

  toggle()
  {
    this.setState({register:!this.state.register})
  }

  login()
  {
      var account = this.state.account;
      var password = this.state.password;
      this.props.login({username:account,password:password},null);
  }

  register()
  {
      var account = this.state.account;
      var password = this.state.password;
      var code = this.state.code;
      var params = {username: account, password: password, code: code};
      this.props.register(params);
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

      var res3 = await base.axios({method: method, url:url , data: params});

      console.log(`HTTP: ${method} : ${JSON.stringify(params)} : ${url} : res=${JSON.stringify(res3)}`);

      if (!!res3 && !!res3.data && res3.data.status == 1)
      {

        if (this.interval != null)
        {
          this.interval = clearInterval(this.interval);
        }

        this.setState({count: 60});
        this.interval = setInterval(() => {
          var precount = this.state.count || 60;
          var count = precount - 1;
          this.setState({count: count, codeBtnText: `${count}${codeBtnDisabled}`});
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
                     onChangeText={txt => this.setState({account: txt})}/>

          <TextInput underlineColorAndroid="transparent" style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}
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
                     onChangeText={txt => this.setState({account: txt})}/>

          <TouchableOpacity style={{position:"absolute",right:18}}
                            disabled={this.state.count > 0}
                            onPress={this.countdown}>
                    <Text style={{fontSize:12,color:"red"}}>{this.state.codeBtnText}</Text>
          </TouchableOpacity>

          </View>

            <TextInput underlineColorAndroid="transparent" style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"验证码"}
                       autoCapitalize={"none"} secureTextEntry={false}
                       keyboardType={"default"}
                       onChangeText={txt => this.setState({code: txt})}/>




          <TextInput underlineColorAndroid="transparent" style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}

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

    var show_view_ = <View style={{flex:1,flexDirection:"row"}}>
      {/*<View style={{flex:1,justifyContent:"flex-start",paddingTop:base.ScreenHeight/2-60,alignItems:"center",backgroundColor:"#f2f2f2"}}>*/}
        {/*<Text style={{marginBottom:8,fontSize:30,marginLeft:-90,fontWeight:"bold",fontFamily: 'System'}}>学英语</Text>*/}
        {/*<Text style={{fontSize:30,marginLeft:30,fontWeight:"bold",fontFamily: 'System'}}>很有趣</Text>*/}

      {/*</View>*/}
      <View style={{flex:2,paddingTop:30}}>{show_view}</View>
    </View>

    return (
      <View style={BaseStyle.base_styles.base_view_style}>
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
      lineHeight: 30,
      height:34,
      borderRadius: 20,
      borderStyle: "solid",
      borderWidth: 0.5,
      borderColor: "#cccccc",
      padding:4,
      color:"black",
      margin:2,
      fontSize:16
    },
    tip_item:{
      flexDirection:"row",
      width: 275,
      height: 34,
      borderRadius: 23,
      backgroundColor: "gray",
      justifyContent:"center",
      alignItems:"center",
      marginTop:6
    },
    login_item:{
      flexDirection:"row",
      width: 275,
      height: 34,
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
    user_info: state.update_state.login,
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

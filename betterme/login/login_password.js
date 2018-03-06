/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import * as base from "../common/base.js"
import {TouchableOpacity,Button,TextInput} from "react-native"
import * as BaseStyle from  "../styles/base_style.js"
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

class LoginPassword extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      account:null,
      password:null,
      code:null,
      register:true
    }
  }

  toggle()
  {
    this.setState({register:!this.state.register})
  }


  goto(screenName)
  {
    this.props.navigation.navigate(screenName)
  }

  gotoWithParams(screenName,params)
  {
    this.props.navigation.navigate(screenName,params)
  }


  login()
  {
      var account = this.state.account;
      var password = this.state.password;

  }

  render() {


    var show_view = null;
    if(this.state.register == true)
    {
      show_view =  <View style={[BaseStyle.base_styles.base_view_style, {flex: 10, justifyContent: "flex-start"}]}>

          <TextInput style={[styles.input_text, {marginTop: 40}]} placeholderTextColor="rgb(153, 153, 153)"
                     placeholder={"  邮箱/手机号"} autoCapitalize={"none"}
                     onChangeText={txt => this.setState({account: txt})}/>

          <TextInput style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}
                     onChangeText={txt => this.setState({password: txt})}/>


          <TouchableOpacity onPress={() => {
            this.props.login(alert)
          }}
                            style={[styles.login_item, {marginTop: 20}]}>
            <Text style={styles.login_text}>登录</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.toggle();
          }}
                            style={[styles.tip_item, {marginTop: 20}]}>
            <Text style={styles.login_text}>我有账号去登陆</Text>
          </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate("CWebViewMall",{url:`${base.HOBBY_DOMAIN}/home#/`});
        }}
                          style={[styles.tip_item, {marginTop: 20}]}>
          <Text style={styles.login_text}>首页</Text>
        </TouchableOpacity>


        </View>


    }
    else
    {
      show_view =


        <View style={[BaseStyle.base_styles.base_view_style, {flex: 10, justifyContent: "flex-start"}]}>

          <TextInput style={[styles.input_text, {marginTop: 40}]} placeholderTextColor="rgb(153, 153, 153)"
                     placeholder={"  邮箱/手机号"} autoCapitalize={"none"}
                     onChangeText={txt => this.setState({account: txt})}/>

          <TextInput style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}
                     onChangeText={txt => this.setState({password: txt})}/>


          <TextInput style={styles.input_text} placeholderTextColor="rgb(153, 153, 153)" placeholder={"  密码"}
                     autoCapitalize={"none"} secureTextEntry={true}
                     onChangeText={txt => this.setState({code: txt})}/>

          <TouchableOpacity onPress={() => {
            this.bcz_login()
          }}
                            style={[styles.login_item, {marginTop: 20}]}>
            <Text style={styles.login_text}>登录</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => {
            this.toggle();
          }}
                            style={[styles.tip_item, {marginTop: 20}]}>
            <Text style={styles.login_text}>没有账号去注册</Text>
          </TouchableOpacity>
        </View>

    }

    return (
      <View style={BaseStyle.base_styles.base_view_style}>
        <View style={[BaseStyle.base_styles.base_view_style]}>
          <Text style={[BaseStyle.base_text_style.bigFont]}></Text>
        </View>

        {show_view}
      </View>
    );
  }
}


const styles = StyleSheet.create(
  {
    input_text: {
      width: 275,
      height: 44,
      borderRadius: 4,
      borderStyle: "solid",
      borderWidth: 0.5,
      borderColor: "#cccccc",
      padding:4,
      color:"black",
      margin:10
    },
    tip_item:{
      flexDirection:"row",
      width: 275,
      height: 44,
      borderRadius: 23,
      backgroundColor: "gray",
      justifyContent:"center",
      alignItems:"center",
      marginTop:20
    },
    login_item:{
      flexDirection:"row",
      width: 275,
      height: 44,
      borderRadius: 23,
      backgroundColor: "#1abd0a",
      justifyContent:"center",
      alignItems:"center",
      marginTop:20}
    ,
    login_text:{
      fontSize: 16,
      color: "#ffffff"}
  });



import { connect } from "react-redux";
import {login} from "../../betterme/common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    user_info: state.user_info,
    nav:state.nav,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login:(call_back)=>{
      dispatch(login(call_back))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(LoginPassword);

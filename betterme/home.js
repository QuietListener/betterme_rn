/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import * as base from "../betterme/common/base.js"
import {TouchableOpacity,Button,TextInput,Alert,AsyncStorage} from "react-native"
import * as BaseStyle from  "../betterme/styles/base_style.js"
import WKWebView from "react-native-wkwebview-reborn"


import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';


import { connect } from "react-redux";
import {login,register,ensure_code,update_data_state,UPDATE_DATA_STATUS,UPDATE_DATA_STATE} from "../betterme/common/redux/actions/actions.js"
import LoginPassword from "../betterme/login/login_password"
import CWebViewMall from "../betterme/common/c_web_view_mall.js"


const codeBtnText = "获取验证码"
const codeBtnDisabled = "秒后重新发送"
const NotLogin = -1;
const  url = `http://www.coderlong.com/home#/`;
class Home extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    var headerStyle = {height:0}
    return {headerStyle};
  };

  constructor(props)
  {
    super(props)
    this.state = {
      access_token:null,
    }
    this.check_login_state = this.check_login_state.bind(this);
  }

  async check_login_state()
  {
    try
    {
      var access_token = await AsyncStorage.getItem("access_token");
      this.props.navigation.setParams({headerStyle:{height:0,borderWidth:0}});
      console.log("check_login_state access_token",access_token);

      if(access_token)
      {
        console.log(" base.resetAndGoto");
        base.access_token = access_token;
        AsyncStorage.setItem("access_token", access_token)
          .then((item)=>{
            console.log("AsyncStorage save access_token",item);
            AsyncStorage.getItem('access_token').then(item=>console.log("AsyncStorage save access_token 1",item)); // I like to save it.
          })
          .catch(e=>console.error(e));


        base.set_cookie("access_token",access_token, 31536000, base.Domain)
        base.axios.defaults.headers.common['access_token'] = access_token;
        base.resetAndGoto(this.props.navigation, "VideoList", { access_token: access_token });
      }
      else
      {
        console.log("access_token is null")
      }

    }
    catch(e)
    {
      console.error(e);
    }
  }

  componentWillReceiveProps(props)
  {
    console.log("componentWillReceiveProps" , props);

    if(props.user_info && props.user_info.data && props.user_info.data
      && props.user_info.data.data && props.user_info.data.data.access_token )
    {
      var access_token = props.user_info.data.data.access_token;

      if(this.state.access_token != access_token && access_token)
      {
        this.setState({access_token:access_token});

        //alert("access_token");
        console.log(`componentWillReceiveProps access_token = ${access_token}`);
        AsyncStorage.setItem("access_token", access_token);
        base.set_cookie("access_token",access_token, 31536000, base.Domain)

        setTimeout(() => {
          this.props.navigation.setParams({headerStyle:{height:0,borderWidth:0}});
          console.log(" base.resetAndGoto");
          base.resetAndGoto(this.props.navigation,"VideoList",{url:"http://www.coderlong.com/home#/",access_token:access_token});
        }, 200);
      }
    }
    else
    {
      AsyncStorage.removeItem("access_token");
      this.setState({access_token: null});
    }


  }

  componentDidMount()
  {
    this.check_login_state();
  }


  render() {

    var user_info = this.props.user_info;
    var access_token = null;
    if(user_info && user_info.data && user_info.data  && user_info.data.data && user_info.data.data.access_token )
    {
      access_token = user_info.data.data.access_token;
    }

    var show_view = null;
    console.log(`this.state.access_token = ${access_token}`)

    if(!access_token)
    {
      show_view = <LoginPassword navigation={this.props.navigation} login_succeed={this.check_login_state}/>
    }
    else
    {
       show_view = null; //<CWebViewMall navigation={this.props.navigation} style={{width:base.ScreenWidth}} url={url} />

      //show_view = <LoginPassword navigation={this.props.navigation} login_succeed={this.check_login_state}/>

    }



    return (
      <View style={[BaseStyle.base_styles.base_view_style,{borderWidth:0}]}>
        {show_view}
      </View>
    );
  }
}


const styles = StyleSheet.create(
  {

  });




const mapStateToProps = state => {
  return {
    user_info: state.update_state.login
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
(Home);

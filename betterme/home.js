/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import * as base from "../betterme/common/base.js"
import {TouchableOpacity,Button,TextInput,Alert} from "react-native"
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
import CWebViewLoading from "../betterme/common/c_web_view_mall.js"


const codeBtnText = "获取验证码"
const codeBtnDisabled = "秒后重新发送"

class Home extends Component {

  constructor(props)
  {
    super(props)
    this.state = {
      access_token:null,
    }

    this.check_login_state = this.check_login_state.bind(this);
  }

  check_login_state()
  {
    base.get_cookie("access_token",(val)=>{

        //alert(`check_login_state ${val}`);

        if(!!val)
        {
          this.setState({access_token:val});
        }
        else
        {
          this.setState({access_token:-1});
        }
    });
  }


  componentDidMount()
  {
    this.check_login_state();
  }

  render() {

    var show_view = null;

    if(this.state.access_token == null)
    {
      return null;
    }
    else if(this.state.access_token == -1)
    {
        show_view = <LoginPassword login_succeed={this.check_login_state}/>
    }
    else
    {
        var url = `${base.HOBBY_DOMAIN}/home#/`;
        alert(`webview ${url}`);
        show_view = <WKWebView   injectedJavaScript={`${base.get_set_cookie_js_str("access_token",this.state.access_token)}`} style={{flex:1,width:'100%'}} source={{uri:url}} />
    }



    return (
      <View style={BaseStyle.base_styles.base_view_style}>
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
    user_info: state.update_state.user_info,
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
(Home);

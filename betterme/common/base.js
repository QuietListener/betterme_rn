import CookieManager from 'react-native-cookies';
import Moment from "moment"
import React, {Component} from 'React'
import {NativeModules,Platform,TouchableOpacity,View, ScrollView, Image, Text, Button, StyleSheet, ProgressViewIOS} from 'react-native'

//---网络库---
const HttpTimeout = 10000//毫秒
const UserAgent = "bcz_app_iphone_ireading/1.0.2";

const headers ={
  Cookie: "access_token=9QrDryFlZhP9cNN5MnPUUMcwy%2F3QF549FtVYXCM5eqY%3D;"
}


import axios_ from "axios"
const instance = axios_.create({timeout: HttpTimeout});
instance.defaults.headers.common["User-Agent"] = UserAgent;
instance.defaults.withCredentials = true
export const axios = instance
//---网络库end---

export const is_android = Platform.OS === "android";
export const is_ios = Platform.OS === "ios";
export const Domain = "172.16.35.224";//"192.168.1.101";//


export const HOBBY_DOMAIN = `http://${Domain}:3000`;

export const UGC_PACKAGE_START = 10000000;



export const KEY_WEICHAT_TOKENS = "KEY_WEICHAT_TOKENS";
export const KEY_QQ_TOKENS = "KEY_QQ_TOKENS";
export const KEY_BCZ_TOKENS = "KEY_BCZ_TOKENS";

export const NO_ERROR = 0;
export const NOT_ALLOWED = 2;
export const NEED_LOGIN = 1;
export const READ_LEVEL = 1;
export const PLAN = 2;
export const NOTIFY = 3;

export const ShareTypeSession="session"
export const ShareTypeTimeline="timeline"
export const ShareTypeWeibo="weibo"
export const ShareTypeQqSession = "qq_session"
export const ShareTypeQqTimeline = "qq_timeline"

export const TimeoutMsg = "网络超时, 重试一下说不定就好了~";
export const activeOpacity=0.8 //点击TouchableOpacity的效果

//屏幕宽度，高度
var Dimensions = require('Dimensions');
export const ScreenWidth = Dimensions.get('window').width;
export const ScreenHeight = Dimensions.get('window').height;
export const ScreenScale = Dimensions.get('window').scale;

export const ACCESS_TOKEN = "ACCESS_TOKEN__"


//iphoneX适配
export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (ScreenHeight === 812 || ScreenWidth === 812)
  );
}


//iphoneX适配
export function is_small_screen() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (ScreenHeight <= 480)
  );
}


export function iphoneXMargin()
{
  if(isIphoneX())
    return 20
  else
    return 0;
}

export function timestamp()
{
  return Date.parse(new Date());
}


export function set_cookie(cookie_name, cookie_value, expire_in_seconds = 31536000, domain = ".baicizhan.com")
{

 if(is_ios)
 { // set a cookie (IOS ONLY)
  return CookieManager.set({
    name: cookie_name,
    value: cookie_value.toString(),
    domain: domain,
    origin: '.coderlong.com',
    path: '/',
    version: '1',
    expiration: new Date(Date.parse(new Date()) + expire_in_seconds * 1000)
  })
  }
}

export function get_cookie(cookie_name, callback)
{
    if(is_ios)
    { CookieManager.getAll().then((res) => {
        var val = null;
        for (var key in res)
        {
          if (key === cookie_name)
          {
            val = res[key].value;
          }
        }

        callback(val);
      });
     }
}


export function clear_cookie(cookie_name)
{

  if(is_ios)
  {
     CookieManager.clearByName(cookie_name).then((res) => {
        return true;
      });
  }
}


export function check_weichat_expire(start_time,expire)
{
  var now = Moment();

  return false;

}


export var test_export_value = 1;

export function  get_set_cookie_js_str(name,value)
{
  var Days = 300;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days*24*60*60*1000);
  var str = `document.cookie="${name}=${value};expires=${exp.toGMTString()};path=/"`
  return str;
}



export const HttpType={
    POST:"post",
    GET:"get"
}

export const URLS = {


  current_plan_checkkb: {
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/current_plan?check_kb=1&ireading_app=1&timestamp=${timestamp()}`,
    name:'current_plan_checkkb'
  },

  get_daka_package_info:{
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/get_daka_package_info?timestamp=${timestamp()}`,
    name:"get_daka_package_info"
  },

  get_daka_info: {
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/get_daka_info?timestamp=${timestamp()}`,
    name:"get_daka_info"
  },

  get_articles_today:{
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/get_articles_today?timestamp=${timestamp()}`,
    name:"get_articles_today"
  },

  get_discovery_info:{
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/get_discovery_info?timestamp=${timestamp()}`,
    name:"get_discovery_info"
  },

  mine:{
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/mine?timestamp=${timestamp()}`,
    name:'mine'
  },

  get_mine_packages: {
    url: ()=>`${HOBBY_DOMAIN}/react_reading_api/get_mine_packages?timestamp=${timestamp()}`,
    name: `get_mine_packages`
  },
  get_plan_info:{
    url:()=>`${HOBBY_DOMAIN}/react_reading_api/get_plan_info?extra_ugc_pid=0&timestamp=${timestamp()}`,
    name:"get_plan_info"
  },

  login: {
    method:HttpType.POST,
    url:()=>`${HOBBY_DOMAIN}/login.json`,
    name:'user_info'
  },

  user_info: {
    url:()=>`${HOBBY_DOMAIN}/index/user.json`,
    name:'user_info'
  },

  register: {
    method:HttpType.POST,
    url:()=>`${HOBBY_DOMAIN}/register.json`,
    name:'user_info'
  },

  ensure_code: {
    method:HttpType.POST,
    url:()=>`${HOBBY_DOMAIN}/ensure_code.json`,
    name:'ensure_code'
  },

  my_words: {
    method:HttpType.GET,
    url:()=>`${HOBBY_DOMAIN}/api/my_words.json`,
    name:'my_words',
  }
  ,
  videos: {
    method:HttpType.GET,
    url:()=>`${HOBBY_DOMAIN}/api/videos.json`,
    name:'videos',
  }
  ,
  utypes: {
    method:HttpType.GET,
    url:()=>`${HOBBY_DOMAIN}/api/utypes.json`,
    name:'utypes',
  }

}



export const NavBack = "Navigation/BACK";
export const AppstoreID = "id1313658481";
export const KeyRatting = "KeyRatting"

import { Linking } from 'react-native';
export function  rating_in_app_store()
{
  if (Platform.OS === 'ios') {
    Linking.openURL(`https://itunes.apple.com/us/app/${AppstoreID}`);
  }
}


export const KeyKeepAlive = "KeyKeepAlive";



import {NavigationActions} from "react-navigation"
export function resetAndGoto(navigation,dest,params)
{
  var resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: dest ,params:params})
    ]
  });

  navigation.dispatch(resetAction);
}
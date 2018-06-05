/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator, TabNavigator} from 'react-navigation';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import LoginPassword from "../betterme/betterme/login/login_password"
import CWebViewMall from "../betterme/betterme/common/c_web_view_mall.js"
import Home from "../betterme/betterme/home.js"
import Setting from "../betterme/betterme/login/setting.js"
import Video from "../betterme/betterme/video"
import Test from "../betterme/betterme/test"
import VideoList from "../betterme/betterme/videoList"
import Wordbook from "../betterme/betterme/wordbook"
import Packages from "../betterme/betterme/packages"
import Package_ from "../betterme/betterme/package"
import Mine from "../betterme/betterme/mine"
import MyPackages from "../betterme/betterme/my_packages"

import Icon from 'react-native-vector-icons/FontAwesome';
const initialRouteName = "Home"


const HomeNav = TabNavigator({
    VideoList: {screen: VideoList, navigationOptions: { title: '主页', headerLeft:<Text></Text>}},
    Wordbook: {screen: Wordbook,navigationOptions: { title: '单词本', headerLef:<Text></Text>}},
    MyPackages: {screen: MyPackages,navigationOptions: { title: '我的专辑', headerLeft:<Text></Text>}},
    Mine: {screen: Mine,navigationOptions: { title: '我的', headerLeft:<Text></Text>}},
  },

  {
    //animationEnabled: true,
    lazy: false,
    tabBarOptions:{

      style: {
        height:54,
        backgroundColor:"white",
        padding:0,
        borderTopWidth:1,
        borderTopColor:"rgba(203 ,205 ,207,0.5)",
      },

      tabStyle: {
        backgroundColor:"white",
        padding:0,
        paddingBottom:20,
        paddingTop:6
      },

      labelStyle:{zIndex:-100,color:"white"}
    },
    navigationOptions: ({navigation}) => {

      const { params } = navigation.state;
      var goback_refresh =  null;
      if(params)
        goback_refresh = params.goback_refresh;

      return  {
        headerStyle:{
          backgroundColor:"white",
        } ,
        // headerTitleStyle:{
        //   color:"white"
        // },
        // headerTintColor: 'white',
        headerLeft:<Text></Text>
      }
    }

  });


const RootStack =  StackNavigator(
  {
    LoginPassword:{screen:LoginPassword},
    CWebViewMall:{screen:CWebViewMall},
    Home:{screen:Home},
    HomeNav:{screen:HomeNav},
    Video:{screen:Video},
    Setting:{screen:Setting},
    Test :{screen:Test},
    VideoList:{screen:VideoList},
    Wordbook:{screen:Wordbook},
    Packages:{screen:Packages},
    Package_:{screen:Package_},
    Mine:{screen:Mine},
    MyPackages:{screen:MyPackages}
  },
  {
    initialRouteName: initialRouteName,
    navigationOptions: ({navigation}) => {

      const { params } = navigation.state;
      var left = <TouchableOpacity style={{flex:1,flexDirection:"row",paddingLeft:10,paddingRight:10,alignItems:"center"}} onPress={
        ()=>{

          navigation.goBack();
          const { state, setParams } = navigation;
          if(state &&  state.params && state.params.goBackCallBack)
          {
            state.params.goBackCallBack();
          }

        } }>
        <Icon name={'angle-left'} size={30} color="black" />
      </TouchableOpacity>;
        return {headerLeft:left}
    }
  }
);


import {NavigationActions} from "react-navigation"
//---防止点击太快了，重复navigate到同一个页面。---
const navigateOnce = (getStateForAction) => (action, state) => {
  const {type, routeName} = action;


  let rt_name = null;
  if(state && state.routes)
    rt_name = state.routes[state.routes.length - 1].routeName

  if( state && (type === NavigationActions.NAVIGATE || type === NavigationActions.BACK) && routeName === rt_name)
    return null;

  console.log("@@@navigateOnce ",action,state,rt_name)

  var ret = getStateForAction(action, state);
  return ret;
  // you might want to replace 'null' with 'state' if you're using redux (see comments below)
};

RootStack.router.getStateForAction = navigateOnce(RootStack.router.getStateForAction);

//---防止点击太快了，重复navigate到同一个页面。---




//------------redux和react-navigation集成------------

import { connect } from "react-redux";

const initialState = RootStack.router.getStateForAction(RootStack.router.getActionForPathAndParams(initialRouteName));

const navReducer = (state = initialState, action) => {

  console.log()
  if(action.type && action.type.indexOf("Navigation") >= 0)
  {
    var nextState = RootNav.router.getStateForAction(action, state);

    // Simply return the original `state` if `nextState` is null or undefined.
    var state = nextState || state;
    state = Object.assign({}, state,{action_:action})
    return state;
  }

  return state;
};


//------------redux和react-navigation集成------------


//redux 集成
import { createStore , applyMiddleware,combineReducers} from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import reducers from "../betterme/betterme/common/redux/reducers/reducers.js"


var reducers_ = combineReducers({nav:navReducer,...reducers});

var mw = null;
if(!__DEV__)
  mw = applyMiddleware(thunk)
else
  mw = applyMiddleware(thunk,logger)

const store = createStore(reducers_,mw)


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
          <RootStack/>
        </View>
      </Provider>);

  }
}


const styles = {

}
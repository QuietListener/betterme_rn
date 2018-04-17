/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';


import LoginPassword from "../betterme/betterme/login/login_password"
import CWebViewMall from "../betterme/betterme/common/c_web_view_mall.js"
import Home from "../betterme/betterme/home.js"
import Setting from "../betterme/betterme/login/setting.js"
import Video from "../betterme/betterme/video"
import Test from "../betterme/betterme/test"
import VideoList from "../betterme/betterme/videoList"
import Wordbook from "../betterme/betterme/wordbook"

const initialRouteName = "Home"
const RootStack =  StackNavigator(
  {
    LoginPassword:{screen:LoginPassword},
    CWebViewMall:{screen:CWebViewMall},
    Home:{screen:Home},
    Video:{screen:Video},
    Setting:{screen:Setting},
    Test :{screen:Test},
    VideoList:{screen:VideoList},
    Wordbook:{screen:Wordbook}
  },
  {
    initialRouteName: initialRouteName
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
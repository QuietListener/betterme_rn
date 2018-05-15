/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const GET_WECHAT_INSTALLED_STATUS = 'GET_WECHAT_INSTALLED_STATUS'
export const NAV_STATUS = "NAV_STATUS";

export const UPDATE_DATA_STATE = "UPDATE_DATA_STATE"
export const UPDATE_DATA_STATUS = {
  LOADING:"LOADING",
  SUCCEED:"SUCCEED",
  FAILED:"FAILED",
  INIT:"INIT",
}
export const CLEAR_ALL_DATA = "CLEAR_ALL_DATA";
export const LEFT_BAR_STATUS = "LEFT_BAR_STATUS";

import * as base from "../../base.js"

/*
 * action 创建函数
 */

export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function set_left_bar_status(status) {
  return { type: LEFT_BAR_STATUS, text:status==true}
}

export function get_wechat_installed_status() {
  return { type: GET_WECHAT_INSTALLED_STATUS }
}

export function test_timout()
{
  return function (dispatch, getState) {
    setTimeout(()=>dispatch(get_wechat_installed_status()),2000)
  }
}


export function nav_status(data)
{
  return { type: NAV_STATUS,text:data }
}


export function load_plan_data(call_back)
{
  console.log("load_plan_data");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.get_plan_info,dispatch,getState,call_back);
  }
}

export function update_data_state(name,url,status,data,e)
{
  return {
    type: UPDATE_DATA_STATE,
    text:{
      name,url,status,data,e
    }
  }
}

export function load_discovery_data()
{
  console.log("load_discovery_data");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.get_discovery_info,dispatch,getState);
  }
}


export function load_mine_package_data()
{
  console.log("load_mine_package_data");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.get_mine_packages,dispatch,getState);
  }
}

export function load_mine_data()
{
  console.log("load_mine_data");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.mine,dispatch,getState);
  }
}

async function return_get_data_func(type,dispatch,getState,call_back,params={})
{
  var state = getState();
  //console.log("getState",state);

  if(state && state.update_state
    && state.update_state[type.name]
    && state.update_state[type.name] == UPDATE_DATA_STATUS.LOADING)
  {
    console.log(`${state.update_state[type.name].url()} is loading`)
    return;
  }

  dispatch(update_data_state(
    type.name,
    type.url(),
    UPDATE_DATA_STATUS.LOADING,null,null));

  try
  {
    var url = type.url();
    var method = type.method || base.HttpType.GET;

    params = params || {}

    params["access_token"]=base.access_token;

    if(method == base.HttpType.GET)
    {
      var params_str = "";
      for (let name in params)
      {
        params_str += `${name}=${params[name]}&`;
      }
      url = url+`?${params_str}`;
      params={};
    }

    console.log(`HTTP: ${method} :${url} :  ${JSON.stringify(params)} `);

    var config = method == base.HttpType.GET ? {method:method , url:url } : {method:method , url:url, data:params}

    var res3 = await base.axios(config);

    console.log(`HTTP: ${method} :${url} :  ${JSON.stringify(params)} : res=${JSON.stringify(res3)}`);

    let data = res3.data;
    let new_data = null;
    if (call_back)
    {
      new_data = call_back(data);
    }
    else
    {
      new_data = data;
    }

    dispatch(update_data_state(
      type.name,
      type.url(),
      UPDATE_DATA_STATUS.SUCCEED,
      new_data, null));
  }
  catch(e)
  {
    console.log(`HTTP: ${method} :${url} :  ${JSON.stringify(params)} `,e);
    dispatch(update_data_state(
      type.name,
      type.url(),
      UPDATE_DATA_STATUS.FAILED, null, e));
  }

}


export function load_specified_data()
{
  return function(dispatch,getState) {
    console.log("load_specified_data")
    dispatch(load_mine_data())
    dispatch(load_discovery_data())
    dispatch(load_mine_package_data())
  }
}

export function load_reading_data()
{

  return function(dispatch,getState) {

    console.log("load_reading_data");

    dispatch(update_data_state(
      base.URLS.current_plan_checkkb.name,
      base.URLS.current_plan_checkkb.url(),
      UPDATE_DATA_STATUS.LOADING,null,null));

    base.axios({
      method: 'get',
      url: base.URLS.current_plan_checkkb.url()
    }).then((res)=>{

      let data = res.data;

      dispatch(update_data_state(
        base.URLS.current_plan_checkkb.name,
        base.URLS.current_plan_checkkb.url(),
        UPDATE_DATA_STATUS.SUCCEED,
        data,null));

      if((data && (data.read_level > 0) &&  data.notify_configured == true)  )
      {
        if (data.package_finished >= data.package_size)
        {
          return_get_data_func(base.URLS.get_daka_package_info, dispatch, getState);
          //reset_specified_data_state(base.URLS.get_daka_info, dispatch, getState);
        }
        else if (data.finished_today >= data.article_per_day)
        {
          return_get_data_func(base.URLS.get_daka_info, dispatch, getState);
          //reset_specified_data_state(base.URLS.get_daka_package_info, dispatch, getState)
        }
        else
        {
          //reset_specified_data_state(base.URLS.get_daka_package_info, dispatch, getState);
          //reset_specified_data_state(base.URLS.get_daka_info, dispatch, getState);
        }
        return_get_data_func(base.URLS.get_articles_today, dispatch, getState);
    }

    }).catch(e=>{

      dispatch(update_data_state(
        base.URLS.current_plan_checkkb.name,
        base.URLS.current_plan_checkkb.url(),
        UPDATE_DATA_STATUS.FAILED,null,e));

    });

  }

}


export function clear_all_data()
{
  return {
    type: UPDATE_DATA_STATE,
    text:{name:CLEAR_ALL_DATA,url:null,status:null,data:null,e:null}
  }
}


export function reset_specified_data_state(type,dispatch,getState)
{
  return update_data_state(type.name, type.url(), UPDATE_DATA_STATUS.INIT, null, null)
}

export function login(params, call_back)
{
  console.log("login");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.login,dispatch,getState,call_back,params);
  }
}

export function register(params, call_back)
{
  console.log("register");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.register,dispatch,getState,call_back,params);
  }
}

export function ensure_code(params, call_back)
{
  console.log("ensure_code");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.ensure_code,dispatch,getState,call_back,params);
  }
}


export function get_my_words(params,call_back)
{
  console.log("get_my_words");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.my_words,dispatch,getState,call_back,params);
  }
}


export function videos(params,call_back)
{
  console.log("videos");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.videos,dispatch,getState,call_back,params);
  }
}


export function user_info(call_back)
{
  console.log("user_info");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.user_info,dispatch,getState,call_back,null);
  }
}

export function utypes()
{
  console.log("utypes");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.utypes,dispatch,getState,null,{});
  }
}



export function packages(params,call_back)
{
  console.log("packages");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.packages,dispatch,getState,call_back,params);
  }
}



export function package_(params,call_back)
{
  console.log("packages");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.package,dispatch,getState,call_back,params);
  }
}

export function like_package(params,call_back)
{
  console.log("like_package");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.like_package,dispatch,getState,call_back,params);
  }
}

export function unlike_package(params,call_back)
{
  console.log("unlike_package");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.unlike_package,dispatch,getState,call_back,params);
  }
}


export function add_my_package(params,call_back)
{
  console.log("add_my_package");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.add_my_package,dispatch,getState,call_back,params);
  }
}



export function watch_video(params,call_back)
{
  console.log("add_my_package");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.watch_video,dispatch,getState,call_back,params);
  }
}


export function my_packages(params,call_back)
{
  console.log("my_packages");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.my_packages,dispatch,getState,call_back,params);
  }
}




export function statistics(call_back)
{
  console.log("statistics");
  return function(dispatch,getState) {
    return_get_data_func(base.URLS.statistics,dispatch,getState,call_back,null);
  }
}



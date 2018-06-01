/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Linking,Switch, AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';

import Moment from "moment"
import * as base from "../common/base"
import CRedPoint from "../common/component/c_red_point.js"

class Setting extends Component
{


  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return { title:"设置"};
  };
  constructor(props)
  {
    super(props)

    this.state = {switchValue:true}
    this.rating_on_appstore = this.rating_on_appstore.bind(this);

    AsyncStorage.getItem(base.RP_NEW_VERSION).then(val=>{

      //alert(val);
      if(val != null && val != undefined && (val == 1 || val == "1"))
      {
        this.setState({ has_new_version:true})
      }
      else
      {
        this.setState({ has_new_version:false})
      }
    })

  }
  componentDidMount()
  {
    var params = {client_type:base.is_ios?1:3}
    this.props.latest_version(params);
  }



  download_new_version(url)
  {

    if(base.is_android)
    {
      console.log("download new apk")
      if(url != null)
        Linking.openURL(url);
    }
    else if(base.is_ios)
    {
      console.log("go to appstore")
    }

    base.clearRedPoint(new Array(base.RP_NEW_VERSION));
    this.props.update_red_point();
  }

  logout()
  {
     base.clear_cookie("access_token");

     this.props.clear_all_data();


    //重置 route
     var resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home' })
      ]
    });

    this.props.navigation.dispatch(resetAction);
    //重置 route
  }

  rating_on_appstore()
  {
    if(this.state.has_new_version == true)
    {
        base.rating_in_app_store();
    }
  }

  render()
  {

    var new_version_view = <TouchableOpacity  style={[inner_styles.subitem2,{flex:3}]}>
      <Text style={inner_styles.normal_text}>{`已经是最新版了`}</Text>
    </TouchableOpacity>

    if(this.state.has_new_version && this.state.has_new_version == true)
    {
      var lv = this.props.data[base.URLS.latest_version.name].data
      console.log("latest version",lv);

      if(lv && lv.data && lv.data.version && lv.data.version > base.buildNumber )
      {
        new_version_view = <TouchableOpacity onPress={()=>{this.download_new_version(lv.data.download_url)}} style={[inner_styles.subitem2,{flex:3}]}>
          <Text style={[inner_styles.normal_text,{color:"red",borderWidth:1,borderRadius:4,padding:2,borderColor:"red",paddingRight:8,paddingLeft:8,fontWeight:"bold"}]}>下载新版本</Text>
        </TouchableOpacity>
      }
    }

    return (
      <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
        <View style={inner_styles.item}>

          <TouchableOpacity style={inner_styles.subitem1} onPress={()=>this.logout()}>
            <Text style={inner_styles.bold_text}>退出账号</Text>
          </TouchableOpacity>

          <TouchableOpacity style={inner_styles.subitem2} onPress={()=>this.logout()}>
            <Text style={inner_styles.normal_text}></Text>
          </TouchableOpacity>
        </View>

        <View style={inner_styles.item}>

          <TouchableOpacity style={inner_styles.subitem1} >
            <Text style={inner_styles.bold_text}>email:fowardgogogo@gmail.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={inner_styles.subitem2} >
            <Text style={inner_styles.normal_text}></Text>
          </TouchableOpacity>
        </View>

        <View style={inner_styles.item}>
          <TouchableOpacity style={inner_styles.subitem1} >
              <Text style={inner_styles.bold_text}>qq 群:
              661359464  入群暗号:小蜜蜂</Text>
          </TouchableOpacity>

          <TouchableOpacity style={inner_styles.subitem2} >
            <Text style={inner_styles.normal_text}></Text>
          </TouchableOpacity>

        </View>


        <View style={inner_styles.item}>
          <CRedPoint name={base.RP_NEW_VERSION}  style={{position:"absolute",left:10,top:10}}/>
          <TouchableOpacity style={inner_styles.subitem1} >
            <Text style={inner_styles.bold_text}>{`版 本:${base.buildNumber}`}</Text>
          </TouchableOpacity>

          {new_version_view}
        </View>
      </View>
    )
  }
}


const inner_styles = {
  item:{
      backgroundColor:"white",
      flexDirection:"row",
      paddingTop:8,
      paddingBottom:8,
      paddingLeft:20,
      justifyContent:"center",
      alignItems:"center",
      marginTop:10
  },

  subitem1:{
    flex:5,
    alignItems:"flex-start",
    justifyContent:"center"

  },

  subitem2:{
    flex:1,
    alignItems:"flex-end",
    justifyContent:"center",
    marginRight:20
  },

  bold_text:{
    fontSize:16,
    color:"rgb(0,0,0)",
  },

  normal_text:{
    fontSize:14,
    color:"rgb(177,180,183)"

  },

};



import _ from "lodash"
_.mixin(Setting.prototype,base.base_component);


import { connect } from "react-redux";
import {clear_all_data} from "../common/redux/actions/actions.js"
import {latest_version,update_red_point} from "../common/redux/actions/actions";


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {

    latest_version:(params)=>{
      dispatch(latest_version(params,null))
    },
    clear_all_data:()=>{
      dispatch(clear_all_data())
    },
    update_red_point:()=>{
      dispatch(update_red_point());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Setting);


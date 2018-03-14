/**
 * Created by junjun on 17/11/8.
 */
import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity, ScrollView,Alert,Switch, AsyncStorage} from 'react-native'
import {StackNavigator, StackRouter,NavigationActions} from 'react-navigation';

import Moment from "moment"
import * as base from "../common/base"
const DeviceInfo = require('react-native-device-info');

class Setting extends Component
{

  constructor(props)
  {
    super(props)

    this.state = {switchValue:true}
    this.rating_on_appstore = this.rating_on_appstore.bind(this);
  }

  componentDidMount()
  {

  }

  logout()
  {
     base.clear_cookie("access_token");
     this.props.reset_user_info(base.URLS.user_info);

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
    //alert(`switchValue ${this.state.switchValue}`);


    return (
      <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
        <View style={inner_styles.item}>
            <Button title={"logou"} onPress={()=>this.logout()}/>
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
    flex:3,
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
    paddingBottom:6,
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
import {reset_specified_data_state} from "../common/redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {

    reset_user_info:(type)=>{
      reset_specified_data_state(type,dispatch,null)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Setting);


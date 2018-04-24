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


  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return { title:"设置"};
  };
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
    //alert(`switchValue ${this.state.switchValue}`);


    return (
      <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
        <View style={inner_styles.item}>

          <TouchableOpacity style={inner_styles.subitem1} onPress={()=>this.logout()}>
            <Text style={inner_styles.bold_text}>退出</Text>
          </TouchableOpacity>

          <TouchableOpacity style={inner_styles.subitem2} onPress={()=>this.logout()}>
            <Text style={inner_styles.normal_text}>></Text>
          </TouchableOpacity>
        </View>


        <View style={inner_styles.item}>

          <TouchableOpacity style={inner_styles.subitem1} onPress={()=>this.logout()}>
            <Text style={inner_styles.bold_text}>qq群:</Text>
          </TouchableOpacity>

          <TouchableOpacity style={inner_styles.subitem2} onPress={()=>this.logout()}>
            <Text style={inner_styles.normal_text}>></Text>
          </TouchableOpacity>


        </View>


        <View style={inner_styles.item}>

          <TouchableOpacity style={inner_styles.subitem1} onPress={()=>this.logout()}>
            <Text style={inner_styles.bold_text}>版本(0.1.0)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={inner_styles.subitem2} onPress={()=>this.logout()}>
            <Text style={inner_styles.normal_text}>></Text>
          </TouchableOpacity>


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


const mapStateToProps = state => {
  return {
    data: state.update_state
  }
}

const mapDispatchToProps = dispatch => {
  return {

    clear_all_data:()=>{
      dispatch(clear_all_data())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(Setting);


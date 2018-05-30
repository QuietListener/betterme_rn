import React, {Component} from 'React'
import {View, Text,TouchableOpacity} from 'react-native'
//import Icon from 'react-native-vector-icons/FontAwesome';

export default class CNetworkErrorTip extends Component
{
  constructor(props)
  {
    super(props);

    console.log(props);
  }

  render()
  {
    return <TouchableOpacity onPress={this.props.refresh ? this.props.refresh() : ()=>null}
                 style={{backgroundColor:"rgb(254,223,224)",height:30,justifyContent:"center",
                        alignItems:"center",...this.props.style}}>
      <Text style={{ color:"rgb(129,104,105)" }}>网络异常 请在稳定的网络环境下重试</Text>

    </TouchableOpacity>
  }
}
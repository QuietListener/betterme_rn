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
    return <TouchableOpacity onPress={this.props.refresh ? this.props.refresh : ()=>null}
                 style={{backgroundColor:"red",padding:6,justifyContent:"center",
                        alignItems:"center",...this.props.style}}>
      <Text style={{ color:"white" }}>{this.props.text||`网络异常 点我重试一下呢~`}</Text>

    </TouchableOpacity>
  }
}
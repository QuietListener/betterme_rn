import React, {Component} from 'React'
import {View, Text,TouchableOpacity} from 'react-native'
//import Icon from 'react-native-vector-icons/FontAwesome';

export default class CHeadTip extends Component
{
  constructor(props)
  {
    super(props);

    console.log(props);
  }

  render()
  {
    return <TouchableOpacity onPress={this.props.onPress ? this.props.onPress : ()=>null}
                 style={{backgroundColor:"rgb(254,223,224)",height:30,justifyContent:"center",
                        alignItems:"center",...this.props.style}}>
      <Text style={{ color:"rgb(129,104,105)" }}>{this.props.tip}</Text>

    </TouchableOpacity>
  }
}
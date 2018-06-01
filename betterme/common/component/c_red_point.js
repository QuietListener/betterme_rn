import React, {Component} from 'React'
import {View,AsyncStorage} from 'react-native'

class CRedPoint extends Component
{
  constructor(props)
  {
    super(props);
    console.log(this.props)
    this.state={
      name:this.props.name,
      show:false
    }

    this.refresh_red_point = this.refresh_red_point.bind(this);
  }

  async refresh_red_point()
  {
    try
    {
      var value = await AsyncStorage.getItem(this.props.name)
      if (value == 1 || value == "1")
      {
        if (this.state.show != true)
          this.setState({show: true})
      }
      else
      {
        if (this.state.show != false)
          this.setState({show: false})
      }
    }
    catch(e)
    {
      console.error("AsyncStorage redPoint",e);
      this.setState({show: false})
    }
  }

  async componentDidMount()
  {
    this.refresh_red_point();
  }

  componentWillReceiveProps(newProps)
  {
    this.refresh_red_point();
  }

  render()
  {
    if(this.state.show != true)
    {
      return null;
    }

    var radius = 4 || this.props.radius;
    return (
        <View key={`${this.props.red_point}_${this.props.rp_id}`} style={{width:radius*2,height:radius*2,borderRadius:radius,backgroundColor:"red",...this.props.style}}></View>
    );
  }
}




import { connect } from "react-redux";
import {update_red_point} from "../redux/actions/actions.js"


const mapStateToProps = state => {
  return {
    red_point: state.red_point
  }
}

const mapDispatchToProps = dispatch => {
  return {

    update_red_point:()=>{
      dispatch(update_red_point())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(CRedPoint);


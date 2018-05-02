import React, {Component} from 'React'
import {View, Text,TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
export default class CPagination extends Component
{
  constructor(props)
  {
    super(props);

    console.log(props);
  }


  render()
  {
    var paginate = null;
    var cur_page = this.props.page;
    var total_page = this.props.total_page;

    var views = [];

    var pre = <TouchableOpacity activeOpacity={0.8}
                                style={{width:30,flexDirection:"row",justifyContent:"center",alignItems:"center"}}
                                onPress={()=>{this.props.goTo(cur_page - 1)}}
    >
      <Icon name={'angle-left'} size={26} color="black" />
      <Text style={{fontSize:14,color:"black"}}>  </Text>
    </TouchableOpacity>

    var next = <TouchableOpacity activeOpacity={0.8}
                                 style={{width:30,flexDirection:"row",justifyContent:"center",alignItems:"center"}}
                                 onPress={()=>{this.props.goTo(cur_page + 1)}}
    >
      <Icon name={'angle-right'} size={26} color="black" />
      <Text style={{fontSize:14,color:"black"}}>  </Text>
    </TouchableOpacity>


    if(cur_page > 1)
      views.push(pre);

    for(let i = 1; i <= total_page; i++)
    {
      var active = (i == cur_page);
      let v = <Text style={{padding:6,marginRight:8,fontSize:16,color: "black",borderWidth:active?1:0,borderColor:"black"}} onPress={()=>this.props.goTo(i)}>{i}</Text>
      views.push(v);
    }

    if(cur_page < total_page)
      views.push(next);



    return   <View style={{padding:4,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
      {total_page>1?views:null}
    </View>
  }
}
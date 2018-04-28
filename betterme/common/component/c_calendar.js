import * as base from '../../common/base'
import React, {Component} from 'React'
import {View, Image, Text, Button, StyleSheet,TouchableOpacity} from 'react-native'
import {StackNavigator, StackRouter} from 'react-navigation';
import Moment from "moment"

export default class CCalendar extends Component
{
  constructor(props)
  {
    super(props);

    //console.log(props);

  }

  render()
  {

    var Width = this.props.width||20*16;
    var DayWidth = base.is_small_screen() ? Width/14 : Width/16;
    var DayMargin = DayWidth/14;

    var today  = Moment(this.props.today)
    var first_day = today.date(1);
    var month = today.month();
    var datas = {}

    var events = this.props.events.map((item)=>{return  Moment(item,"YYYY-MM-DD")})
    //console.log(events);
    var init_days = first_day.days();
    for(var i = 0;i < init_days && i < 6; i++)
    {
      datas[i] = [null];
    }

    var i = 0;
    while(first_day.month() == month)
    {
        var days = first_day.days();
        var  dates = first_day.date();

        if(datas[days] == null)
        {
          datas[days] = []
        }
        datas[days].push(Moment(first_day));
        first_day = first_day.add(1,"days");
    }


    var responsive_style = {width:DayWidth,height:DayWidth,marginTop:8}

    var daymaps = [[0,"日"], [1,"一"] ,[2,"二"] ,[3,"三"] ,[4,"四"] ,[5,"五"] ,[6,"六"]]
    var today = this.props.today;
    var views = daymaps.map((item,index)=>{

      var column = datas[item[0]].map((i_,index_)=>{

        var dayView =  null;

        if(i_ == null)
        {
          dayView = <View key={item[1]} style={[styles.empty_day,responsive_style]}><Text>{null}</Text></View>
        }
        else
        {
          var dates = i_.date();
          var  style_ = null;
          var  text_styles = {color:"rgb(153, 153, 153)",fontSize:12};
          if(dates <= today.date())
          {
            style_ = [styles.day,responsive_style]

            var isEvents = (events.filter((item)=>{return i_.format("YYYYMMDD") === item.format("YYYYMMDD")}).length > 0);
            //console.log(i_,item)
            if(isEvents == true)
            {
              style_.push(styles.hilight_day);
              text_styles["color"]="white"
            }
          }
          else
          {
            style_ = [styles.day,{borderBottomWidth:0},responsive_style]
          }

          dayView = <View key={index_*11112} style={[style_,responsive_style]}><Text  key={index_*111121} style={text_styles}>{dates}</Text></View>
        }

        return dayView;
      })

      //添加标题
      var head = <View><Text  key={index*111129} style={{color:"#999"}}>{item[1]}</Text></View>
      column.splice(0,0,head);

      return <View key={index*11111} style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"flex-start",}}>{column}</View>;
    })


    //console.log("views",views);

    return (
       <View style={[{flexDirection:"row",justifyContent:"flex-start",paddingBottom:6},this.props.style]}>
         {views}
       </View>
    );
  }
}


const styles = StyleSheet.create({
    day:{
      padding:2,
      margin:2,
      width:22,
      height:22,
      justifyContent:"center",
      alignItems:"center",
      borderRadius:2,
      borderBottomWidth:1,
      borderColor:"green"
    },
  hilight_day:{
      backgroundColor:"green",
  },

  empty_day:{
    padding:2,
    margin:2,
    width:20,
    height:20,
    justifyContent:"center",
    alignItems:"center",
  }

});
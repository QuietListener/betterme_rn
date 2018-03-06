import { ADD_TODO,GET_WECHAT_INSTALLED_STATUS,NAV_STATUS,UPDATE_DATA_STATUS,UPDATE_DATA_STATE, CLEAR_ALL_DATA ,LEFT_BAR_STATUS} from '../actions/actions'


function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return{
        ...state,
        todo:{
          text: action.text,
          completed: false
        }
      }

    default:
      return state
  }
}

function wechat_installed_status(state = false, action) {

  if(action.type == GET_WECHAT_INSTALLED_STATUS)
  {
    return true;
  }

  return state;

}

function nav_status(state = false, action) {

  if(action.type == NAV_STATUS)
  {
    return action.text;
  }
  return null;
}

function update_state(state={},action)
{
  if(action.type == UPDATE_DATA_STATE)
  {
    var {name,url,status,data,e} = action.text;

    if(name == null)
    {
      console.error("update_state error",action);
      return state;
    }

    if(name == CLEAR_ALL_DATA)
    {
      return {};
    }

    if(state[name] == null)
    {
      state[name] = {};
    }

    if(status == UPDATE_DATA_STATUS.SUCCEED)
    {
      state[name] = {url,status,data,e}
    }
    else if(status == UPDATE_DATA_STATUS.FAILED || status == UPDATE_DATA_STATUS.LOADING )
    {
      state[name][`url`] = url;
      state[name][`status`] = status;
      state[name][`e`] = e;
    }
    else if(status == UPDATE_DATA_STATUS.INIT)
    {
      state[name] = {};
    }

    return Object.assign({},state);
  }

  return state;

}

function left_bar_status(state=false,action)
{
  if(action.type == LEFT_BAR_STATUS)
  {
    return action.text;
  }

  return state;
}

 var reducers ={
  nav_status,
  todos,
  wechat_installed_status,
  update_state,
   left_bar_status,
 }

export default reducers;
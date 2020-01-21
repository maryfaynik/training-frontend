const defaultState = {
  user: {},
  allClients: [],
  allTrainers: []
}

function userReducer(state = defaultState, action) {
    let index, key, newArray

    switch (action.type) {
      
      case "SET_USER":
        return {...state, user: action.payload}

      case "SET_USERS":
        key = `all${action.payload.user_type}s`
        console.log('setting ', key, 'to ', action.payload.users)
        return {...state, [key]: action.payload.users} 

      case "ADD_USER":
        key = `all${action.payload.user_type}s`
        return {...state, [key]: [...state[key], action.payload]} 

      case "UPDATE_USER":
        console.log("action payload = ", action.payload)
        if(action.payload.user_type === "Manager"){
          return {...state, user: action.payload}
        }else{
          key = `all${action.payload.user_type}s`
          newArray = [...state[key]]
          index = newArray.findIndex(user => user.id === action.payload.id)
          newArray[index] = {...action.payload}
          return {...state, [key]: [...newArray]}
        }

      case "DELETE_USER":
        key = `all${action.payload.user_type}s`
        index = state[key].findIndex(user => user.id === parseInt(action.payload.id))
        return {...state, [key]: [...state[key].slice(0, index), ...state[key].slice(index +1)]}
      
      default:
        return state;
        
    }
  }

export default userReducer
  
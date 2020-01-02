const defaultState = {
  user: {},
  allClients: [],
  allTrainers: [],
  allUsers: []
}

function userReducer(state = defaultState, action) {
    let index, key, newArray

    switch (action.type) {
      
      case "SET_USER":
        return {...state, user: action.payload}

      case "SET_USERS":
        
        key = `all${action.payload.userType}s`
        return {...state, [key]: action.payload.users} 

      case "ADD_USER":
        key = `all${action.payload.userType}s`
        return {...state, [key]: [...state[key], action.payload.user]} 

      case "UPDATE_USER":
        if(action.payload.userType === "Manager"){
          return {...state, user: action.payload.user}
        }else{
          key = `all${action.payload.userType}s`
          newArray = [...state[key]]
          index = newArray.findIndex(user => user.id === action.payload.user.id)
          newArray[index] = {...action.payload.user}
          return {...state, [key]: [...newArray]}
        }

      case "DELETE_USER":
        key = `all${action.payload.userType}s`
        index = state[key].findIndex(user => user.id === parseInt(action.payload.id))
        return {...state, [key]: [...state[key].slice(0, index), ...state[key].slice(index +1)]}
      
      default:
        return state;
        
    }
  }

export default userReducer
  
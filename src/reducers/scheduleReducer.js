const defaultState = {
  allSessions: []
}

function scheduleReducer(state= defaultState, action) {
    switch (action.type) {
      case "SET_SESSIONS":
        return {...state, allSessions: action.payload}

      case "ADD_SESSION":
        return {...state, allSessions: [...state.allSessions, action.payload]}
      
      case "UPDATE_SESSION":
        let newSessions = [...state.allSessions]
        let index = newSessions.findIndex(ses => ses.id === action.payload.id)
        newSessions[index] = {...action.payload}

        return {...state, allSessions: [...newSessions]}
      
      case "DELETE_SESSION":
        return {...state, allSessions: state.allSessions.filter(ses => ses.id !== action.payload)}
      
      default:
        return state;
    }
  }
  
  export default scheduleReducer
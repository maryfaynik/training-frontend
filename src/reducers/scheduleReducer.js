const defaultState = {
  allSessions: []
}

function scheduleReducer(state= defaultState, action) {
    switch (action.type) {
      case "SET_SESSIONS":
        if(action.payload.length > 0){
          localStorage.sessions = action.payload.id
        } else {
          localStorage.removeItem('sessions');
        }
        return {...state, allSessions: action.payload}
      case "ADD_SESSION":
        console.log("here, adding session : ", action.payload)
        return {...state, allSessions: [...state.allSessions, action.payload]}
      case "DELETE_SESSION":
        return {...state, allSessions: state.allSessions.filter(ses => ses.id !== action.payload)}
      default:
        return state;
    }
  }
  
  export default scheduleReducer
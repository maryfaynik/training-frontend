const defaultState = {
    activePage: 'dashboard',
    levels: [],
    packages: []
  }
  
function scheduleReducer(state= defaultState, action) {
    switch (action.type) {
        case "SET_ACTIVEPAGE":
            console.log("setting page to ", action.payload)
            return {...state, activePage: action.payload}
        case "SET_LEVELS":
            console.log("settings levels to", action.payload)
            return {...state, levels: action.payload}
        case "SET_PACKAGES":
            console.log("settings packages to", action.payload)
            return {...state, packages: action.payload}
        default:
            return state;
    }
}
    
 export default scheduleReducer
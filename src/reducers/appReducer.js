

const defaultState = {
    activePage: 'dashboard',
    levels: [],
    packages: []
  }
  
function scheduleReducer(state= defaultState, action) {
    let newArray
    let index
    switch (action.type) {
        case "SET_ACTIVEPAGE":
            return {...state, activePage: action.payload}
        
        case "SET_LEVELS":
            return {...state, levels: action.payload}
        
        case "ADD_LEVEL":
            return {...state, levels: [...state.packages, action.payload]}
            
        case "UPDATE_LEVEL":
            newArray = [...state.levels]
            index = newArray.findIndex(level => level.id === action.payload.id)
            newArray[index] = {...action.payload}
            return {...state, levels: [...newArray]}
                
        case "DELETE_LEVEL":
            index = state.levels.findIndex(level => level.id === parseInt(action.payload))
            return {...state, levels: [...state.levels.slice(0, index), ...state.levels.slice(index +1)]}
                        

        case "SET_PACKAGES":
            return {...state, packages: action.payload}

        case "ADD_PACKAGE":
            return {...state, packages: [...state.packages, action.payload]}
    
        case "UPDATE_PACKAGE":
            newArray = [...state.packages]
            index = newArray.findIndex(pack => pack.id === action.payload.id)
            newArray[index] = {...action.payload}
            return {...state, packages: [...newArray]}
    
        case "DELETE_PACKAGE":
            index = state.packages.findIndex(pack => pack.id === parseInt(action.payload))
            return {...state, packages: [...state.packages.slice(0, index), ...state.packages.slice(index +1)]}
              
        default:
            return state;
    }
}
    
 export default scheduleReducer
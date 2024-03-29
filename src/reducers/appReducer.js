

const defaultState = {
    activePage: 'dashboard',
    levels: [],
    packages: [],
    clientPackages: [],
    userLoading: true,
    loading: true
  }
  
function scheduleReducer(state= defaultState, action) {
    let newArray
    let index
    switch (action.type) {
        case "SET_LOADING":
            return {...state, loading: action.payload}
        
        case "SET_USER_LOADING":
            return {...state, userLoading: action.payload}

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
            
        case "SET_CLIENT_PACKAGES":
            return {...state, clientPackages: action.payload}

        case "ADD_CLIENT_PACKAGE":
            return {...state, clientPackages: [...state.clientPackages, action.payload]}

        case "DELETE_CLIENT_PACKAGE":
            index = state.clientPackages.findIndex(pack => pack.id === parseInt(action.payload))
            return {...state, clientPackages: [...state.clientPackages.slice(0, index), ...state.clientPackages.slice(index +1)]}
    
        case "DECREASE_SESSIONS":
            newArray = [...state.clientPackages]
            index = state.clientPackages.findIndex(cp => cp.id === action.payload)
            newArray[index].session_count -= 1
            return {...state, clientPackages: [...newArray]}
    
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
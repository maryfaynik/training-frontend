

const defaultState = {
    activePage: 'dashboard',
    levels: [],
    packages: [],
    clientPackages: [],
    userLoading: true,
    allLoading: true,
    loading: true
  }
  
function scheduleReducer(state= defaultState, action) {
    let newArray
    let index
    switch (action.type) {
        case "SET_LOADING":
            console.log("reducer setting all loading to ", action.payload)
            return {...state, loading: action.payload}
        
            case "SET_USER_LOADING":
            console.log("reducer setting user loading to ", action.payload)
            return {...state, userLoading: action.payload}

        case "SET_ACTIVEPAGE":
            return {...state, activePage: action.payload}
        
        case "SET_LEVELS":
             console.log("setting levels to ", action.payload)
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
            console.log("setting packages to ", action.payload)
            return {...state, packages: action.payload}

        case "ADD_PACKAGE":
            return {...state, packages: [...state.packages, action.payload]}
            
        case "SET_CLIENT_PACKAGES":
            console.log("setting client packages to ", action.payload)
            return {...state, clientPackages: action.payload}

        case "ADD_CLIENT_PACKAGE":
            return {...state, clientPackages: [...state.clientPackages, action.payload]}
        
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
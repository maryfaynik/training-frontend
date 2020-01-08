import { API } from '../App'

// SETTERS =======================================

export function setUser(user, dispatch){
    return {type: "SET_USER", payload: user }
}

export function setUsers(dispatch, users, userType){
    return {type: "SET_USERS", payload: {users, userType} }
}
    
export function setSessions(sessions){
    return {type: "SET_SESSIONS", payload: sessions }
}

export function setLevels(levels){
    return {type: "SET_LEVELS", payload: levels }
}

export function setClientPackages(client_packages){
    return {type: "SET_CLIENT_PACKAGES", payload: client_packages }
}

export function setPackages(packages){
    return {type: "SET_PACKAGES", payload: packages }
}

export function setActivePage(page){
    return {type: "SET_ACTIVEPAGE", payload: page }
}

export function setUserLoading(flag){
    return {type: "SET_USER_LOADING", payload: flag}
}

export function setAllLoading(flag){

    return {type: "SET_ALL_LOADING", payload: flag}
}


// GETTERS ==================================

export function initialFetch(user) {
    return function(dispatch){
        switch(user.type){
            case "Trainer": //get this trianers clients and sessions, set trainers to this user
              getClients(dispatch, user.id, user)
              getRecentSessions(dispatch, user.id)
              setUsers(dispatch, [user], "Trainer")
              break
            case "Client": // get this client's session and trainers, set clients to this user
              getTrainers(dispatch, user.id, user)
              getRecentSessions(dispatch, user.id)
              setUsers(dispatch, [user], "Client")
              break
            default: // Get all of everything...for manager
              getClients(dispatch, null, user)
              getTrainers(dispatch)
              getRecentSessions(dispatch)
              break
          }

          // get all the levels
          getLevels(dispatch)
          // get all the packages
          getPackages(dispatch)
          // get all client-packages
          getClientPackages(dispatch)


          //now go back and get alll the sessions
          // Loading will likely be set to false much sooner
          // after the clients are fetched
          
    }
}

export function getLevels(dispatch){
    fetch(`${API}/levels`)
    .then(res => res.json())
    .then(data => {
        dispatch(setLevels(data.levels))
    })
}

export function getClientPackages(dispatch){
    fetch(`${API}/client_packages`)
    .then(res => res.json())
    .then(data => {
        dispatch(setClientPackages(data.client_packages))
    })
}

export function getPackages(dispatch){
    fetch(`${API}/packages`)
    .then(res => res.json())
    .then(data => {
        dispatch(setPackages(data.packages))
    })
}

export function getRecentSessions(dispatch, id = null){
    let url = id ? `${API}/recentusersessions/${id}` : `${API}/recentsessions`
        fetch(url)
        .then(res => res.json())
        .then(data => {

            dispatch(setSessions(data.sessions))
        })
}
export function getSessions(dispatch, id = null){
    let url = id ? `${API}/usersessions/${id}` : `${API}/sessions`
        fetch(url)
        .then(res => res.json())
        .then(data => {

            dispatch(setSessions(data.sessions))
        })
}

export function getClients(dispatch, id = null, user){
    let url = id ? `${API}/userclients/${id}` : `${API}/clients`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setUsers(dispatch, data.users, "Client"))
            dispatch(setAllLoading(false))
            switch(user.type){
                case "Trainer": 
                  getSessions(dispatch, user.id)
                  break
                case "Client": 
                  getSessions(dispatch, user.id)
                  break
                default:
                  getSessions(dispatch)
                  break
            }
        })
}

export function getTrainers(dispatch, id = null, user){
    let url = id ? `${API}/usertrainers/${id}` : `${API}/trainers`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setUsers(dispatch, data.users, "Trainer"))
            if(id){ 
                dispatch(setAllLoading(false))
                switch(user.type){
                    case "Trainer": 
                      getSessions(dispatch, user.id)
                      break
                    case "Client": 
                      getSessions(dispatch, user.id)
                      break
                    default:
                      getSessions(dispatch)
                      break
                }
            } 
        })
}

// CRUD =================================================
export function addUser(user, userType){
    return {type: "ADD_USER", payload: {user, userType}}
}    

export function updateUser(user, userType){
    return {type: "UPDATE_USER", payload: {user, userType}}
}

export function deleteClientPackage(id){
    return {type: "DELETE_CLIENT_PACKAGE", payload: id}
}


export function deleteUser(user, dispatch){
    user.sessions.forEach(session => dispatch(cancelSession(session.id)))
    //delete client-packages
    if(user.type === "Client"){
        let packages = user.client_packages
        packages.forEach(pack => dispatch(deleteClientPackage(pack.id)))
    }

    return {type: "DELETE_USER", payload: {id: user.id, userType: user.type}}
}

export function addSession(session){
    return {type: "ADD_SESSION", payload: session}
}    

export function updateSession(session){
    return {type: "UPDATE_SESSION", payload: session}
}    

export function cancelSession(session){
    let updated = {...session}
    updated.status = "cancelled"
    return {type: "UPDATE_SESSION", payload: updated}
}    


export function addLevel(level){
    return {type: "ADD_LEVEL", payload: level}
}    

export function updateLevel(level){
    return {type: "UPDATE_LEVEL", payload: level}
}    

export function deleteLevel(id){
    return {type: "UPDATE_LEVEL", payload: id}
}    


export function addPackage(pack){
    return {type: "ADD_PACKAGE", payload: pack}
}    

export function updatePackage(pack){
    return {type: "UPDATE_PACKAGE", payload: pack}
}    

export function deletePackage(id){
    return {type: "DELETE_PACKAGE", payload: id}
}    

export function sellPackage(client_package){
    return {type: "ADD_CLIENT_PACKAGE", payload: client_package}
}    

export function decreaseSessionCount(cp_id){
    return {type: "DECREASE_SESSIONS", payload: cp_id}
}    


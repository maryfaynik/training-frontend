import { API } from '../App'

// SETTERS =======================================

export function setUser(user){
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

export function setLoading(flag){
    return {type: "SET_LOADING", payload: flag}
}

// GETTERS ==================================

export function initialFetch(user) {
    return function(dispatch){
        switch(user.type){
            case "Trainer": //get this trianers clients and sessions, set trainers to this user
              getClients(dispatch, user.id)
              getSessions(dispatch, user.id)
              setUsers(dispatch, [user], "Trainer")
              break
            case "Client": // get this client's session and trainers, set clients to this user
              getTrainers(dispatch, user.id)
              getSessions(dispatch, user.id)
              setUsers(dispatch, [user], "Client")
              break
            default: // Get all of everything...for manager
                console.log("hereerererr")
              getClients(dispatch)
              getSessions(dispatch)
              getTrainers(dispatch)
              break
          }

          // get all the levels
          getLevels(dispatch)
          // get all the packages
          getPackages(dispatch)
          // get all client-packages
          getClientPackages(dispatch)


          
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

export function getSessions(dispatch, id = null){
    let url = id ? `${API}/usersessions/${id}` : `${API}/sessions`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setSessions(data.sessions))
        })
}

export function getClients(dispatch, id = null){
    let url = id ? `${API}/userclients/${id}` : `${API}/clients`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setUsers(dispatch, data.users, "Client"))
            dispatch(setLoading(false))
        })
}

export function getTrainers(dispatch, id = null){
    let url = id ? `${API}/usertrainers/${id}` : `${API}/trainers`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setUsers(dispatch, data.users, "Trainer"))
        })
}

// CRUD =================================================
export function addUser(user, userType){
    return {type: "ADD_USER", payload: {user, userType}}
}    

export function updateUser(user, userType){
    return {type: "UPDATE_USER", payload: {user, userType}}
}
export function deleteUser(id, userType){
    return {type: "DELETE_USER", payload: {id, userType}}
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




import { API } from '../App'

// SETTERS =======================================

export function setUser(user){
        return {type: "SET_USER", payload: user }
    }

export function setUsers(users, userType){
    return {type: "SET_USERS", payload: {users, userType} }
}
    
export function setSessions(sessions){
    return {type: "SET_SESSIONS", payload: sessions }
}

export function setLevels(levels){
    return {type: "SET_LEVELS", payload: levels }
}

export function setPackages(packages){
    return {type: "SET_PACKAGES", payload: packages }
}

export function setActivePage(page){
    console.log('here, page = ', page)
    return {type: "SET_ACTIVEPAGE", payload: page }
}

// GETTERS ==================================

export function initialFetch(user) {
    return function(dispatch){
        switch(user.type){
            case "Trainer": //get this trianers clients and sessions, set trainers to this user
              getClients(dispatch, user.id)
              getSessions(dispatch, user.id)
              setUsers(dispatch,[user], "Trainer")
              break
            case "Client": // get this client's session and trainers, set clients to this user
              getTrainers(dispatch, user.id)
              getSessions(dispatch, user.id)
              setUsers(dispatch, [user], "Client")
              break
            default: // Get all of everything...for manager
              getClients(dispatch)
              getSessions(dispatch)
              getTrainers(dispatch)
              break
          }
          
          // get all the levels
          getLevels(dispatch)
          // get all the packages
          getPackages(dispatch)

    }
}

export function getLevels(dispatch){
    fetch(`${API}/levels`)
    .then(res => res.json())
    .then(data => {
        dispatch(setLevels(data.levels))
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
            console.log("sessions = ", data.sessions)
            dispatch(setSessions(data.sessions))
        })
}

export function getClients(dispatch, id = null){
    let url = id ? `${API}/userclients/${id}` : `${API}/clients`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setUsers(data.users, "Client"))
        })
}

export function getTrainers(dispatch, id = null){
    let url = id ? `${API}/usertrainers/${id}` : `${API}/trainers`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dispatch(setUsers(data.users, "Trainer"))
        })
}

// CUD =================================================
export function addUser(user, userType){
    return {type: "ADD_USER", payload: {user, userType}}
}

export function addSession(session){
    console.log("adding ", session, " in actions")
    return {type: "ADD_SESSION", payload: session}
}

export function updateUser(user, userType){
    return {type: "UPDATE_USER", payload: {user, userType}}
}
export function deleteUser(id, userType){
    return {type: "DELETE_USER", payload: {id, userType}}
}




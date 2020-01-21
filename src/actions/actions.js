import { API } from '../App'

// SETTERS =======================================

export function setUser(user){
    return {type: "SET_USER", payload: user }
}

export function setUsers(users, user_type){
    console.log("in action user_type = ", user_type)
    return {type: "SET_USERS", payload: {users, user_type} }
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

export function setLoading(flag){
    return {type: "SET_LOADING", payload: flag}
}


// GETTERS ==================================

export function initialFetch(user) {
    let type = user.user_type
    return dispatch => {
        switch(type){
            case "Trainer": //get this trianers clients and sessions, set trainers to this user
                return Promise.all([
                    getClients(dispatch, user.id),
                    getSessions(dispatch, user.id),
                    setUsers([user], "Trainer"),
                    dispatch(getLevels(dispatch)),
                    getPackages(dispatch),
                    getClientPackages(dispatch)
                ]);
            case "Client": // get this client's session and trainers, set clients to this user
                return Promise.all([
                    getTrainers(dispatch, user.id),
                    getSessions(dispatch, user.id),
                    setUsers([user], "Client"),
                    getLevels(dispatch),
                    getPackages(dispatch),
                    getClientPackages(dispatch)
                ]);
            default: // Get all of everything...for manager
                console.log('here, manager promise')
                return Promise.all([
                    dispatch(getClients(dispatch)),
                    dispatch(getTrainers(dispatch)),
                    dispatch(getSessions(dispatch)),
                    dispatch(getLevels(dispatch)),
                    dispatch(getPackages(dispatch)),
                    dispatch(getClientPackages(dispatch))
                ]).then( ()=>{
                    console.log("DONE LOADNG!")
                    dispatch(setLoading(false))
                 })

          }
        
    }
    
  }


export function getLevels(dispatch){
    return dispatch => {
        console.log('about to fetch levels')
        return fetch(`${API}/levels`)
        .then(res => res.json())
        .then(data => {
            console.log('fetched and got levels')
            dispatch(setLevels(data.levels))
        })
    }
}

export function getClientPackages(dispatch){
    return dispatch => { 
        console.log('about to fetch client pakcages')
        return fetch(`${API}/client_packages`)
        .then(res => res.json())
        .then(data => {
            console.log('fetched and got client packages')
            dispatch(setClientPackages(data.client_packages))
        })
    }
}

export function getPackages(dispatch){
    return dispatch => {
        console.log('about to fetch packages')
        return fetch(`${API}/packages`)
        .then(res => res.json())
        .then(data => {
            console.log('fetched and got packages')
            dispatch(setPackages(data.packages))
        })
    }
}

export function getSessions(dispatch, id = null){
    return dispatch => {
        console.log('about to fetch sessions')
        let url = id ? `${API}/usersessions/${id}` : `${API}/sessions`
        return fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log('fetched and got sessions')
            dispatch(setSessions(data.sessions))
        })
    }
}


export function getClients(dispatch, id = null){
    return dispatch => {
        console.log('about to fetch clients')
        let url = id ? `${API}/userclients/${id}` : `${API}/clients`
        return fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log('fetched and got clients')
            dispatch(setUsers(data.clients, "Client"))
        })
    }
}

export function getTrainers(dispatch, id = null){
    return dispatch => {
        console.log('about to fetch trainers')
        let url = id ? `${API}/usertrainers/${id}` : `${API}/trainers`
        return fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log('fetched and got trainers')
            dispatch(setUsers(data.trainers, "Trainer"))
        })
        }
}

// CRUD =================================================
export function addUser(user){
    return {type: "ADD_USER", payload: user}
}    

export function updateUser(user){
    console.log("in action, user = ", user)
    return {type: "UPDATE_USER", payload: user}
}

export function deleteClientPackage(id){
    return {type: "DELETE_CLIENT_PACKAGE", payload: id}
}

export function deleteUser(user, dispatch){
    user.sessions.forEach(session => dispatch(cancelSession(session.id)))
    if(user.user_type === "Client"){
        let packages = user.client_packages
        packages.forEach(pack => dispatch(deleteClientPackage(pack.id)))
    }

    return {type: "DELETE_USER", payload: {id: user.id, user_type: user.user_type}}
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


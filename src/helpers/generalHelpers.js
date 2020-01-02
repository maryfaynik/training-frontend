
export const getFullName = (person) => {
    return `${person.first_name} ${person.last_name}`
}

export const getShortName = (person) => {
    return `${person.first_name} ${person.last_name[0].toUpperCase()}.`
}

export const getDayString = (date) =>{
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

export const getUserFromId = (id, all) => {
    return all.find(t => t.id === id)
}


export const getTimeString = (date) =>{
    let hrs = date.getHours() + ""

    if (hrs.length === 1) hrs = "0".concat(hrs)
    let mins = date.getMinutes() + ""
    if (mins.length === 1) mins = mins.concat("0")

    return `${hrs}:${mins}`
}

export const getSessionsSold = (packages) =>{
    if(packages.length < 1 ) return 0
    let sessions = packages.map( pack => pack.session_count)
    return sessions.reduce((sum, count) => sum+count)
}

export const getSessionCount = (backDate, user) =>{
    return user.sessions.filter(session => new Date(backDate) <= new Date(session.daytime)).length
}

export const getTopPerformer = (users, backDate ) => {

    let user = users.reduce( (max, current) => getSessionCount(backDate, max) > getSessionCount(backDate, current) ? max : current)

    return {
        user: user,
        sessions: getSessionCount(backDate, user)
    }
}

export const isNewClient = (client, backDate ) => {
    return client.sessions.find(session => new Date(session.daytime) < new Date(backDate)) === undefined
}

export const capitalize = (string) => {
    return string[0].toUpperCase() + string.slice(1)
} 

export const getTimes = () => {
    let year = new Date()
    year.setFullYear(year.getFullYear() -1)

    let month = new Date()
    month.setMonth(month.getMonth()-1)

    let week = new Date()
    week.setDate(week.getDate() - week.getDay())
    
    return {
        year: year,
        month: month,
        week: week
    }
}

export const overlap = (start1, len1, start2, len2) => {
    start1 = new Date(start1)
 
    let end1 = new Date(start1)
    end1.setMinutes(end1.getMinutes() + len1)
    let end2 = new Date(start2)
    end2.setMinutes(end2.getMinutes() + len2)
    
    return (start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2)
}

export const isAvailable = (user, sessions, daytime, length, thisSession) => {

    let potentialConflicts = sessions.filter(ses => {
        return ((ses.client_id === user.id || ses.trainer_id === user.id) && ses.status !== "cancelled") 
    })
 
    let conflict = potentialConflicts.find(ses => ses.id !== thisSession && overlap(ses.daytime, ses.length, daytime, length) )

    return (conflict === undefined)
}

export const findClientByName = (name, clients) => {

    let first = name.split(" ")[0]
    let last = name.split(" ")[1]
  
    let client = clients.find(client => client.first_name === first && client.last_name === last)
    return client
}

export const getAge = (person) => {
    let today = new Date(Date.now())
    let then = new Date(person.dob)
    let years
    if(today.getMonth() === then.getMonth()){
        years = today.getDay() >= then.getDate() ? 0 : -1

    }else if(today.getMonth() > then.getMonth()){
        years = 0

    }else{
        years = 1

    }

    years += (today.getFullYear() - then.getFullYear())
    return Math.max(0, years)
}


export const getLevelOptions = (levels) => {

    return levels.map(level => {
        return {
            key: level.id,
            value: level.id,
            text: level.name
        }
    })
}

export const getPackageOptions = (packages) => {

    return packages.map(pack => {
        return {
            key: pack.id,
            value: pack.id,
            text: pack.title
        }
    })
}


export const getClientPackageOptions = (client_id, all_cps) => {
    let cps =  all_cps.filter(client_package => client_package.client.id === client_id)

    cps = cps.filter(client_package => client_package.session_count > 0)
    cps = cps.filter(client_package => new Date(client_package.expiration) >= new Date())

    return cps.map(cp => {
        return {
            key: cp.id,
            value: cp.id,
            text: `${cp.package.title} (${cp.session_count} remaining)`
        }
    })
      
}
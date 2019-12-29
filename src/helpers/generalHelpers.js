export const getFullName = (person) => {
    return `${person.first_name} ${person.last_name}`
}

export const getShortName = (person) => {
    return `${person.first_name} ${person.last_name[0].toUpperCase()}.`
}

export const getDayString = (date) =>{
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

export const getTimeString = (date) =>{
    let hrs = date.getHours() + ""

    if (hrs.length === 1) hrs = "0".concat(hrs)
    let mins = date.getMinutes() + ""
    if (mins.length === 1) mins = mins.concat("0")

    return `${hrs}:${mins}`
}

export const overlap = (start1, len1, start2, len2) => {
    start1 = new Date(start1)
    console.log("start1 = ", start1)
    console.log("start2 = ", start2)
    let end1 = new Date(start1)
    end1.setMinutes(end1.getMinutes() + len1)
    let end2 = new Date(start2)
    end2.setMinutes(end2.getMinutes() + len2)
    console.log("end1 = ", end1)
    console.log("end2 = ", end2)

    
    return (start1 >= start2 && start1 < end2 || end1 > start2 && end1 <= end2)
}

export const isAvailable = (user, sessions, daytime, length) => {
    console.log('daytime =', daytime)
    let potentialConflicts = sessions.filter(ses => {
        return ((ses.client_id === user.id || ses.trainer_id === user.id) && ses.status !== "cancelled") 
    })
    console.log("potentials= ",potentialConflicts)
    let conflict = potentialConflicts.find(ses => overlap(ses.daytime, ses.length, daytime, length) )
    console.log("conflict = ", conflict)
    console.log("the user in question is:" , user)
    console.log("going to return ", conflict === undefined)
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
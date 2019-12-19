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

export const findClientByName = (name, clients) => {

    let first = name.split(" ")[0]
    let last = name.split(" ")[1]
  
    let client = clients.find(client => client.first_name === first && client.last_name === last)
    return client
}

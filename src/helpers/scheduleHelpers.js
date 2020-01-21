import {getFullName} from './generalHelpers'
import React from 'react'


export const getResources = (trainers, trainer) =>{
    if(trainer.id){
        return [{
            id: trainer.id,
            title: getFullName(trainer)
        }]
    }else{
        return trainers.map(train => {
            return {
                id: train.id, 
                title: getFullName(train)
            }
        })
    }
}

export const getEvents = (sessions, clients, trainer) =>{
    console.log("sessions = ", sessions)
    console.log("clients = ", clients)
    console.log("trainer = ", trainer)
    if(trainer.id){
        sessions = sessions.filter(session => session.trainer_id === trainer.id)
    }

    let liveSessions = sessions.filter(ses => ses.status !== "cancelled")
    
    return liveSessions.map(session => {
        let end = new Date(session.daytime)
        end.setMinutes(end.getMinutes() + session.length)
        let client = clients.find(client => client.id === session.client_id)
        return {
            id: session.id,
            title: getFullName(client),
            start: new Date(session.daytime),
            end: end,
            resourceId: session.trainer_id
        }
    })
}


export const getTrainerOptions = (allTrainers) => {
    return allTrainers.map(trainer => {
        return {
            key: trainer.id,
            value: trainer.id,
            text: getFullName(trainer)
        }
    })
}

export const getClientOptions = (allClients) => {
    return  allClients.map(client => {
        return {
            key: client.id,
            value: client.id,
            text: getFullName(client)
        }
    })
}

export const customEventPropGetter = event => {
    if (event.unpaid)
      return {
        className: 'unpaid',
        style: {
        border: 'solid 3px #faa'
      },
      }
    else return {}
  }

export function Event({ event }) {
    return (
      <span>
        <strong>{event.title}</strong>
        {event.desc && ':  ' + event.desc}
      </span>
    )
}
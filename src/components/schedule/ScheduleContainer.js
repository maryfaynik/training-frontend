import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import { Dropdown, Icon, Menu, Grid} from 'semantic-ui-react'

import {getTrainerOptions, getClientOptions, getEvents, getResources} from '../../helpers/scheduleHelpers'
import {getDayString, getTimeString, findClientByName} from '../../helpers/generalHelpers'

import SessionForm from './SessionForm'
import Loading from '../navigation/Loading'


const localizer = momentLocalizer(moment)

const defaultSession = {
    date: new Date(Date.now()).toISOString().split("T")[0],
    time: "08:00",
    length: "60",
    trainer_id: undefined,
    client_id: undefined,
    status: "scheduled"
}

// class ScheduleContainer extends Component {
const ScheduleContainer = (props) => {
 
    let [views, setViews] = useState({day: true})
    let [userType, setUserType ] = useState("Manager")
    let [trainer, setTrainer ] = useState({})
    let [client, setClient ] = useState({})
    let [showForm, setShowForm] = useState(false)
    let [editSession, setEditSession ] = useState({...defaultSession})
    let [enterNew, setEnterNew ] = useState(true)
    let [sessions, setSessions ] = useState([])
    let [errors, setErrors ] = useState([])
 
    // update arrays of data in state anytime something changes
    // (i.e. a drop-down, view change, etc.)
    const setData = useEffect(() => {
        const {user} = props
        switch(user.user_type){
            case "Trainer":
                setUserType("Trainer")
                setTrainer(user)
                setViews({day: true, week: true})
                setSessions(props.allSessions.filter(ses => ses.trainer_id === user.id))
                break;
                
            case "Client":
                setUserType("Client")
                setClient(user)
                setViews({day: true, week: true})
               // setTrainers(props.allTrainers.filter(train => train.clients.includes(user.id)))
                setSessions(props.allSessions.filter(ses => ses.client_id === user.id))
                break;
            default:
                break;
        }
    }, [])



    // FORM ACTIONS ----------------------------------
    const toggleForm = (e) => {
        setShowForm(!showForm)
        setErrors([])
    }

    const goBack = () => {
   
        setShowForm(false)
        setEditSession({...defaultSession})
        setErrors([])
        setEnterNew(true)
 
    }

    // Calendar handlers ---------------------------------
    const handleSlotSelect = (e) => {

        let newSession = {
            date: getDayString(e.start),
            time: getTimeString(e.start),
            length: "60",
            trainer_id: e.resourceId,
            status: "new",
            client_id: undefined,
        }
        
        setEditSession({...newSession})
        setShowForm(true)
        setErrors([])
        setEnterNew(true)
    
    }
    
    const handleEventSelect = (e) => {

        let client = findClientByName(e.title, props.allClients)
        let session = props.allSessions.find(s => s.id === e.id)

        let newSession = {
            id: e.id,
            date: getDayString(e.start),
            time: getTimeString(e.start),
            length: "60",
            trainer_id: e.resourceId,
            status: session.status,
            client_id: client.id
        }
      
        setEditSession({...newSession})
        setShowForm(true)
        setErrors([])
        setEnterNew(false)
    }
  
    const handleTrainerSelect = (e, {value}) => {
  
        let train = {}
        let views = { day: true}

        if(value !== "all"){
            train = props.allTrainers.find(trainer => trainer.id === value)
            views = { day: true, week: true}
        }
       
        setTrainer(train)
        setViews(views)
    }

    // RENDERS ---------------------------------
    const { allTrainers, allClients, allSessions} = props

    return (
        <div className="sched-container">
            {showForm ? <SessionForm editSession={editSession} trainerOptions={getTrainerOptions(allTrainers)} clientOptions={getClientOptions(allClients)} goBack={goBack} toggleForm={toggleForm} isNew={enterNew}/> 
            : null}
            <Menu id="schedule-menu" secondary>
                <Menu.Item size="small" onClick={toggleForm}><Icon name = "plus"/> Add Session</Menu.Item>
                { userType === "Manager" ? 
                    <Menu.Menu position="right">
                    <Menu.Item>
                        <Dropdown
                            text="Filter By Trainer"
                            icon="filter"
                            selection
                            onChange={handleTrainerSelect}
                            options={props.loading? [] : [ {key: "all", text: "Show All", value: "all"}, ...getTrainerOptions(allTrainers)]}/>
                    </Menu.Item>
                    </Menu.Menu>
                : null }
            </Menu> 
            {props.loading ? 
            <Grid><Grid.Row><Grid.Column><Loading/></Grid.Column></Grid.Row></Grid>
            : 
            <Calendar className="calendar"
                localizer= {localizer}
                views ={views}
                // popup= {true}
                selectable
                onSelectEvent = {handleEventSelect}
                onSelectSlot = {handleSlotSelect}
                defaultView= {Views.DAY}
                step= {15}
                scrollToTime= {new Date(moment())}
                min= {new Date(2017, 1, 1, 5, 0, 0)}
                max= {new Date(2050, 1, 1, 22, 0, 0)}
                events= {getEvents(allSessions, allClients, trainer)}
                resources= {getResources(allTrainers, trainer)}
                startAccessor="start"
                endAccessor="end"
            />
            }

        </div>
    )
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        allSessions: state.schedule.allSessions,
        allClients: state.user.allClients,
        allTrainers: state.user.allTrainers,
        loading: state.app.loading
    }
}
export default connect(msp)(withRouter(ScheduleContainer));



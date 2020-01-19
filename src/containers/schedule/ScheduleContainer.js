import React, { Component} from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import { Dropdown, Icon, Menu, Grid} from 'semantic-ui-react'

import {getTrainerOptions, getClientOptions, getEvents, getResources} from '../../helpers/scheduleHelpers'
import {getDayString, getTimeString, findClientByName} from '../../helpers/generalHelpers'

import SessionForm from './SessionForm';
import Loading from '../../components/Loading'

const localizer = momentLocalizer(moment)
const defaultSession = {
    date: new Date(Date.now()).toISOString().split("T")[0],
    time: "08:00",
    length: "60",
    trainer_id: undefined,
    client_id: undefined,
    status: "scheduled"
}

class ScheduleContainer extends Component {

    state = {
        views: { day: true},
        userType: "Manager",
        trainer: {},
        client: {},
        showForm: false,
        editSession: {...defaultSession},
        enterNew: true
    }
  


    // update arrays of data in state anytime something changes
    // (i.e. a drop-down, view change, etc.)
    setData = () => {
        const {user} = this.props
        switch(user.type){
            case "Trainer":
                this.setState({
                    userType: "Trainer",
                    trainer: user,
                    views: {day: true, week: true},
                    sessions: this.props.allSessions.filter(ses => ses.trainer_id === user.id)
                })
                break;
            case "Client":
                this.setState({
                    userType: "Client",
                    views: {day: true, week: true},
                    client: user,
                    trainers: this.props.allTrainers.filter(train => train.clients.includes(user.id)),
                    sessions: this.props.allSessions.filter(ses => ses.trainer_id === user.id)
                })
                break;
            default:
                break;
        }
    }

    componentDidMount(){
        this.setData()
    }


    // FORM ACTIONS ----------------------------------
    toggleForm = (e) => {
        this.setState({
            showForm: !this.state.showForm,
            errors: []
        })
    }

    goBack = () => {
        this.setState({
            showForm: false,
            editSession: {...defaultSession},
            errors: [],
            enterNew: true
        })
    }

    // Calendar handlers ---------------------------------
    handleSlotSelect = (e) => {

        let newSession = {
            date: getDayString(e.start),
            time: getTimeString(e.start),
            length: "60",
            trainer_id: e.resourceId,
            status: "new",
            client_id: undefined,
        }
        
        this.setState({
            editSession: {...newSession},
            showForm: true,
            errors: [],
            enterNew: true
        })
        

    }
    
    handleEventSelect = (e) => {

        let client = findClientByName(e.title, this.props.allClients)
        let session = this.props.allSessions.find(s => s.id === e.id)

        let newSession = {
            id: e.id,
            date: getDayString(e.start),
            time: getTimeString(e.start),
            length: "60",
            trainer_id: e.resourceId,
            status: session.status,
            client_id: client.id
        }
      
        this.setState({
            enterNew: false,
            editSession: newSession,
            showForm: true,
            errors: []
        })
    }
  
    handleTrainerSelect = (e, {value}) => {
  
        let train = {}
        let trains = this.props.allTrainers
        let views = { day: true}
        if(value !== "all"){
            train = this.props.allTrainers.find(trainer => trainer.id === value)
            trains = this.props.allTrainers.filter(t => t.id === train.id)
            views = { day: true, week: true}
        }
        this.setState({
            trainer: train,
            trainers: trains,
            views: views
        })
    }

    // RENDERS ---------------------------------
    render(){
    
        const { allTrainers, allClients, allSessions} = this.props
        const {trainer, views } = this.state

       
        return (
            <div className="sched-container">
                {this.state.showForm ? <SessionForm editSession={this.state.editSession} trainerOptions={getTrainerOptions(allTrainers)} clientOptions={getClientOptions(allClients)} goBack={this.goBack} toggleForm={this.toggleForm} isNew={this.state.enterNew}/> 
                : null}
                <Menu id="schedule-menu" secondary>
                    <Menu.Item size="small" onClick={this.toggleForm}><Icon name = "plus"/> Add Session</Menu.Item>
                    { this.state.userType === "Manager" ? 
                        <Menu.Menu position="right">
                        <Menu.Item>
                            <Dropdown
                                text="Filter By Trainer"
                                icon="filter"
                                selection
                                onChange={this.handleTrainerSelect}
                                options={this.props.loading? [] : [ {key: "all", text: "Show All", value: "all"}, ...getTrainerOptions(allTrainers)]}/>
                        </Menu.Item>
                        </Menu.Menu>
                    : null }
                </Menu> 
                {this.props.loading ? 
                <Grid><Grid.Row><Grid.Column><Loading/></Grid.Column></Grid.Row></Grid>
                : 
                <Calendar className="calendar"
                    localizer= {localizer}
                    views ={views}
                    // popup= {true}
                    selectable
                    onSelectEvent = {this.handleEventSelect}
                    onSelectSlot = {this.handleSlotSelect}
                    defaultView= {Views.DAY}
                    step= {15}
                    scrollToTime= {new Date(moment())}
                    min= {new Date(2017, 1, 1, 5, 0, 0)}
                    max= {new Date(2050, 1, 1, 22, 0, 0)}
                    events= {getEvents(allSessions, allClients, trainer)}
                    resources= {getResources(allTrainers, trainer)}
                    startAccessor="start"
                    endAccessor="end"
                    // eventPropGetter= {customEventPropGetter}
                    // components ={{
                    //     event: Event
                    // }}
                />
                }

            </div>
        )
        
    }
    
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



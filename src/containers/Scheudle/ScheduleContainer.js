import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import { Dropdown, Icon, Button, Menu } from 'semantic-ui-react'

import {getTrainerOptions, getClientOptions, getEvents, getResources} from '../../helpers/scheduleHelpers'
import {getDayString, getTimeString, findClientByName} from '../../helpers/generalHelpers'

import AddSessionForm from './AddSessionForm';

const localizer = momentLocalizer(moment)
const defaultSession = {
    date: new Date(Date.now()).toISOString().split("T")[0],
    time: "08:00",
    length: "60",
    trainer_id: undefined,
    client_id: undefined,
}

class ScheduleContainer extends Component {

    state = {
        views: { day: true},
        userType: "Manager",
        trainer: {},
        client: {},
        addForm: false,
        editSession: {...defaultSession},
        enterNew: true
    }

    // update arrays of data in state anytime something changes
    // (i.e. a drop-down, view change, etc.)
    setData = () => {
        console.log("here")
        const {user} = this.props
        switch(user.type){
            case "Trainer":
                this.setState({
                    userType: "Trainer",
                    trainer: user,
                    sessions: this.props.allSessions.filter(ses => ses.trainer_id === user.id)
                })
                break;
            case "Client":
                this.setState({
                    userType: "Client",
                    client: user,
                    trainers: this.props.allTrainers.filter(train => train.clients.includes(user.id)),
                    sessions: this.props.allSessions.filter(ses => ses.trainer_id === user.id)
                })
                break;
            default:
                break;
        }
    }

    // call anytime the component re-renders
    // componentDidUpdate(){
    //     this.setData()
    // }
    componentDidMount(){
        this.setData()
    }

    toggleAddForm = (e) => {
        this.setState({
            addForm: !this.state.addForm,
            errors: []
        })
    }

    goBack = () => {
        this.setState({
            addForm: false,
            editSession: {...defaultSession},
            errors: []
        })
    }

    handleSlotSelect = (e) => {
 
        let newSession = {
            date: getDayString(e.start),
            time: getTimeString(e.start),
            length: "60",
            trainer_id: e.resourceId,
            client_id: undefined,
        }
       
        this.setState({
            editSession: {...newSession},
            addForm: !this.state.addForm,
            errors: []
        })
        

    }
    
    handleEventSelect = (e) => {
        console.dir(e)
        let client = findClientByName(e.title, this.props.allClients)

        let newSession = {
            date: getDayString(e.start),
            time: getTimeString(e.start),
            length: "60",
            trainer_id: e.resourceId,
            client_id: client.id
        }
      
        this.setState({
            enterNew: false,
            editSession: newSession,
            addForm: !this.state.addForm,
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

    render(){
        const {user, allTrainers, allClients, allSessions} = this.props
        const {trainer, views } = this.state

        if(!user.id){
            this.props.history.push('/login')
            return null
        }else{
            return (
                <div className="sched-container">
                    {this.state.addForm ? <AddSessionForm editSession={this.state.editSession} trainerOptions={getTrainerOptions(allTrainers)} clientOptions={getClientOptions(allClients)} goBack={this.goBack} toggleAddForm={this.toggleAddForm} new={this.state.enterNew}/> 
                    : <Button onClick={this.toggleAddForm}><Icon name = "plus"/> Add Session</Button>}
                    
                    { this.state.userType === "Manager" ? 
                        <Menu secondary>
                            <Menu.Item
                            name='Filter By Trainer'
                            active={false}
                            />
                            <Menu.Item>
                            <Dropdown
                                placeholder = "Select a Trainer"
                                selection
                                onChange={this.handleTrainerSelect}
                                options={[ {key: "all", text: "Show All", value: "all"}, ...getTrainerOptions(allTrainers)]}/>
                            </Menu.Item>

                        </Menu>
                    : null }

                    <Calendar className="calendar"
                        localizer= {localizer}
                        views ={views}
                        // popup= {true}
                        selectable
                        onSelectEvent = {this.handleEventSelect}
                        onSelectSlot = {this.handleSlotSelect}
                        defaultView={Views.DAY}
                        step={15}
                        min={new Date(2017, 1, 1, 5, 0, 0)}
                        max={new Date(2050, 1, 1, 22, 0, 0)}
                        events= {getEvents(allSessions, allClients, trainer)}
                        resources= {getResources(allTrainers, trainer)}
                        startAccessor="start"
                        endAccessor="end"
                        // eventPropGetter= {customEventPropGetter}
                        // components ={{
                        //     event: Event
                        // }}
                    />
                    
                </div>
            )
        }
    }
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        allSessions: state.schedule.allSessions,
        allClients: state.user.allClients,
        allTrainers: state.user.allTrainers
    }
}
export default connect(msp)(withRouter(ScheduleContainer));



import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Radio, Search} from 'semantic-ui-react';
import _ from 'lodash'

import ClientSearch from './ClientSearch'
import { isAvailable } from "../../helpers/generalHelpers"
import {addSession, updateSession, cancelSession} from '../../actions/actions'
import {API} from '../../App'

class SessionForm extends Component {

    state = {
        id: this.props.editSession.id,
        date: this.props.editSession.date,
        time: this.props.editSession.time,
        length: this.props.editSession.length,
        trainer_id: this.props.editSession.trainer_id,
        client_id: this.props.editSession.client_id,
        errors: []
    }


    handleChange = (e, {value, name}) => {
        if(e.target.value){
            value = e.target.value
            name = e.target.name
        }

        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) =>{

        e.preventDefault()
    
        const {isNew} = this.props
        let date = this.state.date.split("-")
        let time = this.state.time.split(":")
        let dayAndTime = new Date(date[0], date[1] - 1, date[2], time[0], time[1])
        
        let newSession = {
            session: {
                daytime: dayAndTime,
                trainer_id: this.state.trainer_id,
                client_id: this.state.client_id,
                status: "scheduled",
                length: parseInt(this.state.length)
            }
        }
        
        if(!this.state.client_id || !this.state.trainer_id){
            this.setState({
                errors: [...this.state.errors, "Must select client and trainer!"]
            })
        }else{
            
            let client = this.props.allClients.find(client => client.id === this.state.client_id)
            let trainer = this.props.allTrainers.find(trainer => trainer.id === this.state.trainer_id)
           
            if(!isAvailable(client, this.props.allSessions, newSession.session.daytime, newSession.session.length)){
                this.setState({
                    errors: ["The client already has a session at this time. Try another time"]
                })
            }else if(!isAvailable(trainer, this.props.allSessions, newSession.session.daytime, newSession.session.length)){
                this.setState({
                    errors: ["The trainer has another session at this time. Try another time or trainer"]
                })

            }else{
                console.log("it's good!")

                let url = isNew ? "" : `/${this.state.id}`
                let method = isNew ? "POST" : "PATCH"
                
                fetch(`${API}/sessions${url}`, {
                    method: method,
                    headers: {
                        "content-type": "application/json",
                        "accepts": "application/json"
                    },
                    body: JSON.stringify(newSession)
    
                }).then (resp => resp.json())
                    .then(data => {
        
                        if(data.errors){
                            this.setState({
                                errors: data.errors,
                            })
                        }else{
                            if(isNew){
                                console.log("adding session:", data.session)
                                this.props.addSession(data.session)
                            }else{
                                console.log("calling update session...", data.session)
                                this.props.updateSession(data.session)
                            }
                            this.props.toggleForm()
                        }
                    })
            } 
        }       
    }

    handleCancel = (e) =>{
        let obj = {
            status: "cancelled"
        }
  
        console.log("clicked cancel")
        console.log(this.state)
        console.log("props = ", this.props)

        fetch(`${API}/sessions/${this.state.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(obj)

        })
        .then (resp => resp.json())
        .then(data => {
            console.log("on cancel, got back: ", data)
            if(data.errors){
                this.setState({
                    errors: data.errors,
                })
            }else{
                this.props.toggleForm()
                this.props.updateSession(data.session)
            }
        })

    }

    renderErrors = () => {
        return this.state.errors.map((error, i) => <li key={i}>{error}</li>)
    }

    render(){

        return (
            <div className= 'outer-popup'>
            <div className="inner-popup">
                <Form className='session-form' id="session-form" value={this.state.id} onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input onChange={this.handleChange} value={this.state.date} name="date" label='Day' type="date"/>
                        <Form.Input onChange={this.handleChange} value={this.state.time} name="time" label='Time' type="time"/>
                    </Form.Group>
                    <Form.Group> 
                        <Form.Field>
                            <Radio
                                label='30 min'
                                name='length'
                                value="30"
                                checked={this.state.length === '30'}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='60 min'
                                name='length'
                                value="60"
                                checked={this.state.length === '60'}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='90 min'
                                name='length'
                                value="90"
                                checked={this.state.length === '90'}
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form.Group> 
                    <Form.Group>
                        <Form.Select
                            onChange={this.handleChange}
                            value={this.state.trainer_id}
                            name="trainer_id"
                            label='Trainer'
                            options={this.props.trainerOptions}
                            placeholder='Select Trainer'
                        />
                        <ClientSearch clients={this.props.allClients} setClient={(id) => this.setState({client_id: id})}/>
                    </Form.Group>
                </Form>
                <p>
                    <Button primary type="submit" form={"session-form"}>{this.props.isNew ? "Book Session" : "Save Changes"}</Button>
                    { this.props.isNew ? null : <Button onClick={this.handleCancel}>Cancel Session</Button>}
                    <Button onClick={this.props.goBack}>Go Back</Button>
                </p>

                {this.state.errors.length > 0 ? <ul>{this.renderErrors()}</ul> : null}
            </div>
            </div>
        )
    }
}

const msp = (state) => {
    return {
        allClients: state.user.allClients,
        allSessions: state.schedule.allSessions,
        allTrainers: state.user.allTrainers
    }
}

export default connect(msp, { addSession, updateSession, cancelSession })(withRouter(SessionForm))




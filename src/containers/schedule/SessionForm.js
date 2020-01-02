import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Radio, Segment, Label, Header} from 'semantic-ui-react';

import ClientSearch from '../../helpers/ClientSearch'
import { isAvailable, getClientPackageOptions, getFullName, capitalize} from "../../helpers/generalHelpers"
import {addSession, updateSession, cancelSession, decreaseSessionCount} from '../../actions/actions'
import {API} from '../../App'
import BuySellPackageForm from '../packages/BuySellPackageForm';

class SessionForm extends Component {

    state = {
        id: this.props.editSession.id,
        date: this.props.editSession.date,
        time: this.props.editSession.time,
        length: this.props.editSession.length,
        trainer_id: this.props.editSession.trainer_id,
        client_id: this.props.editSession.client_id,
        client_package_id: this.props.editSession.client_package_id,
        status: this.props.editSession.status,
        showPackForm: false,
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
                client_package_id: this.state.client_package_id,
                status: "scheduled",
                length: parseInt(this.state.length)
            }
        }
        
        if(!this.state.client_id || !this.state.trainer_id){
            this.setState({
                errors: ["Must select client and trainer!"]
            })
        }else if (!this.state.client_package_id){
            this.setState({
                errors: ["Must select package to deduct"]
            })
        } else{
            
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

                            // Add / Update the session in redux
                            if(isNew){
                                this.props.addSession(data.session)
                            }else{
                                this.props.updateSession(data.session)
                            }

                            // Update the number of sessions left on client's package
                            let cp = this.props.clientPackages.find(cp => cp.id === this.state.client_package_id)
                            let obj = {
                                session_count: cp.session_count - 1
                            }
                            
                            fetch(`${API}/client_packages/${this.state.client_package_id}`, {
                                method: "PATCH",
                                headers: {
                                    "content-type": "application/json",
                                    "accepts": "application/json"
                                },
                                body: JSON.stringify(obj)
                
                            }).then (resp => resp.json())
                                .then(data => {
                                    if(data.errors){
                                        this.setState({
                                            errors: data.errors,
                                        })
                                    }else{
                                        this.props.toggleForm()
                                        this.props.decreaseSessionCount(this.state.client_package_id)
                                    }
                                })
                        }
                    })
            } 
        }       
    }

    handleStatus = (e, status) =>{

        if(status === "cancelled"){
            //eslint-disable-next-line
            if(window.confirm("Are you sure you want to cancel this session?") === false) return 
        }
        
        let obj = {
            status: status
        }

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

    toggleForm = (e) => {
        if(e) e.preventDefault()
        this.setState({
            showPackForm: !this.state.showPackForm
        })
    }

    renderPackageForm = () => {
        return (<BuySellPackageForm 
            selling={true} 
            package={{}} 
            packages={this.props.packages} 
            toggleForm={this.toggleForm} 
            goBack={this.toggleForm} 
            client={this.props.allClients.find(client => client.id === this.state.client_id)} 
            allClients={this.props.allClients}
            />)
    }

    renderPackageChoices = () => {
        let packOptions = getClientPackageOptions(this.state.client_id, this.props.clientPackages)
        if(packOptions.length < 1 && this.props.isNew){
            return <Fragment>
                    <Button size="mini" secondary onClick={this.toggleForm}>Buy Sessions</Button>
                </Fragment>
        }
        return (<Form.Select
                    onChange={this.handleChange}
                    value={this.state.client_package_id}
                    name="client_package_id"
                    options={packOptions}
                    placeholder='Select Package'
                />)
    }

    render(){
        console.log("session form state = ", this.state)
        let {isNew} = this.props
        return (
            this.state.showPackForm ? this.renderPackageForm()
            :
            <div className= 'outer-popup'>
                <div className="inner-popup">
                    <Header as="h1"> {isNew ? "Create" : "Edit"} Session</Header>
                    <Form className='session-form' id="session-form" value={this.state.id} onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Segment className="client-trainer-select" >
                                <b>Status: { isNew? <span className="new-session">New</span> : <span className={`${this.state.status}-session`}>{capitalize(this.state.status)}</span>}</b>
                            </Segment>
                        </Form.Group>
                        <Form.Group widths="equal">
                            {isNew ? 
                                <Segment className="client-trainer-select" >
                                    <Label attached="top">Trainer</Label>
                                    <Form.Select
                                        onChange={this.handleChange}
                                        value={this.state.trainer_id}
                                        name="trainer_id"
                                        options={this.props.trainerOptions}
                                        placeholder='Select Trainer'
                                    />
                                </Segment>
                            :
                                <Segment className="client-trainer-select" >
                                    <b>Trainer: </b>{getFullName(this.props.allTrainers.find(t => t.id === this.state.trainer_id))}
                                </Segment>
                            }
                        </Form.Group>
                        <Form.Group>
                            { isNew ? 
                                 <Segment className="client-trainer-select" >
                                    <Label attached="top">Client</Label>
                                    <ClientSearch client_id={this.state.client_id} clients={this.props.allClients} setClient={(id) => this.setState({client_id: id})}/>
                                    {this.state.client_id !== undefined ? 
                                     this.renderPackageChoices()
                                    : null}
                                </Segment>
                            :
                                <Segment className="client-trainer-select">
                                    <b>Client: </b>{getFullName(this.props.allClients.find(c => c.id === this.state.client_id))}
                                </Segment>
                            }
                            
                        </Form.Group> 
                        
                        <Form.Group inline>
                            <Label horizontal>Date</Label>
                            <Form.Input onChange={this.handleChange} value={this.state.date} name="date" type="date"/>
                
                            <Label>Time</Label>
                            <Form.Input onChange={this.handleChange} value={this.state.time} name="time" type="time"/>
                        </Form.Group>
                        <Form.Group > 
                            <Label>Length</Label>
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
                    </Form>
                    <p>
                        { this.props.isNew ? null : <Button onClick={(e) => this.handleStatus(e, "cancelled")}>Cancel Session</Button>}
                        { this.props.isNew ? null : <Button onClick={(e) => this.handleStatus(e, "no-show")}>Mark No-Show</Button>}
                        { this.props.isNew ? null : <Button onClick={(e) => this.handleStatus(e, "complete")}>Mark Completed</Button>}
                    </p>
                    <p>    
                        <Button primary type="submit" form={"session-form"}>{this.props.isNew ? "Book Session" : "Save Changes"}</Button>
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
        allTrainers: state.user.allTrainers,
        clientPackages: state.app.clientPackages,
        packages: state.app.packages
    }
}

export default connect(msp, { addSession, updateSession, cancelSession, decreaseSessionCount })(withRouter(SessionForm))




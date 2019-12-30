import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Radio, Segment, Label} from 'semantic-ui-react';

import ClientSearch from './ClientSearch'
import { isAvailable, getClientPackageOptions } from "../../helpers/generalHelpers"
import {addSession, updateSession, cancelSession, decreaseSessionCount} from '../../actions/actions'
import {API} from '../../App'
import BuySellPackageForm from '../Packages/BuySellPackageForm';

class SessionForm extends Component {

    state = {
        id: this.props.editSession.id,
        date: this.props.editSession.date,
        time: this.props.editSession.time,
        length: this.props.editSession.length,
        trainer_id: this.props.editSession.trainer_id,
        client_id: this.props.editSession.client_id,
        client_package_id: null,
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
                                sessions: cp.sessions - 1
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

    handleCancel = (e) =>{

        //eslint-disable-next-line
        if(window.confirm("Are you sure you want to cancel this session?") === false) return 
        
        let obj = {
            status: "cancelled"
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
        if(packOptions.length < 1){
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
        return (
            this.state.showPackForm ? this.renderPackageForm()
            :
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
                            <Segment>
                                <Label attached="top">Trainer</Label>
                                <Form.Select
                                    onChange={this.handleChange}
                                    value={this.state.trainer_id}
                                    name="trainer_id"
                                    options={this.props.trainerOptions}
                                    placeholder='Select Trainer'
                                />
                            </Segment>
                        </Form.Group>
                        <Form.Group>
                            <Segment>
                                <Label attached="top">Client</Label>
                                <ClientSearch client_id={this.state.client_id} clients={this.props.allClients} setClient={(id) => this.setState({client_id: id})}/>
                                {this.state.client_id !== undefined ? 
                                    this.renderPackageChoices()
                                : null}
                            </Segment>
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
        allTrainers: state.user.allTrainers,
        clientPackages: state.app.clientPackages,
        packages: state.app.packages
    }
}

export default connect(msp, { addSession, updateSession, cancelSession, decreaseSessionCount })(withRouter(SessionForm))




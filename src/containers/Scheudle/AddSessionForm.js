import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Radio} from 'semantic-ui-react';

import {addSession} from '../../actions/actions'
import {API} from '../../App'

class AddSessionForm extends Component {

    state = {
        // date: new Date(Date.now()).toISOString().split("T")[0],
        // time: "08:00",
        // length: "60",
        // trainer_id: undefined,
        // client_id: undefined,
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
        console.log("setting state: ", "[", name, "]: ", value)
        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault()

        let date = this.state.date.split("-")
        let time = this.state.time.split(":")
        let dayAndTime = new Date(date[0], date[1] - 1, date[2], time[0], time[1])
        
        let newSession = {
            daytime: dayAndTime,
            trainer_id: this.state.trainer_id,
            client_id: this.state.client_id,
            level_id: 1,
            location_id: 1,
            length: parseInt(this.state.length)
        }

        if(!this.state.client_id || !this.state.trainer_id){
            this.setState({
                errors: [...this.state.errors, "Must select client and trainer!"]
            })
        }else{
            console.log("submitting: ", newSession)
            
            fetch(`${API}/sessions`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accepts": "application/json"
                },
                body: JSON.stringify(newSession)

            }).then (resp => resp.json())
                .then(data => {
                    console.log("got back: ",data)
                    if(data.errors){
                        this.setState({
                            errors: data.errors,
                        })
                    }else{
                        this.props.toggleAddForm()
                        this.props.addSession(data.session)
                    }
                })
        }
    }


    handleSubmitNew = (e) =>{
        e.preventDefault()

        let date = this.state.date.split("-")
        let time = this.state.time.split(":")
        let dayAndTime = new Date(date[0], date[1] - 1, date[2], time[0], time[1])
        
        let newSession = {
            daytime: dayAndTime,
            trainer_id: this.state.trainer_id,
            client_id: this.state.client_id,
            level_id: 1,
            location_id: 1,
            length: parseInt(this.state.length)
        }

        if(!this.state.client_id || !this.state.trainer_id){
            this.setState({
                errors: [...this.state.errors, "Must select client and trainer!"]
            })
        }else{
            console.log("submitting: ", newSession)
            
            fetch(`${API}/sessions`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accepts": "application/json"
                },
                body: JSON.stringify(newSession)

            }).then (resp => resp.json())
                .then(data => {
                    console.log("got back: ",data)
                    if(data.errors){
                        this.setState({
                            errors: data.errors,
                        })
                    }else{
                        this.props.toggleAddForm()
                        this.props.addSession(data.session)
                    }
                })
        }
    }

    renderErrors = () => {
        return this.state.errors.map(error => <li>{error}</li>)
    }

    render(){
        console.log("state = ", this.state)
        console.log("props = ", this.props)
        return (
            <div className= 'outer-popup'>
            <div className="inner-popup">
                <Form className='add-session-form' onSubmit={this.props.new ? this.handleSubmitNew : this.handleSubmitEdit}>
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
                        <Form.Select
                            onChange={this.handleChange}
                            value={this.state.client_id}
                            name="client_id"
                            label='Client'
                            options={this.props.clientOptions}
                            placeholder='Select Client'
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Button>{this.props.new ? "Book Session" : "Save Changes"}</Form.Button>
                        <Button onClick={this.props.goBack}>Go Back</Button>  
                    </Form.Group>
                    {this.state.errors.length > 0 ? <ul>{this.renderErrors()}</ul> : null}
                </Form>
            </div>
            </div>
        )
    }
}


export default connect(undefined, { addSession })(withRouter(AddSessionForm))




import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button} from 'semantic-ui-react';

import {addUser} from '../../actions/actions'
import {API} from '../../App'



class AddTrainerForm extends Component {

    state = {
        first_name: "",
        last_name: "",
        dob: "",
        email: "",
        phone: "",
        level: "",
        errors: []
    }

    handleChange = (e, {value}) => {
        let key = "level"
        if(e.target.name){
            key = e.target.name
        }
        this.setState({
            [key]: value
        })
    }


    handleSubmit = (e) =>{
        e.preventDefault()

        let newTrainer = {
            user: {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                dob: this.state.dob,
                email: this.state.email,
                phone: this.state.phone,
                level_id: this.state.level
            },
            type: "Trainer"
        }
        console.log("submitting: ", newTrainer)

        fetch(`${API}/trainers`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(newTrainer)
        }).then (resp => resp.json())
            .then(data => {
                console.log("got back: ",data)
                if(data.errors){
                    this.setState({
                        errors: data.errors,
                    });
                }else{
                    this.props.toggleForm()
                    this.props.addUser(data.user, "Trainer")
                }
            })
    }
   
    renderErrors = () => {
        return this.state.errors.map(error => <li>{error}</li>)
    }

    
    render(){
        return (
            <div className="add-trainer-form">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input onChange={this.handleChange} name="first_name" label='First Name' placeholder='First name' />
                        <Form.Input onChange={this.handleChange} name="last_name" label='Last Name' placeholder='Last name' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Select
                            onChange={this.handleChange}
                            label='Choose Level'
                            name= "level"
                            options={this.props.levelOptions}
                            placeholder='Select Level'
                        />
                        <Form.Input onChange={this.handleChange} type="date" name="dob" label='Date of Birth' placeholder='DOB' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} type="email" name="email" label='Email' placeholder='Email' />
                        <Form.Input onChange={this.handleChange} type="phone" name="phone" label='Phone' placeholder='Phone' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Button>Submit</Form.Button>
                        <Button onClick={this.props.goBack}>Go Back</Button>
                    </Form.Group>
                    {this.state.errors.length > 0 ? <ul>{this.renderErrors()}</ul> : null}
                </Form>
            </div>
        )
    }
    
}


export default connect(undefined, {addUser})(withRouter(AddTrainerForm))



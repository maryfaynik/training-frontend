import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {API} from '../../App'

// import CreditCardInput from 'react-credit-card-input';

import {addUser} from '../../actions/actions'

import { Form, Button} from 'semantic-ui-react';


class AddClientForm extends Component {

    state = {
        first_name: "",
        last_name: "",
        dob: "",
        email: "",
        phone: "",
        payment: "",
        errors: []
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    handleSubmit = (e) =>{
        e.preventDefault()

        let newClient = {
            user: {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                dob: this.state.dob,
                email: this.state.email,
                phone: this.state.phone,
                payment: this.state.payment
            },
            type: "Client"
        }

        fetch(`${API}/clients`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(newClient)
        }).then (resp => resp.json())
            .then(data => {
     
                if(data.errors){
                    this.setState({
                        errors: data.errors,
                    });
                }else{
                    this.props.toggleForm()
                    this.props.addUser(data.user, "Client")
                }
            })
    }
   
    renderErrors = () => {
        return this.state.errors.map((error, i) => <li key={i}>{error}</li>)
    }

    
    render(){
        return (
            <div className="add-client-form">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input onChange={this.handleChange} name="first_name" label='First Name' placeholder='First name' />
                        <Form.Input onChange={this.handleChange} name="last_name" label='Last Name' placeholder='Last name' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} type="date" name="dob" label='Date of Birth' placeholder='DOB' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} type="email" name="email" label='Email' placeholder='Email' />
                        <Form.Input onChange={this.handleChange} type="phone" name="phone" label='Phone' placeholder='Phone' />
                    </Form.Group>
                    {/* <Form.Group>
                        <CreditCardInput
                            cardNumberInputProps={{ name: "number", value: this.state.payment.number, onChange: this.handleChange }}
                            cardExpiryInputProps={{ name: "expiry", value:this.state.payment.expiry, onChange: this.handleChange }}
                            cardCVCInputProps={{ name: "cvc", value: this.state.payment.cvc, onChange: this.handleChange }}
                            fieldClassName="input"
                        />
                    </Form.Group> */}
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


export default connect(undefined, {addUser})(withRouter(AddClientForm))



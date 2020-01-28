import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Header, Modal} from 'semantic-ui-react';

import {addUser, updateUser} from '../../actions/actions'
import {API} from '../../App'

class UserModal extends Component {

    state = {
        id: this.props.id,
        first_name: this.props.editUser.first_name,
        last_name: this.props.editUser.last_name,
        gender: this.props.editUser.gender,
        dob: this.props.editUser.dob,
        email: this.props.editUser.email,
        phone: this.props.editUser.phone,
        level: this.props.userType === "Trainer" ? this.props.editUser.level.id : "",
        errors: []
    }

    handleChange = (e, {value, name}) => {
        console.log("change")
        if(e.target.name){
            name = e.target.name
        }
        this.setState({
            [name]: value
        })
    }


    handleSubmit = (e) =>{
        e.preventDefault()
        console.log("here")
        let isNew = this.props.action === "new"

        let newUser = {
            user: {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                dob: this.state.dob,
                email: this.state.email,
                phone: this.state.phone,
                gender: this.state.gender
            },
            type: this.props.userType
        }

        if(this.props.userType === "Trainer") newUser.user.level_id = this.state.level
        if(isNew) newUser.password = "password"

        let base_url = this.props.userType === "Trainer" ? "trainers" : "clients"
        let end_url = isNew ? "" : `/${this.state.id}`
        let method = isNew ? "POST" : "PATCH"

        fetch(`${API}/${base_url}${end_url}`, {
            method: method,
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(newUser)

        }).then (resp => resp.json())
            .then(data => {

                if(data.errors){
                    console.log("errors")
                    this.setState({
                        errors: data.errors,
                    })
                }else{
                    console.log("here after post")
                    if(isNew){
                        this.props.addUser(data.user, this.props.userType)
                    }else{
                        this.props.updateUser(data.user, this.props.userType)
                    }
                    this.props.toggleModal()
                }
            })
    }
   
    renderErrors = () => {
        return this.state.errors.map((error, i) => <li key={i}>{error}</li>)
    }

    
    render(){
        let {userType, action} = this.props
        let headerAction = action === 'new' ? "Add" : "Edit"
        console.log("state in modal =", this.state)
        console.log("props in modal = ", this.props)
        return (
            <Modal
                trigger={<Button value={this.props.id} onClick={this.props.toggleModal}>{`${headerAction}`}</Button>}
                open={this.props.modalOpen}
                onClose={this.props.toggleModal}
                basic
                size='small'
            >
                <Header icon='browser' content={`${headerAction} ${userType}`} />
                <Modal.Content>
                    <Form className="user-form" id="user-form" onSubmit={this.handleSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Input onChange={this.handleChange} value={this.state.first_name} name="first_name" label='First Name' placeholder='First name' />
                            <Form.Input onChange={this.handleChange} value={this.state.last_name} name="last_name" label='Last Name' placeholder='Last name' />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input onChange={this.handleChange} value={new Date(this.state.dob).toISOString().split("T")[0]} type="date" name="dob" label='Date of Birth' placeholder='DOB' />
                            <Form.Select
                                    onChange={this.handleChange}
                                    value={this.state.gender}
                                    label='Gender'
                                    name= "gender"
                                    options={[{key: "male", value: "Male", text: "Male"}, {key: "female", value: "Female", text: "Female"}]}
                                    placeholder='Select Level'
                                />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input onChange={this.handleChange} type="email" value={this.state.email} name="email" label='Email' placeholder='Email' />
                            <Form.Input onChange={this.handleChange} type="phone" value={this.state.phone} name="phone" label='Phone' placeholder='Phone' />
                        </Form.Group>
                        {this.props.userType === "Trainer" ?
                            <Form.Group>
                                <Form.Select
                                    onChange={this.handleChange}
                                    value={this.state.level}
                                    label='Choose Level'
                                    name= "level"
                                    options={this.props.levelOptions}
                                    placeholder='Select Level'
                                />
                            </Form.Group>
                        : null}
        
                    </Form>

                    {this.state.errors.length > 0 ? <ul>{this.renderErrors()}</ul> : null}

                </Modal.Content>

                <Modal.Actions>
                { !this.props.isNew ? <p><Button size="small" value={this.props.id} onClick={this.props.handleDeleteUser}>Delete User</Button> </p>: null}   
                <Button primary type="submit" form={"user-form"}>{this.props.action === "new" ? "Submit" : "Save Changes" }</Button>
                <Button onClick={this.props.toggleModal}>Go Back</Button>

                {/* <Button color='green' onClick={this.handleClose} inverted>
                    <Icon name='checkmark' /> Got it
                </Button> */}
                </Modal.Actions>

            </Modal>
            
        )
}
    
}


export default connect(undefined, {addUser, updateUser})(withRouter(UserModal))



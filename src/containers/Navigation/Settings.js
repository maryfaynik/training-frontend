import React, { Component } from 'react';
import { Label, Grid, Segment, Form, Step, Icon} from 'semantic-ui-react';
import { connect } from 'react-redux'

import { updateUser } from '../../actions/actions'
import {API} from '../../App'
// import { } from '../../helpers/generalHelpers'

class Settings extends Component {

  state = {
      id: this.props.user.id,
      first_name: this.props.user.first_name,
      last_name: this.props.user.last_name,
      email: this.props.user.email,
      phone: this.props.user.phone,
      dob: this.props.user.dob,
      gender: this.props.user.gender,
      old_password: "",
      new_password: "",
      new_password_confirm: "",
      errors: [],
      success: false,
      base_url: this.props.user.type === "Manager" ? "users" : this.props.user.type.toLowerCase() + 's'
  }

  handleErrors = () => {
    return (
        <ul>
          {this.state.errors.map(error => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
    );
  };

  handleChange = (e, {value, name}) => {
    if(e.target.value){
        value = e.target.value
        name = e.target.name
    }

    this.setState({
        [name]: value,
        success: false
    })
}

handleResponse = (data) => {
    if(data.errors){
        this.setState({
            errors: data.errors,
            success: false
        })
    }else{
        console.log("success, got back: ", data.user)
        this.props.updateUser(data.user, this.props.user.type)
        this.setState({
            success: true
        })
    }
}

  updateAcct = (e) => {
      e.preventDefault()

      const { email, old_password } = this.state;

        const user = {
            email: email,
            password: old_password,
            type: this.props.user.type
        };

        //confirm old password
        fetch(`${API}/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(res => res.json())
        .then(data => {
        
            // If the user is valid, log them in...
            if (data.data) {
                
                if(this.state.new_password === this.state.new_password_confirm){
                    // patch with password
                    let newUser = {
                        user: {
                            email: this.state.email,
                        },
                        password: this.state.new_password,
                        password_confirmation: this.state.new_password_confirmation,
                        type: this.props.userType
                     }

                    fetch(`${API}/${this.state.base_url}/${this.state.id}`, {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accepts": "application/json"
                        },
                        body: JSON.stringify(newUser)

                    }).then (resp => resp.json())
                    .then(data => {
                        this.handleResponse(data)
                    })

                }else{
                    this.setState({
                        errors: ["Password and Confirm don't match"],
                        success: false
                    })
                }

            // If user is not valid / found, set user to null and record errors
            } else {
                this.setState({
                    errors: ["Incorrect old password"],
                    success: false
                })
            }
        })
  }

  updateProfile = (e) => {
    e.preventDefault()

    let newUser = {
        user: {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            dob: this.state.dob,
            phone: this.state.phone,
            gender: this.state.gender
            },
        type: this.props.userType
     }

    if(this.props.user.type === "Trainer") newUser.user.level_id = this.state.level

    fetch(`${API}/${this.state.base_url}/${this.state.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "accepts": "application/json"
        },
        body: JSON.stringify(newUser)

    }).then (resp => resp.json())
    .then(data => {
        this.handleResponse(data)
    })
  }

  render(){
    return (
      <Grid >
          {this.state.errors.length > 0 ? <Grid.Row><Grid.Column>{this.handleErrors()}</Grid.Column></Grid.Row> : null}
          {this.state.success ? 
          <Grid.Row><Grid.Column>
              <Step.Group fluid><Step completed>
                <Icon name='setting' />
                <Step.Content>
                    <Step.Title>Success</Step.Title>
                    <Step.Description>Settings saved!</Step.Description>
                </Step.Content>
                </Step></Step.Group>
            </Grid.Column></Grid.Row>
          : null}
        <Grid.Row><Grid.Column>
            <Segment>
                <Label attached="top">Account</Label>
                <Form onSubmit={this.updateAcct}>
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} type="email" value={this.state.email} name="email" label='Change Email' placeholder='Email' />    
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} type="password" value={this.state.old_password} name="old_password" label='Change Password' placeholder="Enter old password" />    
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} type="password" value={this.state.new_password} name="new_password" placeholder='Enter New Password'/>    
                        <Form.Input onChange={this.handleChange} type="password" value={this.state.new_password_confirm} name="new_password_confirm" placeholder='Confirm New Password' />    
                    </Form.Group>
                    <Form.Button>Update</Form.Button>
                </Form>
            </Segment>
        </Grid.Column></Grid.Row>
        <Grid.Row><Grid.Column>
            <Segment>
                <Label attached="top">Profile</Label>
                <Form onSubmit={this.updateProfile}>
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
                    <Form.Input onChange={this.handleChange} type="phone" value={this.state.phone} name="phone" label='Phone' placeholder='Phone' />
                    <Form.Button>Update</Form.Button>
                </Form>
            </Segment>
        </Grid.Column></Grid.Row>
        {this.props.user.type === "Manager"  ?
            <Grid.Row><Grid.Column>
                <Segment>
                    <Label attached="top">System Settings</Label>
                </Segment>
            </Grid.Column></Grid.Row>
        : null } 
        
      </Grid>
      
    )
  }
}

const msp = (state) => {
  return {
    user: state.user.user,
    allTrainers: state.user.allTrainers,
    allSessions: state.schedule.allSessions,
    allClients: state.user.allClients,
    clientPackages: state.app.clientPackages
  }
}

export default connect(msp, {updateUser})(Settings);
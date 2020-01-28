import React, { useState } from 'react';
import { Label, Grid, Segment, Form, Step, Icon} from 'semantic-ui-react';
import { connect } from 'react-redux'

import { updateUser } from '../../actions/actions'
import {API} from '../../App'
// import { } from '../../helpers/generalHelpers'

const Settings = (props) => {


    let [id, setId] = useState(props.user.id)
    let [first_name, setFirst_name] = useState(props.user.first_name)
    let [last_name, setLast_name] = useState(props.user.last_name)
    let [email, setEmail] = useState(props.user.email)
    let [phone, setPhone] = useState(props.user.phone)
    let [dob, setDob] = useState(props.user.dob)
    let [gender, setGender] = useState(props.user.gender)
    let [old_password, setOld_password ] = useState("")
    let [new_password, setNew_password] = useState("")
    let [new_password_confirm, setNew_password_confirm] = useState("")
    let [errors, setErrors] = useState([])
    let [success, setSuccess] = useState(false)
    let [base_url, setBase_url] = useState(props.user.user_type === "Manager" ? "users" : props.user.user_type.toLowerCase() + 's')


  const handleErrors = () => {
    return (
        <ul>
          {errors.map(error => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
    );
  };

//   const handleChange = (e, {value, name}) => {
//     if(e.target.value){
//         value = e.target.value
//         name = e.target.name
//     }

//     setState({
//         [name]: value,
//         success: false
//     })
// }

    const handleResponse = (data) => {
        if(data.errors){
            setErrors(data.errors)
            setSuccess(false)
        }else{

            props.updateUser(data.user, props.user.user_type)
            setSuccess(true)
        }
    }

    const updateAcct = (e) => {
        e.preventDefault()

        const user = {
            email: email,
            password: old_password,
            type: props.user.user_type
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
                
                if(new_password === new_password_confirm){
                    // patch with password
                    let newUser = {
                        user: {
                            email: email,
                        },
                        password: new_password,
                        password_confirmation: new_password_confirmation,
                        type: props.userType
                        }

                    fetch(`${API}/${base_url}/${id}`, {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accepts": "application/json"
                        },
                        body: JSON.stringify(newUser)

                    }).then (resp => resp.json())
                    .then(data => {
                        handleResponse(data)
                    })

                }else{
                    setErrors(["Password and Confirm don't match"])
                    setSuccess(false)
                }

            // If user is not valid / found, set user to null and record errors
            } else {
                setErrors(["Incorrect old password"])
                setSuccess(false)
            }
        })
    }

    const updateProfile = (e) => {
        e.preventDefault()

        let newUser = {
            user: {
                first_name: first_name,
                last_name: last_name,
                dob: dob,
                phone: phone,
                gender: gender
                },
            user_type: props.userType
        }

        if(props.user.user_type === "Trainer") newUser.user.level_id = level

        fetch(`${API}/${base_url}/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(newUser)

        }).then (resp => resp.json())
        .then(data => {
            handleResponse(data)
        })
    }


    return (
        <Grid >
            {errors.length > 0 ? <Grid.Row><Grid.Column>{handleErrors()}</Grid.Column></Grid.Row> : null}
            {success ? 
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
                <Form onSubmit={updateAcct}>
                    <Form.Group>
                        <Form.Input onChange={(e) => setEmail(e.target.value)} type="email" value={email} name="email" label='Change Email' placeholder='Email' />    
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={(e) => setOld_assowrd(e.target.value)} type="password" value={old_password} name="old_password" label='Change Password' placeholder="Enter old password" />    
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={(e) => setNew_password(e.target.value)} type="password" value={new_password} name="new_password" placeholder='Enter New Password'/>    
                        <Form.Input onChange={(e) => setNew_password_confirm(e.target.value)} type="password" value={new_password_confirm} name="new_password_confirm" placeholder='Confirm New Password' />    
                    </Form.Group>
                    <Form.Button>Update</Form.Button>
                </Form>
            </Segment>
        </Grid.Column></Grid.Row>
        <Grid.Row><Grid.Column>
            <Segment>
                <Label attached="top">Profile</Label>
                <Form onSubmit={updateProfile}>
                    <Form.Group widths='equal'>
                        <Form.Input onChange={(e) => setFirst_name(e.target.value)} value={first_name} name="first_name" label='First Name' placeholder='First name' />
                        <Form.Input onChange={(e) => setLast_name(e.target.value)} value={last_name} name="last_name" label='Last Name' placeholder='Last name' />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input onChange={handleDobChange} value={new Date(dob).toISOString().split("T")[0]} type="date" name="dob" label='Date of Birth' placeholder='DOB' />
                        <Form.Select
                                onChange={handleChange}
                                value={gender}
                                label='Gender'
                                name= "gender"
                                options={[{key: "male", value: "Male", text: "Male"}, {key: "female", value: "Female", text: "Female"}]}
                                placeholder='Select Level'
                            />
                    </Form.Group>
                    <Form.Input onChange={handleChange} type="phone" value={phone} name="phone" label='Phone' placeholder='Phone' />
                    <Form.Button>Update</Form.Button>
                </Form>
            </Segment>
        </Grid.Column></Grid.Row>
        {props.user.user_type === "Manager"  ?
            <Grid.Row><Grid.Column>
                <Segment>
                    <Label attached="top">System Settings</Label>
                </Segment>
            </Grid.Column></Grid.Row>
        : null } 
        
        </Grid>
        
        )
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
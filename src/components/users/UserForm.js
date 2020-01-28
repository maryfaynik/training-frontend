import React, { useState } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Header, Divider} from 'semantic-ui-react';

import {addUser, updateUser} from '../../actions/actions'
import {API} from '../../App'

const UserForm = (props) => {

    // state = {
    //     id: this.props.editUser.id,
    //     first_name: this.props.editUser.first_name,
    //     last_name: this.props.editUser.last_name,
    //     gender: this.props.editUser.gender,
    //     dob: this.props.editUser.dob,
    //     email: this.props.editUser.email,
    //     phone: this.props.editUser.phone,
    //     level: this.props.userType === "Trainer" ? this.props.editUser.level.id : "",
    //     errors: []
    // }

    let [id, setId] = useState(props.editUser.id)
    let [first_name, setFirst_name] = useState(props.editUser.first_name)
    let [last_name, setLast_name] = useState(props.editUser.last_name)
    let [gender, setGender] = useState(props.editUser.gender)
    let [dob, setDob] = useState(props.editUser.dob)
    let [email, setEmail] = useState(props.editUser.email)
    let [ phone, setPhone ] = useState(props.editUser.phone)
    let [level, setLevel] = useState(props.userType === "Trainer" ? props.editUser.level.id : "")
    let [errors, setErrors] = useState([])

    // const handleChange = (e, {value, name}) => {
    //     if(e.target.name){
    //         name = e.target.name
    //     }
    //     if(name === "dob"){
    //         console.log("here, e.target.value =", e.target.value)
    //         let date = new Date(e.target.value)
    //         if(date.getTime() !== date.getTime()) return

    //     }
    //     this.setState({
    //         [name]: value
    //     })
    // }

    const handleDobChange = (e) => {
        let date = new Date(e.target.value)
        if(date.getTime() !== date.getTime()) return
        setDob(e.target.value)
    } 
    
    const handleSubmit = (e) =>{
        e.preventDefault()
        
        let {isNew} = props
        
        let type = props.userType.toLowerCase()
        console.log('sumbitting! type =', type )

        let newUser = {
            [type]: {
                first_name: first_name,
                last_name: last_name,
                dob: dob,
                email: email,
                phone: phone,
                gender: gender
            }
        }

        if(type === "trainer") newUser[type].level_id = level
        if(isNew) newUser[type].password = "password"

        let base_url = props.userType === "Trainer" ? "trainers" : "clients"
        let end_url = isNew ? "" : `/${id}`
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
                console.log("got back", data)
                if(data.errors){
                    setErrors(data.errors)
                }else{
                    if(isNew){
                        props.addUser(data[type])
                    }else{
                        props.updateUser(data[type])
                    }
                    props.toggleForm()
                }
            })
    }
   
    const renderErrors = () => {
        return errors.map((error, i) => <li key={i}>{error}</li>)
    }


  
    let {isNew, userType} = props
    return (
        <div className= 'outer-popup'>
            {/* <Confirm open={confirmOpen} onCancel={handleConfirmDelete} onConfirm={()=>handleDelete(undefined, "cancelled")}
            content='Do you really want to delete this user?'
            header='Are you sure?'
            /> */}
        <div className="inner-popup">
            <Form className="user-form" id="user-form" onSubmit={handleSubmit}>
                <Form.Group>
                    <Header as="h1"> {isNew ? "Add" : "Edit"} {userType === "Trainer" ? "Trainer" : "Client"}</Header>
                </Form.Group>
                <Divider />
                <Form.Group widths='equal'>
                    <Form.Input onChange={ (e) => setFirst_name(e.target.value)} value={first_name} name="first_name" label='First Name' placeholder='First name' />
                    <Form.Input onChange={(e) => setLast_name(e.target.value)} value={last_name} name="last_name" label='Last Name' placeholder='Last name' />
                </Form.Group>
                <Form.Group>
                    <Form.Input onChange={handleDobChange} value={new Date(dob).toISOString().split("T")[0]} type="date" name="dob" label='Date of Birth' placeholder='DOB' />
                    <Form.Select
                            onChange={(e, {value}) => setGender(value)}
                            value={gender}
                            label='Gender'
                            name= "gender"
                            options={[{key: "male", value: "Male", text: "Male"}, {key: "female", value: "Female", text: "Female"}]}
                            placeholder='Select Level'
                        />
                </Form.Group>
                <Form.Group>
                    <Form.Input onChange={(e) => setEmail(e.target.value)} type="email" value={email} name="email" label='Email' placeholder='Email' />
                    <Form.Input onChange={(e) => setPhone(e.target.value)} type="phone" value={phone} name="phone" label='Phone' placeholder='Phone' />
                </Form.Group>
                {props.userType === "Trainer" ?
                    <Form.Group>
                        <Form.Select
                            onChange={(e, {value}) => setLevel(value)}
                            value={level}
                            label='Choose Level'
                            name= "level"
                            options={props.levelOptions}
                            placeholder='Select Level'
                        />
                    </Form.Group>
                : null}

            </Form>
            
            { !isNew ? <p><Button size="small" value={id} onClick={props.handleDeleteUser}>Delete User</Button> </p>: null}  
            
            <p>
                <Button primary type="submit" form={"user-form"}>{isNew ? "Submit" : "Save Changes" }</Button>
                <Button onClick={props.goBack}>Go Back</Button>
            </p>
            {errors.length > 0 ? <ul>{renderErrors()}</ul> : null}
        </div>
        </div>
    )
}

export default connect(undefined, {addUser, updateUser})(withRouter(UserForm))



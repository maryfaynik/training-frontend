import React, { useState } from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Form, Button, Radio, Segment, Menu, Label} from 'semantic-ui-react';
import { API } from '../../App';

import {setUser, updateUser} from '../../actions/actions'

export const Signup = (props) =>{

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [password_confirm, setPassword_confirm ] = useState('')
    let [user_type, setUser_type] = useState('Client')
    let [errors, setErrors] = useState([])


  // handleChange = (e, {value}) => {
  //   let name = "user_type"
  //   if(e.target.name){
  //     value = e.target.value
  //     name = e.target.name
  //   }
  //   setState({
  //     [name]: value,
  //   });
  // };

  //Upon Login submit, check user auth
  const handleSubmit = event => {
    event.preventDefault();

    if(password !== password_confirm){
      setErrors(["Password and password confirmation must match!"])
      return 
    }

    fetch(`${API}/finduser/${email}`)
      .then(res => res.json())
      .then(data => {

        // If the user is valid, log them in and save their password to DB...
        if (data.user) {

          let user = data.data

          let pwObject = {
            password: password
          }

          fetch(`${API}/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(pwObject)
          })
          .then(resp => resp.json())
          .then(data => {

            if(data.errors){
              props.setUser({});

              localStorage.removeItem("user_id")
              
              setErrors([...data.errors])

            }else{
              //cache the user info
              localStorage.user_id = user.id;
  
              //set the user in redux
              props.setUser(user);
              // props.setLoading(true)
              console.log("fetching all the stuffff LOGIN")
              //fetch this user's clients, sessions, and trainers
              props.initialFetch(user)
            }

          })     
          
        // If user is not found via email, set user to null and record errors
        } else {
          props.setUser({});

          localStorage.removeItem("user_id")
          
          setErrors([...data.errors])
        }
      })
      .catch(error => console.log('api errors:', error));
  };

  // Go through errors in state and add to ul
  const handleErrors = () => {
    return (
        <ul>
          {errors.map(error => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
    );
  };

  return (
    <div className="login">
      <Segment>
        <h1>Register</h1>
        <Form onSubmit={handleSubmit}>
          <Segment className="signup-segment">
            <Label attached="top">Enter your Email Address</Label>
            <Form.Input
              placeholder="email"
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </Segment>
          <Segment className="signup-segment">
          <Label attached="top">Create and Confirm Your Password</Label>
            <Form.Input
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Input
              placeholder="password confirmation"
              type="password"
              name="password_confirm"
              value={password_confirm}
              onChange={(e) => setPassword_confirm(e.target.value)}
            />
          </Segment>
          <Segment className="signup-segment" >
            <Label attached="top">Select User Type</Label>
            <Form.Group inline>
            {/* <Grid>
            <Grid.Row >
              <Grid.Column width={5}> */}
                <Radio
                  label='Trainer'
                  name='user_type'
                  value='Trainer'
                  checked={user_type === 'Trainer'}
                  onChange={(e) => setUser_type(e.target.value)}
                />
              {/* </Grid.Column>
              <Grid.Column width={5}> */}
                <Radio
                  label='Manager'
                  name='user_type'
                  value='Manager'
                  checked={user_type === 'Manager'}
                  onChange={(e) => setUser_type(e.target.value)}
                />
              {/* </Grid.Column>
              <Grid.Column width={5}> */}
                <Radio
                  label='Client'
                  name='user_type'
                  value='Client'
                  checked={user_type === 'Client'}
                  onChange={(e) => setUser_type(e.target.value)}
                />
              {/* </Grid.Column>
            </Grid.Row>
          </Grid> */}
          </Form.Group>
          </Segment>
          <Button type="submit">Sign Up</Button>
        </Form>
        <Menu text>
          <Menu.Item><Link to="/login">Or Sign In Here</Link></Menu.Item>
        </Menu>

        <div>{errors ? handleErrors() : null}</div>
    </Segment>
    </div>
  )
}

export default connect(undefined,{setUser, updateUser})(withRouter(Signup));

import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Form, Button, Radio, Segment, Menu, Label} from 'semantic-ui-react';
import { API } from '../../App';

import {setUser, updateUser} from '../../actions/actions'

export class Signup extends Component {

  state = {
    email: '',
    password: '',
    password_confirm: '',
    type: 'Client',
    errors: [],
  };

  handleChange = (e, {value}) => {
    let name = "type"
    if(e.target.name){
      value = e.target.value
      name = e.target.name
    }
    this.setState({
      [name]: value,
    });
  };

  //Upon Login submit, check user auth
  handleSubmit = event => {
    event.preventDefault();
    const { email, password, password_confirm } = this.state;

    if(password !== password_confirm){
      this.setState({
        errors: ["Password and password confirmation must match!"]
      })
      return 
    }

    fetch(`${API}/finduser/${email}`)
      .then(res => res.json())
      .then(data => {

        // If the user is valid, log them in and save their password to DB...
        if (data.user) {

          let user = data.data

          let pwObject = {
            password: this.state.password
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
            console.log("got back ", data)

            if(data.errors){
              this.props.setUser({});

              localStorage.removeItem("user_id")
              
              this.setState({
                errors: [...data.errors],
              });

            }else{
              //cache the user info
              console.log("setting localstorage id to ", user.id)
              localStorage.user_id = user.id;
  
              //set the user in redux
              this.props.setUser(user);
              this.props.setLoading(true)
              console.log("fetching all the shitsssss LOGIN")
              //fetch this user's clients, sessions, and trainers
              this.props.initialFetch(user)
            }

          })     
          
        // If user is not found via email, set user to null and record errors
        } else {
          this.props.setUser({});

          localStorage.removeItem("user_id")
          
          this.setState({
            errors: [...data.errors],
          });
        }
      })
      .catch(error => console.log('api errors:', error));
  };

  // Go through errors in state and add to ul
  handleErrors = () => {
    return (
        <ul>
          {this.state.errors.map(error => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
    );
  };

  render() {
    const { email, password, password_confirm } = this.state
    return (
      <div className="login">
        <Segment>
          <h1>Register</h1>
          <Form onSubmit={this.handleSubmit}>
            <Segment className="signup-segment">
              <Label attached="top">Enter your Email Address</Label>
              <Form.Input
                placeholder="email"
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />

            </Segment>
            <Segment className="signup-segment">
            <Label attached="top">Create and Confirm Your Password</Label>
              <Form.Input
                placeholder="password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <Form.Input
                placeholder="password confirmation"
                type="password"
                name="password_confirm"
                value={password_confirm}
                onChange={this.handleChange}
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
                    name='type'
                    value='Trainer'
                    checked={this.state.type === 'Trainer'}
                    onChange={this.handleChange}
                  />
                {/* </Grid.Column>
                <Grid.Column width={5}> */}
                  <Radio
                    label='Manager'
                    name='type'
                    value='Manager'
                    checked={this.state.type === 'Manager'}
                    onChange={this.handleChange}
                  />
                {/* </Grid.Column>
                <Grid.Column width={5}> */}
                  <Radio
                    label='Client'
                    name='type'
                    value='Client'
                    checked={this.state.type === 'Client'}
                    onChange={this.handleChange}
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

          <div>{this.state.errors ? this.handleErrors() : null}</div>
      </Segment>
      </div>
    )
  }
}

export default connect(undefined,{setUser, updateUser})(withRouter(Signup));

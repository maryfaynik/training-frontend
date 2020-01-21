import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Form, Button, Grid, Radio, Segment, Menu } from 'semantic-ui-react';
import { API } from '../../App';

import {setUser, initialFetch, setUserLoading, setLoading} from '../../actions/actions'

export class Login extends Component {

  state = {
    email: '',
    password: '',
    user_type: 'Manager',
    errors: '',
  };

  handleChange = (e, {value}) => {
    let name = "user_type"
    if(e.target.name){
      value = e.target.value
      name = e.target.name
    }
    this.setState({
      [name]: value,
    });
  };

  //Upon login submit, check user auth
  handleSubmit = event => {
    event.preventDefault();
    const { email, password, user_type } = this.state;

    const user = {
      email,
      password,
      user_type
    };

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
        if (data.user) {
          this.props.setLoading(true)
          this.props.setUserLoading(true)

          let user = data.user.user
           
          //cache the info
          console.log("setting localstorage to, ", user.id)
          localStorage.user_id = user.id
          console.log("localStorage[user_id] =", localStorage["user_id"])
          
          //set the user in redux
          console.log("setting user to", user)
          this.props.setUser(user);
          this.props.setUserLoading(false)
          
          console.log("fetching all the sssstuffs LOGIN")
          //fetch this user's clients, sessions, and trainers
          this.props.initialFetch(user)
          
        // If user is not valid / found, set user to null and record errors
        } else {
          console.log("trouble in paradise")
          this.props.setUser({});
          this.props.setUserLoading(false)
          localStorage.removeItem("user_id")
          
          this.setState({
            errors: data.errors,
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
    const { email, password } = this.state;
    return (
      <div className="login">
        <Segment>
          <h1>Log In</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              placeholder="email"
              type="text"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder="password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <Form.Input >
            <Form.Group>
              <Grid>
              <Grid.Row >
                <Grid.Column width={5}>
                  <Radio
                    label='Trainer'
                    name='user_type'
                    value='Trainer'
                    checked={this.state.user_type === 'Trainer'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column width={5}>
                  <Radio
                    label='Manager'
                    name='user_type'
                    value='Manager'
                    checked={this.state.user_type === 'Manager'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
                <Grid.Column width={5}>
                  <Radio
                    label='Client'
                    name='user_type'
                    value='Client'
                    checked={this.state.user_type === 'Client'}
                    onChange={this.handleChange}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            </Form.Group>
            </Form.Input>
            <Button type="submit">Log In</Button>
          </Form>
          <Menu text>
            <Menu.Item>New User?</Menu.Item><Menu.Item><Link to="/signup">Register Here</Link></Menu.Item>
          </Menu>

          <div>{this.state.errors ? this.handleErrors() : null}</div>
      </Segment>
      </div>
    );
  }
}

const mdp = (dispatch) =>{
    return {
      initialFetch: (user) => dispatch(initialFetch(user)),
      setUser: (user) => dispatch(setUser(user, dispatch)),
      setUserLoading: (flag) => dispatch(setUserLoading(flag)),
      setLoading: (flag) => dispatch(setLoading(flag))
    }
}

export default connect(undefined, mdp)(withRouter(Login));

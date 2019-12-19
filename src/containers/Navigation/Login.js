import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Grid, Radio } from 'semantic-ui-react';
import { API } from '../../App';

import {setUser, initialFetch} from '../../actions/actions'

export class Login extends Component {

  state = {
    email: '',
    password: '',
    type: 'Manager',
    errors: '',
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  //Upon login submit, check user auth
  handleSubmit = event => {
    console.log("here")
    event.preventDefault();
    const { email, password, type } = this.state;

    const user = {
      email,
      password,
      type
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
        if (data.data) {
          let user = data.data

          //set the user
          this.props.setUser(user);

          console.log("fetching all the shitsssss LOGIN")
          //fetch this user's clients, sessions, and trainers
          initialFetch(user)
          
        // If user is not valid / found, set user to null and record errors
        } else {
          this.props.setUser({});
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
        <h1>Log In</h1>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            width={10}
            placeholder="email"
            type="text"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
          <Form.Input
            width={10}
            placeholder="password"
            type="password"
            name="password"
            value={password}
            onChange={this.handleChange}
          />
          <Form.Input >
          <Grid >
            <Grid.Row >
              <Grid.Column width={5}>
                <Radio
                  label='Trainer'
                  name='type'
                  value='Trainer'
                  checked={this.state.type === 'Trainer'}
                  onChange={this.handleChange}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Radio
                  label='Manager'
                  name='type'
                  value='Manager'
                  checked={this.state.type === 'Manager'}
                  onChange={this.handleChange}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Radio
                  label='Client'
                  name='type'
                  value='Client'
                  checked={this.state.value === 'Client'}
                  onChange={this.handleChange}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </Form.Input>
          <Button type="submit">Log In</Button>
        </Form>

        <div>{this.state.errors ? this.handleErrors() : null}</div>

      </div>
    );
  }
}


export default connect(undefined,{ setUser, initialFetch })(withRouter(Login));

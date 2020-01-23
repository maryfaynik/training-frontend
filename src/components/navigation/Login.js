import React, { useState } from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { Form, Button, Grid, Radio, Segment, Menu } from 'semantic-ui-react';
import { API } from '../../App';

import {setUser, initialFetch, setUserLoading, setLoading} from '../../actions/actions'

// export class Login extends Component {
const Login = (props) => {
 
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [user_type, setUserType] = useState('Manager')
  let [errors, setErrors] = useState('')

  //Upon login submit, check user auth
  const handleSubmit = e => {
    e.preventDefault();
    // const { email, password, user_type } = state;

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
          props.setLoading(true)
          props.setUserLoading(true)

          let user = data.user.user
           
          //cache the info
          localStorage.user_id = user.id
    
          //set the user in redux
          props.setUser(user);
          props.setUserLoading(false)
          console.log("fetching all the sssstuffs LOGIN")

          //fetch this user's clients, sessions, and trainers
          props.initialFetch(user)
          
        // If user is not valid / found, set user to null and record errors
        } else {
       
          props.setUser({});
          props.setUserLoading(false)
          localStorage.removeItem("user_id")
          
          // setState({
          //   errors: data.errors,
          // });
          setErrors(data.errors)
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
        <h1>Log In</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            placeholder="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Input
            placeholder="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                  checked={user_type === 'Trainer'}
                  onChange={(e, value) => setUserType(value)}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Radio
                  label='Manager'
                  name='user_type'
                  value='Manager'
                  checked={user_type === 'Manager'}
                  onChange={(e, value) => setUserType(value)}
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Radio
                  label='Client'
                  name='user_type'
                  value='Client'
                  checked={user_type === 'Client'}
                  onChange={(e, value) => setUserType(value)}
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

        <div>{errors ? handleErrors() : null}</div>
    </Segment>
    </div>
  );
  
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

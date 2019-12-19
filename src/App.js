import React, { Component } from 'react';
import { connect } from 'react-redux'

import NavBar from './components/Navigation/NavBar'
import Main from './components/Navigation/Main'

import {initialFetch, setUser} from './actions/actions'

export const API = "http://localhost:3000/api/v1"

class App extends Component {

  state= {

  }

  componentDidMount(){
    const user_id = localStorage.user_id;
  
    if (user_id) {
      fetch(`${API}/auto_login`, {
        headers: {
          Authorization: user_id,
        },
      }).then(res => res.json())
        .then(data => {
          
          this.props.setUser(data.data);
          let user=data.data
          //fetch this user's clients, sessions, and trainers

          console.log("fetching all the shitsssss autologin")
          this.props.initialFetch(user)

        })
        .catch(err => console.log('errors: ', err));
    }
  
  }

  render(){
    return (
      <div className="app">
        <NavBar/>
        {/* <Divider section/> */}
        <Main/>
      </div>
    )
  }
    
}

const msp = (state) =>{
  return {

  }
}


export default connect(msp, {initialFetch, setUser})(App);

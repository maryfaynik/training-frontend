import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import NavBar from './components/Navigation/NavBar'
import Main from './components/Navigation/Main'
import Loading from './components/Navigation/Loading'

import {initialFetch, setUser, setLoading} from './actions/actions'

// export const API = "http://localhost:3000/api/v1"
// export const API = "https://training-manager-backend.herokuapp.com/api/v1"
export const API = "ws://training-manager-backend.herokuapp.com/api/v1"

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
          
          //if cached login info fails, clear cache and force login
          if(data.status !== 200){
            localStorage.removeItem("user_id")
            this.props.setUser({})

          //on success keep cached login info and set user
          }else{

            this.props.setUser(data.data);
            
            //fetch this user's clients, sessions, and trainers
            let user=data.data
            console.log("fetching all the shitsssss autologin")
            this.props.initialFetch(user)
          }

        })
    }else{
      this.props.setLoading(false)
    }
  
  }

  render(){
    return (
      <div className="app">
        <NavBar/>
        {this.props.loading ? <Loading /> : <Main/>}
      </div>
    )
  }
    
}

const msp = (state) =>{
  return {
    loading: state.app.loading
  }
}


export default connect(msp, {initialFetch, setUser, setLoading})(withRouter(App));

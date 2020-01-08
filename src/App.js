import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import NavBar from './components/NavBar'
import Main from './components/Main'

import {initialFetch, setUser, setUserLoading} from './actions/actions'

// export const API = "http://localhost:3000/api/v1"
export const API = "https://training-manager-backend.herokuapp.com/api/v1"

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
            this.props.setUserLoading(false)

            //fetch this user's clients, sessions, and trainers
            let user=data.data
            console.log("fetching all the stuff autologin")
            this.props.initialFetch(user)
          }

        })
    }else{
      this.props.setUserLoading(false)
    }
  
  }

render(){

    return (
      <div className="app">
        <NavBar/>
       <Main/>
      </div>
    )
  }
    
}

const msp = (state) =>{
  return {
    user: state.user.user,
    allLoading: state.app.allLoading,
    userLoading: state.app.userLoading,
    loading: state.app.loading
  }
}

const mdp = (dispatch) =>{
  return {
    initialFetch: (user) => dispatch(initialFetch(user)),
    setUser: (user) => dispatch(setUser(user, dispatch)),
    setUserLoading: (flag) => dispatch(setUserLoading(flag))
  }
}


export default connect(msp, mdp)(withRouter(App));

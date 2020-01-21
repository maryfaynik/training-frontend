import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import NavBar from './components/NavBar'
import Main from './components/Main'

import {initialFetch, setUser, setUserLoading, setLoading} from './actions/actions'

// export const API = "http://localhost:3000/api/v1"
export const API = "https://training-manager-backend.herokuapp.com/api/v1"



//const App = (props) => {
class App extends React.Component{
  //const useEffect = () =>{
  componentDidMount(){
    const userId = localStorage.user_id;
  
    if (userId) {
      console.log('checking for id ', userId)
      
      fetch(`${API}/auto_login`, {
        headers: {
          Authorization: userId,
        }
      }).then(res => res.json())
        .then(data => {
          
          console.log("on checking for user got back", data)
          //if cached login info fails, clear cache and force login
          if(data.status !== 200){
            localStorage.removeItem("user_id")
            this.props.setUser({})
            this.props.setUserLoading(false)

          //on success keep cached login info and set user
          }else{

            console.log("found the user")
            let user= data.user.user
            this.props.setUser(user);
            this.props.setUserLoading(false)

            //fetch this user's clients, sessions, and trainers
            console.log("fetching all the stuff autologin")
            this.props.initialFetch(user).then(this.props.setLoading(false))
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
    loading: state.app.loading,
    userLoading: state.app.userLoading,
    loading: state.app.loading
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


export default connect(msp, mdp)(withRouter(App));

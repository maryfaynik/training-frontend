import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Switch, Route, withRouter, Redirect} from 'react-router-dom'

import { getUserFromId} from '../../helpers/generalHelpers'
import Landing from '../../components/Navigation/Landing'
import Login from './Login'
import Signup from './Signup'
import ScheduleContainer from '../Scheudle/ScheduleContainer'
import UsersContainer from '../Users/UsersContainer';
import UserProfile from '../Users/UserProfile';
import PackagesContainer from '../Packages/PackagesContainer';

class MainBody extends Component {

  renderLanding = () => {
      if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      return <Landing/>
  }
  renderLogin = () => {
    if(this.props.user.id) return <Redirect to="/"/>
      return <Login/>
  }
  renderSignup = () => {
    if(this.props.user.id) return <Redirect to="/"/>
      return <Signup/>
  }

  renderClients = (routerProps) => {
    if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
    if(routerProps.match.params.id){
      let edit = getUserFromId(parseInt(routerProps.match.params.id), this.props.allClients)
      console.log("edit =", edit)
      return <UsersContainer back={true} editUser={edit} enterNew={false} showForm={true} allUsers={this.props.allClients} userType="Client"/>
    }
    return <UsersContainer back={false} showForm={false} enterNew={true} allUsers={this.props.allClients} userType="Client"/>
  }

  renderTrainers = (routerProps) => {
    if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      if(routerProps.match.params.id){
        let edit = getUserFromId(parseInt(routerProps.match.params.id), this.props.allTrainers)
        return <UsersContainer back={true} editUser={edit} enterNew={false} showForm={true} allUsers={this.props.allTrainers} userType="Trainer"/>
      }
      return <UsersContainer back={false} showForm={false} enterNew={true} allUsers={this.props.allTrainers} userType="Trainer"/>
  }

  renderSchedule = () => {
      if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      return <ScheduleContainer/>
  }

  renderPackages = () => {
      if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      return <PackagesContainer/>
  }

  renderProfile = (routerProps) => {
    if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>

    let id = parseInt(routerProps.match.params.id)
    let user = getUserFromId(id, [...this.props.allTrainers, ...this.props.allClients])
    if(user === undefined){
      this.props.history.goBack()
    }else return <UserProfile user={user}/>
}


  renderNotFound = () => {
      return <div>404, buddy</div>
  }
  
  render(){
    return (
        <div className="mainBody"> 
            <Switch>
                <Route exact path="/landing" render={this.renderLanding} />
                <Route exact path="/" render={this.renderLanding} />
                <Route exact path="/login" render={this.renderLogin} />
                <Route exact path="/signup" render={this.renderSignup} />
                <Route exact path="/schedule" render={this.renderSchedule} />
                <Route exact path="/trainers" render={this.renderTrainers} />
                <Route exact path="/clients" render={this.renderClients} />
                <Route exact path="/clients/edit/:id" render={this.renderClients} />
                <Route exact path="/trainers/edit/:id" render={this.renderTrainers} />
                <Route exact path="/packages" render={this.renderPackages} />
                <Route exact path="/profile/:id" render={this.renderProfile} />
            </Switch>
        </div>
    )
  }

}

const msp = (state) => {
    return{
        user: state.user.user,
        allTrainers: state.user.allTrainers,
        allClients: state.user.allClients,
    }
}

export default connect(msp)(withRouter(MainBody))

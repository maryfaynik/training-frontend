import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Switch, Route, withRouter, Redirect} from 'react-router-dom'

import Landing from '../../components/Navigation/Landing'
import Login from './Login'
import ScheduleContainer from '../Scheudle/ScheduleContainer'
import TrainersContainer from '../Users/TrainersContainer'
import ClientsContainer from '../Users/ClientsContainer';

class MainBody extends Component {

  renderLanding = () => {
      if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      console.log("here?")
      return <Landing/>
  }
  renderLogin = () => {
    if(this.props.user.id) return <Redirect to="/"/>
      return <Login/>
  }

  renderClients = () => {
    if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      return <ClientsContainer/>
  }

  renderTrainers = () => {
    if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      return <TrainersContainer/>
  }

  renderSchedule = () => {
      if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
      return <ScheduleContainer/>
  }

  renderProfile = () => {
    if(!this.props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
    return <div>PROFILE FOR USER {this.props}</div>
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
                <Route exact path="/schedule" render={this.renderSchedule} />
                <Route exact path="/trainers" render={this.renderTrainers} />
                <Route exact path="/clients" render={this.renderClients} />
                <Route exact path="/profile/:id" render={this.renderProfile} />
            </Switch>
        </div>
    )
  }

}

const msp = (state) => {
    return{
        user: state.user.user
    }
}

export default connect(msp)(withRouter(MainBody))

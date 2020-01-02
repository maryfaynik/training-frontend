import React  from 'react';
import { connect } from 'react-redux'
import { Switch, Route, withRouter, Redirect} from 'react-router-dom'
import { Segment, Header, Icon} from 'semantic-ui-react'

import { getUserFromId } from '../helpers/generalHelpers'
import Landing from './Landing'
import ScheduleContainer from '../containerssss/schedule/ScheduleContainer'
import UsersContainer from '../containerssss/users/UsersContainer';
import UserProfile from '../containerssss/users/UserProfile';
import PackagesContainer from '../containerssss/packagesssss/PackagesContainer';
import Settings from '../containerssss/navigationnnn/Settings';
import Signup from '../containerssss/navigationnnn/Signup'
import Login from '../containerssss/navigationnnn/Login'

const MainBody =(props) => {

  const renderLanding = () => {
    if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
    return <Landing/>
  }

  const renderLogin = () => {
    if(props.user.id) return <Redirect to="/"/>
      return <Login/>
  }

  const renderSignup = () => {
    if(props.user.id) return <Redirect to="/"/>
      return <Signup/>
  }

  const renderClients = (routerProps) => {
    if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
    if(routerProps.match.params.id){
      let edit = getUserFromId(parseInt(routerProps.match.params.id), props.allClients)
      return <UsersContainer back={true} editUser={edit} enterNew={false} showForm={true} allUsers={props.allClients} userType="Client"/>
    }
    return <UsersContainer back={false} showForm={false} enterNew={true} allUsers={props.allClients} userType="Client"/>
  }

  const renderTrainers = (routerProps) => {
    if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>

    if(routerProps.match.params.id){
        let edit = getUserFromId(parseInt(routerProps.match.params.id), props.allTrainers)
        return <UsersContainer back={true} editUser={edit} enterNew={false} showForm={true} allUsers={props.allTrainers} userType="Trainer"/>
      }
      return <UsersContainer back={false} showForm={false} enterNew={true} allUsers={props.allTrainers} userType="Trainer"/>
  }

  const renderSchedule = () => {

    if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>

    return <ScheduleContainer/>
  }

  const renderPackages = () => {
      if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>

      return <PackagesContainer/>
  }

  const renderProfile = (routerProps) => {
    if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>

    let id = parseInt(routerProps.match.params.id)
    let user = getUserFromId(id, [...props.allTrainers, ...props.allClients])
    if(user === undefined){
      props.history.goBack()
    }else return <UserProfile user={user}/>
}

const renderSettings = () => {
  if(!props.user.id && !localStorage.user_id) return <Redirect to="/login"/>
  return <Settings/>
}

const renderNotFound = () => {
    return <div><Segment placeholder> 
            <Header icon><Icon name='frown' />Oops! This Page Doesn't Exist...</Header>
            </Segment></div>
}
  
  return (
      <div className="mainBody"> 
          <Switch>
              <Route exact path="/landing" render={renderLanding} />
              <Route exact path="/" render={renderLanding} />
              <Route exact path="/login" render={renderLogin} />
              <Route exact path="/signup" render={renderSignup} />
              <Route exact path="/schedule" render={renderSchedule} />
              <Route exact path="/trainers" render={renderTrainers} />
              <Route exact path="/clients" render={renderClients} />
              <Route exact path="/clients/edit/:id" render={renderClients} />
              <Route exact path="/trainers/edit/:id" render={renderTrainers} />
              <Route exact path="/packages" render={renderPackages} />
              <Route exact path="/settings" render={renderSettings} />
              <Route exact path="/profile/:id" render={renderProfile} />
              <Route render={renderNotFound}/>
          </Switch>
      </div>
  )
}

const msp = (state) => {
    return{
        user: state.user.user,
        allTrainers: state.user.allTrainers,
        allClients: state.user.allClients,
        allLoading: state.app.allLoading
    }
}

export default connect(msp)(withRouter(MainBody))

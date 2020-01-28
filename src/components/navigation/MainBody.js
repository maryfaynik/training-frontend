import React  from 'react';
import { connect } from 'react-redux'
import { Switch, Route, withRouter, Redirect} from 'react-router-dom'
import { Segment, Header, Icon} from 'semantic-ui-react'

import { getUserFromId } from '../../helpers/generalHelpers'
import Landing from './Landing'
import ScheduleContainer from '../schedule/ScheduleContainer'
import UsersContainer from '../users/UsersContainer'
import UserProfile from '../users/UserProfile'
import PackagesContainer from '../packages/PackagesContainer'
import Settings from '../../containers/navigation/Settings'
import Signup from './Signup'
import Login from './Login'

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
              <Route exact path={process.env.PUBLIC_URL + '/landing'} render={renderLanding} />
              <Route exact path={process.env.PUBLIC_URL + '/'} render={renderLanding} />
              <Route exact path={process.env.PUBLIC_URL + '/login'} render={renderLogin} />
              <Route exact path={process.env.PUBLIC_URL + '/signup'} render={renderSignup} />
              <Route exact path={process.env.PUBLIC_URL + '/schedule'} render={renderSchedule} />
              <Route exact path={process.env.PUBLIC_URL + '/trainers'} render={renderTrainers} />
              <Route exact path={process.env.PUBLIC_URL + '/clients'} render={renderClients} />
              <Route exact path={process.env.PUBLIC_URL + '/clients/edit/:id'} render={renderClients} />
              <Route exact path={process.env.PUBLIC_URL + '/trainers/edit/:id'} render={renderTrainers} />
              <Route exact path={process.env.PUBLIC_URL + '/packages'} render={renderPackages} />
              <Route exact path={process.env.PUBLIC_URL + '/settings'} render={renderSettings} />
              <Route exact path={process.env.PUBLIC_URL + '/profile/:id'} render={renderProfile} />
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
        loading: state.app.loading
    }
}

export default connect(msp)(withRouter(MainBody))

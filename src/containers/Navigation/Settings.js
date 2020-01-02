import React, { Component } from 'react';
import { Label, Grid, Segment} from 'semantic-ui-react';
import { connect } from 'react-redux'

// import { } from '../../helpers/generalHelpers'

class Settings extends Component {

  state = {
      email: this.props.user.email,
      dob: this.props.user.dob,
      gender: this.props.user.gender,

  }


  render(){
    return (
      <Grid columns={3}>
          <Grid.Row>
            <Segment>
                <Label attached="top">Account</Label>
            </Segment>
            <Segment>
                <Label attached="top">Profile</Label>
            </Segment>
            {this.props.user.type === "Manager"  ?
            <Segment>
                <Label attached="top">System Settings</Label>
            </Segment>
            : null }
          </Grid.Row>
      </Grid>
      
    )
  }
}

const msp = (state) => {
  return {
    user: state.user.user,
    allTrainers: state.user.allTrainers,
    allSessions: state.schedule.allSessions,
    allClients: state.user.allClients,
    clientPackages: state.app.clientPackages
  }
}

export default connect(msp)(Settings);
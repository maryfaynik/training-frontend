import React, { Component } from 'react';
import { Card, Feed, Statistic } from 'semantic-ui-react';
import { connect } from 'react-redux'

class Landing extends Component {

  state = {
  }
  
  getSessionStats = () => {
    let monthSessions = this.props.allSessions.filter(session => new Date(session.daytime).getMonth() === new Date(Date.now()).getMonth())
  }

  render(){
    this.getSessionStats()
    return (
      <div>
        
          <Card>
            <Card.Content>
              <Card.Header>This Month</Card.Header>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label image='/images/avatar/small/jenny.jpg' />
                  <Feed.Content>
                    <Feed.Date content='Top Trainer' />
                    <Feed.Summary>
                      Someone's name and the number of sessions
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
  
                <Feed.Event>
                  <Feed.Label image='/images/avatar/small/molly.png' />
                  <Feed.Content>
                    <Feed.Date content='Top Client' />
                    <Feed.Summary>
                      Someone's name and session count
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
  
              </Feed>
            </Card.Content>
          </Card>

          <Statistic.Group horizontal size='tiny'>
            <Statistic size='tiny'>
              <Statistic.Value>506</Statistic.Value>
              <Statistic.Label>Total Sessions</Statistic.Label>
            </Statistic>
            <Statistic size='tiny'>
              <Statistic.Value>32</Statistic.Value>
              <Statistic.Label>New Clients</Statistic.Label>
            </Statistic>
            <Statistic size='tiny'>
              <Statistic.Value>256</Statistic.Value>
              <Statistic.Label>Sessions Sold</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        
      </div>
    )
  }
}

const msp = (state) => {
  return {
    allTrainers: state.user.allTrainers,
    allSessions: state.schedule.allSessions,
    allClients: state.user.allClients
  }
}

export default connect(msp)(Landing);
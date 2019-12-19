import React, { Component } from 'react';
import { Card, Feed } from 'semantic-ui-react';
import { connect } from 'react-redux'

class Landing extends Component {

  state = {
  }
  
  getSessionStats = () => {
    console.log("here, props= ", this.props)
    let monthSessions = this.props.allSessions.filter(session => new Date(session.daytime).getMonth() === new Date(Date.now()).getMonth())
    console.log("month sessions = ", monthSessions)
  }

  render(){
    this.getSessionStats()
    return (
      <div>
          WHAT?
          <Card>
            <Card.Content>
              <Card.Header>This Month</Card.Header>
            </Card.Content>
            <Card.Content>
              <Feed>
                <Feed.Event>
                  <Feed.Label image='/images/avatar/small/jenny.jpg' />
                  <Feed.Content>
                    <Feed.Date content='1 day ago' />
                    <Feed.Summary>
                      You added <a>Jenny Hess</a> to your <a>coworker</a> group.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
  
                <Feed.Event>
                  <Feed.Label image='/images/avatar/small/molly.png' />
                  <Feed.Content>
                    <Feed.Date content='3 days ago' />
                    <Feed.Summary>
                      You added <a>Molly Malone</a> as a friend.
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
  
              </Feed>
            </Card.Content>
          </Card>
  
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
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Feed, Statistic, Divider, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux'

import { getTopPerformer, isNewClient, getTimes, getFullName, getSessionsSold} from '../../helpers/generalHelpers'

import Loading from './Loading'

// class ManagerDash extends Component {
const ManagerDash = (props) => {
//   state = {
//       times: getTimes()
//   }

    let [times, setTimes] = useState([])
  
    useEffect(() => {
        setTimes(getTimes())
    },[] )
    
    const getSessionStats = (backDate) => {
        return {
            topTrainer: getTopPerformer(props.allTrainers, backDate),
            sessions: props.allSessions.filter(session => new Date(session.daytime) >= new Date(backDate) && session.status === "complete"),
            topClient: getTopPerformer(props.allClients, backDate),
            newClients: props.allClients.filter(client => isNewClient(client, backDate)),
            sessionsSold: getSessionsSold(props.clientPackages.filter(cp => new Date(cp.created_at) >= new Date(backDate)))
        }

    }

    const renderStats = (backDate, time) => {
        let stats = !props.loading ? getSessionStats(backDate) : []
        return (
            <Grid.Column key={time}>
                <Card className={"dash-card"}>
                    <Card.Content>
                    <Card.Header>This {`${time}`}</Card.Header>
                    </Card.Content>
                    <Card.Content>
                    { props.loading ? 
                        <Loading inverted={true} nonsegment={true}/>
                    :
                        <Feed>
                            <Feed.Event>
                                <Feed.Content>
                                <Feed.Summary>
                                    <Statistic.Group horizontal size='tiny'>
                                        <Statistic size='tiny'>
                                            <Statistic.Value>{stats.sessions.length}</Statistic.Value>
                                            <Statistic.Label>Total Sessions</Statistic.Label>
                                        </Statistic>
                                        <Statistic size='tiny'>
                                            <Statistic.Value>{stats.newClients.length}</Statistic.Value>
                                            <Statistic.Label>New Clients</Statistic.Label>
                                        </Statistic>
                                        <Statistic size='tiny'>
                                            <Statistic.Value>{stats.sessionsSold}</Statistic.Value>
                                            <Statistic.Label>Sessions Sold</Statistic.Label>
                                        </Statistic>
                                    </Statistic.Group>
                                </Feed.Summary>
                                </Feed.Content>
                            </Feed.Event>
                            <Divider/>
                            <Feed.Event>
                            <Feed.Content>
                                <Feed.Summary>
                                    <b>Top Trainer</b>: <a href={`/profile/${stats.topTrainer.user.id}`}>{getFullName(stats.topTrainer.user)}</a>
                                </Feed.Summary>
                                <Feed.Extra>{stats.topTrainer.sessions} sessions</Feed.Extra>
                            </Feed.Content>
                            </Feed.Event>
                            <Divider/>
                            <Feed.Event>
                            <Feed.Content>
                            <Feed.Summary>
                                    <b>Top Client</b>: <a href={`/profile/${stats.topClient.user.id}`}>{getFullName(stats.topClient.user)}</a>
                                </Feed.Summary>
                                <Feed.Extra>{stats.topClient.sessions} sessions</Feed.Extra>
                            </Feed.Content>
                            </Feed.Event>
                        </Feed> 
                    }
                    </Card.Content>
                </Card> 
            </Grid.Column> 
            
        )
    }

    const renderTimes = () => {
        return Object.keys(times).map( key => renderStats(times[key], key))    
    }     

    
    return ( 
        <Grid columns={3}>
            <Grid.Row>
                {renderTimes()}
            </Grid.Row>
        </Grid>
    )
  
}

const msp = (state) => {
  return {
    allTrainers: state.user.allTrainers,
    allSessions: state.schedule.allSessions,
    allClients: state.user.allClients,
    clientPackages: state.app.clientPackages,
    loading: state.app.loading
  }
}

export default connect(msp)(ManagerDash)
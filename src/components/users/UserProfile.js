import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import {Button, Grid, Image, Header, Segment, Label, List} from 'semantic-ui-react';

import {getFullName, getAge, getUserFromId} from '../../helpers/generalHelpers'

// import {API} from '../../App' 

const UserProfile = (props) => {

    // state = {
    //     path: props.user.user_type === "Trainer" ? "trainers" : "clients",
    //     errors: []
    // }
    let [path, setPath] = useState(props.user.user_type === "Trainer" ? "trainers" : "clients")
    let [errors, setErrors] = useState([])


    const renderUserList = (users) =>{
        if(!users) return <li>No Trainers</li>
        return users.map(id => {
            return <List.Item key={id}><Link to={`/profile/${id}`}>{getFullName(getUserFromId(id, props.allUsers))}</Link></List.Item>
        })
    }

    const renderPackages = (packages) => {
        if(!packages) return <li>No Packages Yet!</li>
        return packages.map(pack =>{
            return <List.Item key={pack.id}>{pack.package.title} ({pack.session_count} / {pack.package.session_count} remaining) </List.Item>
        })
    }

    const renderClient = () => {
        let {user} = props 
        return <Fragment>
            <Grid.Row><Grid.Column>
                <Segment>
                    <Label attached="top">Info</Label>
                    <Header as="h3">{user.gender}, {getAge(user)} years old</Header>
                </Segment>
            </Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>
                <Segment className="profile-segment">
                    <Label attached="top">Trainers</Label>
                    <List>{renderUserList(user.trainers)}</List>
                </Segment>
                </Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>
                <Segment className="profile-segment">
                    <Label attached="top">Packages</Label>
                    <List>{renderPackages(user.client_packages)}</List>
                </Segment>
            </Grid.Column></Grid.Row>
        </Fragment>
    }

    const renderTrainer = () => {
        let {user} = props 
        return <Fragment>
                <Grid.Row><Grid.Column>
                    <Segment>
                        <Label attached="top">Info</Label>
                        <Header as="h3">{user.gender}, {user.level.name} trainer</Header>
                    </Segment>
                </Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column>
                    <Segment className="profile-segment">
                        <Label attached="top">Clients</Label>
                        <List>{renderUserList(user.clients)}</List>
                    </Segment>
                    </Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column>
                    
                </Grid.Column></Grid.Row>
            </Fragment>
    }

    const showEdit = (e) => {
        props.history.push(`/${path}/edit/${e.target.value}`)
    }
 

    let { user, currentUser} = props

    return (
        
        <div className="user-profile">
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column width={2}><Image src='/img/profilepic.png' alt="Profile Pic" size='large' /></Grid.Column>
                    <Grid.Column width={8}><Header as="h1">{getFullName(user)}</Header></Grid.Column>
                </Grid.Row>
                {user.user_type === "Trainer" ? renderTrainer() : renderClient()} 
                <Grid.Row colums={1}>
                    { currentUser.id === user.id || currentUser.user_type === "Manager" ? <Button value={user.id} onClick={showEdit}>Edit</Button> : null }
                    <Button  onClick={() => props.history.goBack()}>Back</Button>
                </Grid.Row>
            </Grid>
        </div>
    )
    
}

const msp = (state) => {
    return {
        currentUser: state.user.user,
        allUsers: [...state.user.allTrainers, ...state.user.allClients]
    }
}
export default connect(msp)(withRouter(UserProfile));



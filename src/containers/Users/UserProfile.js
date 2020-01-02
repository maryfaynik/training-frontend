import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import {Button, Grid, Image, Header, Segment, Label, List} from 'semantic-ui-react';

import {getFullName, getAge, getUserFromId} from '../../helpers/generalHelpers'

import {API} from '../../App'

class UserProfile extends Component {

    state = {
        path: this.props.user.type === "Trainer" ? "trainers" : "clients",
        errors: []
    }


    renderUserList(users){
        if(!users) return <li>No Trainers</li>
        return users.map(id => {
            return <List.Item key={id}><Link to={`/profile/${id}`}>{getFullName(getUserFromId(id, this.props.allUsers))}</Link></List.Item>
        })
    }

    renderPackages(packages){
        if(!packages) return <li>No Packages Yet!</li>
        return packages.map(pack =>{
            return <List.Item key={pack.id}>{pack.package.title} ({pack.session_count} / {pack.package.session_count} remaining) </List.Item>
        })
    }

    renderClient = () => {
        let {user} = this.props 
        return <Fragment>
            <Grid.Row><Grid.Column>
                <Segment>
                    <Label attached="top">Info</Label>
                    <Header as="h3">{user.gender}, {getAge(user)} years old</Header>
                </Segment>
            </Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>
                <Segment>
                    <Label attached="top">Trainers</Label>
                    <List>{this.renderUserList(user.trainers)}</List>
                </Segment>
                </Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>
                <Segment>
                    <Label attached="top">Packages</Label>
                    <List>{this.renderPackages(user.client_packages)}</List>
                </Segment>
            </Grid.Column></Grid.Row>
        </Fragment>
    }

    renderTrainer = () => {
        let {user} = this.props 
        return <Fragment>
                <Grid.Row><Grid.Column>
                    <Segment>
                        <Label attached="top">Info</Label>
                        <Header as="h3">{user.gender}, {user.level.name} trainer</Header>
                    </Segment>
                </Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column>
                    <Segment>
                        <Label attached="top">Clients</Label>
                        <List>{this.renderUserList(user.clients)}</List>
                    </Segment>
                    </Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column>
                    
                </Grid.Column></Grid.Row>
            </Fragment>
    }

    showEdit = (e) => {
        let {user} = this.props
        this.props.history.push(`/${this.state.path}/edit/${e.target.value}`)
    }
 
    render(){
        let { user, currentUser} = this.props

        return (
            
            <div className="user-profile">
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={2}><Image src='/img/profilepic.png' alt="Profile Pic" size='large' /></Grid.Column>
                        <Grid.Column width={8}><Header as="h1">{getFullName(user)}</Header></Grid.Column>
                    </Grid.Row>
                    {user.type === "Trainer" ? this.renderTrainer() : this.renderClient()} 
                    <Grid.Row colums={1}>
                        { currentUser.id === user.id || currentUser.type === "Manager" ? <Button value={user.id} onClick={this.showEdit}>Edit</Button> : null }
                        <Button  onClick={() => this.props.history.goBack()}>Back</Button>
                    </Grid.Row>
                </Grid>
            </div>
        )
    
    }
    
}

const msp = (state) => {
    return {
        currentUser: state.user.user,
        allUsers: [...state.user.allTrainers, ...state.user.allClients]
    }
}
export default connect(msp)(withRouter(UserProfile));



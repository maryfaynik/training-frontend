import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Button, Card, Menu, Input} from 'semantic-ui-react';

import {getFullName, getAge, getLevelOptions} from '../../helpers/generalHelpers'
import { deleteUser} from '../../actions/actions'
import UserForm from './UserForm.js'
import Loading from '../../components/Loading'
import {API} from '../../App'

const defaultUser = {
    first_name: "",
    last_name: "",
    dob: new Date(),
    email: "",
    phone: "",
    level: {
        id: ""
    },
}

class UsersContainer extends Component {

    state = {
        showForm: this.props.showForm,
        enterNew: this.props.enterNew,
        editUser: this.props.editUser ? this.props.editUser : defaultUser,
        errors: [],
        path: this.props.userType.toLowerCase() + "s",
        searchName: ""
    }

    deleteUser = (e) => {
        //eslint-disable-next-line
        if(!confirm("Are you sure you want to delete this user?")) return 
        
        let id = e.target.value
        fetch(`${API}/${this.state.path}/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
        }).then (resp => resp.json())
            .then(data => {
                if(data.errors){
                    this.setState({
                        errors: data.errors.errors,
                    });
                }else{
                    this.goBack(true)
                    this.props.deleteUser(id, `${this.props.userType}`)
                }
            })
    }

    //Form Actions -------------------

    viewProfile = (e) => {
        this.props.history.push(`/profile/${e.target.value}`)
    }

    goBack = () => {
        if(this.props.back){
            this.props.history.goBack()
        }else{
            this.setState({
                showForm: false,
                enterNew: true,
                editUser: defaultUser,
                errors: []
            })

        }
    }

    toggleForm = (e) => {
        let editUser = defaultUser
        let enterNew = true
        if(!!e && e.target.value ){
            editUser = this.props.allUsers.find(u => u.id === parseInt(e.target.value))
            enterNew = false
        }
        this.setState({
            showForm: !this.state.showForm,
            editUser: editUser,
            enterNew: enterNew,
            errors: []
        })
    }

    // SEARCH actions ----------------------
    handleSearchChange = (e) => {
        this.setState({
            searchName: e.target.value
        })
    }

    // RENDERS ------------------------------

    renderForm(){
        if(this.state.enterNew){
            return <UserForm isNew={true} editUser={this.state.editUser} toggleForm={this.toggleForm} levelOptions={getLevelOptions(this.props.levels)} goBack={this.goBack} userType={this.props.userType}/>
        }else{
            return <UserForm deleteUser={this.deleteUser} isNew={false} editUser={this.state.editUser} toggleForm={this.toggleForm} levelOptions={getLevelOptions(this.props.levels)} goBack={this.goBack} userType={this.props.userType}/>
        }
    }

    renderAddButton(){
        return (this.props.userType === "Trainer" ? 
            <p><Button onClick={this.toggleForm}>Add A Trainer</Button></p>
            : <p><Button onClick={this.toggleForm}>Add A Client</Button></p>
        )
    }

    renderUsers = () => {
        const currentUser = this.props.user
        const type = this.props.userType
   
        //sort the users alphabetically and filter if needed
        let all = this.props.allUsers
        all.sort((a, b) => a.last_name.localeCompare(b.last_name))

        if(this.state.searchName !== ""){
            let key = this.state.searchName.toLowerCase()
            all = all.filter(user => getFullName(user).toLowerCase().includes(key))
        }

        // Display all users
        if( !this.state.editForm && !this.state.addForm){
            return all.map(user => {
                return (
                    <Card key={user.id}>
                        <Card.Content>
                            {/* <Image
                            floated='right'
                            size='mini'
                            src='/images/avatar/large/steve.jpg'
                            /> */}
                            <Card.Header>{getFullName(user)}</Card.Header>
                            { type === "Trainer" ? 
                                <Card.Meta>{user.level.name} Trainer</Card.Meta>
                            :
                                <Card.Meta>{user.gender}, {getAge(user)} years</Card.Meta>
                            }
                            <Card.Description>
                                
                            </Card.Description>
                        </Card.Content>
                        
                            <Card.Content extra>
                                <div>
                                {currentUser.type === "Manager" ? 
                                    <Fragment>
                                    <Button value={user.id} onClick={this.toggleForm}>Edit</Button> 
                                    </Fragment>
                                : null }
                                <Button value={user.id} onClick={this.viewProfile}>View Profile</Button>
                                </div>
                            </Card.Content>
                    </Card>
                )
            })

        }else{
            return null
        }
    }

    // RENDER --------------------------------
    render(){

        return (
            
            <div className="train-container">
                {this.state.showForm ?  this.renderForm() : null}
                {this.renderAddButton()}
                <Menu.Item>
                    <Input icon='search' placeholder='Search by Name...'
                        onChange={this.handleSearchChange} />
                </Menu.Item>
                <p></p>
                {this.props.allLoading ? 
                <Loading/> 
                : 
                <Card.Group>
                    {this.renderUsers()}
                </Card.Group>
                }
            
            
            </div>
        )
        
    }
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        allTrainers: state.user.allTrainers,
        allClients: state.user.allClients,
        levels: state.app.levels,
        allLoading: state.app.allLoading
    }
}
export default connect(msp, {deleteUser})(withRouter(UsersContainer));



import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Button, Card, Menu, Input} from 'semantic-ui-react';

import {getFullName, getAge} from '../../helpers/generalHelpers'
import {updateUser, deleteUser} from '../../actions/actions'
import AddTrainerForm from './AddTrainerForm.js'
import AddClientForm from './AddTrainerForm.js'
import EditClientForm from '../../components/Users/EditClientForm'
import EditTrainerForm from '../../components/Users/EditTrainerForm'
import {API} from '../../App'

import { getLevelOptions } from '../../helpers/generalHelpers'
class UsersContainer extends Component {

    state = {
        addForm: false,
        editForm: false,
        editUser: {},
        errors: [],
        path: this.props.userType.toLowerCase() + "s",
        searchName: ""
    }

    goBack = () => {
        this.setState({
            addForm: false,
            editForm: false,
            editUser: {},
            errors: []
        })
    }

    deleteUser = (e) => {
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
                    this.props.deleteUser(id, `${this.props.userType}`)
                }
            })
    }

    // EDIT FORM ACTIONS -------------------

    updateEditUser = (key, value) => {
        this.setState({
            editUser: {
                ...this.state.editUser,
                [key]: value
            }
        })
    }

    toggleEditForm = (e) => {
        let selectedUser = {}
        if(!this.state.editUser.id){
            selectedUser = this.props.all.find(u => u.id === parseInt(e.target.value))
        }
        
        this.setState({
            editForm: !this.state.editForm,
            addForm: false,
            editUser: selectedUser,
            errors: []
        })
    }

    submitEdit = () => {
        let updatedUser = {
            user: {
                id: this.state.editUser.id,
                first_name: this.state.editUser.first_name,
                last_name: this.state.editUser.last_name,
                dob: this.state.editUser.dob,
                email: this.state.editUser.email,
                phone: this.state.editUser.phone
            }
        }

        fetch(`${API}/${this.state.path}/${this.state.editUser.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(updatedUser)
        }).then (resp => resp.json())
            .then(data => {
                if(data.errors){
                    this.setState({
                        errors: data.errors.errors,
                    });
                }else{
                    this.toggleEditForm()
                    this.props.updateUser(data.user, `${this.props.userType}`)
                }
            })
    }

    
    // New Form Actions -------------------

    toggleNewForm = (e) => {
        this.setState({
            addForm: !this.state.addForm,
            editForm: false,
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
    renderAddForm(){
        return (this.props.userType === "Trainer" ? 
            <AddTrainerForm toggleForm={this.toggleNewForm} levelOptions={this.getLevelOptions()} goBack={this.goBack}/>
            : <AddClientForm toggleForm={this.toggleNewForm} goBack={this.goBack}/> 
        )
    }

    renderAddButton(){
        return (this.props.userType === "Trainer" ? 
            <p><Button onClick={this.toggleNewForm}>Add A Trainer</Button></p>
            : <p><Button onClick={this.toggleNewForm}>Add A Client</Button></p>
        )
    }

    renderEditForm(){
        return (this.props.userType === "Trainer" ? 
            <EditTrainerForm trainer={this.state.editUser} errors={this.state.errors} 
            levelOptions={getLevelOptions(this.props.levels)} 
            updateEditTrainer={this.updateEditUser} 
            submitEdit={this.submitEdit} goBack={this.goBack}/> 
            : 
            <EditClientForm client={this.state.editUser} errors={this.state.errors} 
                updateEditClient={this.updateEditUser} 
                submitEdit={this.submitEdit} goBack={this.goBack}/> 
        )
    }

    renderUsers = () => {
        const type = this.props.userType
        let all = this.props.all
        if(this.state.searchName !== ""){
            let key = this.state.searchName.toLowerCase()
            all = all.filter(user => getFullName(user).toLowerCase().includes(key))
        }
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
                                This will be bio!
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div>
                            <Button value={user.id} onClick={this.toggleEditForm}>Edit</Button>
                            <Button value={user.id} onClick={this.deleteUser}>Delete</Button>
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
                {this.state.addForm ?  this.renderAddForm() : null}
                {this.state.editForm ? this.renderEditForm() : null }   
                {this.renderAddButton()}
                <Menu.Item>
                    <Input icon='search' placeholder='Search by Name...'
                        onChange={this.handleSearchChange} />
                </Menu.Item>
                <p></p>
                <Card.Group>
                    {this.renderUsers()}
                </Card.Group>
                
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
    }
}
export default connect(msp, {updateUser, deleteUser})(withRouter(UsersContainer));



import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Button, Card, Menu, Input, Confirm} from 'semantic-ui-react';

import {getFullName, getAge, getLevelOptions} from '../../helpers/generalHelpers'
import { deleteUser} from '../../actions/actions'
import UserForm from './UserForm'
import UserModal from './UserModal'
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
    }
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

    handleConfirm = () => {
        this.setState({
            confirmOpen: false,
            confirmDelete: true
        })
    }
    handleConfirmDelete = () => {
        this.setState({
            confirmOpen: false,
            confirmDelete: false
        })
    }

    handleDeleteUser = (e) => {
    
        //eslint-disable-next-line
        if(!window.confirm("are you sure you want to delete this user?")) return 

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
               
                let user = [...this.props.allTrainers, ...this.props.allClients].find(user => user.id === parseInt(id))
                this.props.deleteUser(user)
                this.goBack(true)
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
            return <UserForm handleDeleteUser={this.handleDeleteUser} isNew={false} editUser={this.state.editUser} toggleForm={this.toggleForm} levelOptions={getLevelOptions(this.props.levels)} goBack={this.goBack} userType={this.props.userType}/>
        }
    }

    renderAddButton(){
        return  <p>
            <Button onClick={this.toggleForm}>{`Add ${this.props.userType}`}</Button>
        </p> 
    
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
                                {currentUser.user_type === "Manager" ? 
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

                <Confirm open={this.state.confirmOpen} onCancel={this.handleConfirmDelete} onConfirm={this.handleConfirm}
                    content='Do you really want to delete this user?'
                    header='Are you sure?'
                    />

                <p></p>
                {this.props.loading ? 
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
        loading: state.app.loading
    }
}

const mdp = (dispatch) => {
    return {
        deleteUser: (user) => dispatch(deleteUser(user, dispatch)),
    }
}

export default connect(msp, mdp)(withRouter(UsersContainer));



import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { getFullName } from '../../helpers/generalHelpers'
import { Button } from 'semantic-ui-react';

import {updateUser, deleteUser} from '../../actions/actions'

import AddClientForm from './AddClientForm.js'
import EditClientForm from '../../components/Users/EditClientForm'

import {API} from '../../App'

class ClientsContainer extends Component {

    state = {
        addForm: false,
        editForm: false,
        editClient: {},
        errors: []
    }

    goBack = () => {
        this.setState({
            addForm: false,
            editForm: false,
            editClient: {},
            errors: []
        })
    }

    renderClients = () => {
        if( !this.state.editForm && !this.state.addForm){
            return this.props.allClients.map(client => {
                return <li key={client.id}>
                    {getFullName(client)}
                    <Button value={client.id} onClick={this.toggleEditForm}>Edit</Button>
                    <Button value={client.id} onClick={this.deleteUser}>Delete</Button>
                    </li>
            })
        }else{
            return null
        }
    }

    // EDIT FORM ACTIONS -------------------

    deleteUser = (e) => {
        let id = e.target.value
        fetch(`${API}/clients/${id}`, {
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
                    this.props.deleteUser(id, "Client")
                }
            })
    }

    updateEditClient = (key, value) => {
        this.setState({
            editClient: {
                ...this.state.editClient,
                [key]: value
            }
        })
    }

    toggleEditForm = (e) => {
        let train = {}
        if(!this.state.editClient.id){
            train = this.props.allClients.find(t => t.id === parseInt(e.target.value))
        }
        
        this.setState({
            editForm: !this.state.editForm,
            addForm: false,
            editClient: train,
            errors: []
        })
    }

    submitEdit = () => {

        console.log("submitting and editClient = ", this.state.editClient)
        let updatedClient = {
            user: {
                id: this.state.editClient.id,
                first_name: this.state.editClient.first_name,
                last_name: this.state.editClient.last_name,
                dob: this.state.editClient.dob,
                email: this.state.editClient.email,
                phone: this.state.editClient.phone
            }
        }

        fetch(`${API}/clients/${this.state.editClient.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(updatedClient)
        }).then (resp => resp.json())
            .then(data => {
                console.log("got back: ",data)
                if(data.errors){
                    this.setState({
                        errors: data.errors.errors,
                    });
                }else{
                    this.toggleEditForm()
                    this.props.updateUser(data.user, "Client")
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

    // RENDER --------------------------------
    render(){

        return (
            
            <div className="train-container">
                {this.state.addForm ? 
                    <AddClientForm toggleForm={this.toggleNewForm} goBack={this.goBack}/> 
                : 
                    <Button onClick={this.toggleNewForm}>Add A Client</Button>
                }
                {this.state.editForm ? 
                    <EditClientForm client={this.state.editClient} errors={this.state.errors} 
                                    updateEditClient={this.updateEditClient} 
                                    submitEdit={this.submitEdit} goBack={this.goBack}/> 
                : null }

                <ul>{this.renderClients()}</ul>
                
            </div>
        )
        
    }
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        allClients: state.user.allClients
    }
}
export default connect(msp, {updateUser, deleteUser})(withRouter(ClientsContainer));



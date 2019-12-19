import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Button, Card} from 'semantic-ui-react';

import {getFullName} from '../../helpers/generalHelpers'
import {updateUser, deleteUser} from '../../actions/actions'
import AddTrainerForm from './AddTrainerForm.js'
import EditTrainerForm from '../../components/Users/EditTrainerForm'
import {API} from '../../App'

class TrainersContainer extends Component {

    state = {
        addForm: false,
        editForm: false,
        editTrainer: {},
        errors: []
    }

    goBack = () => {
        this.setState({
            addForm: false,
            editForm: false,
            editTrainer: {},
            errors: []
        })
    }

    getLevelOptions = () => {

        return this.props.levels.map(level => {
            return {
                key: level.id,
                value: level.id,
                text: level.name
            }
        })
    }

    renderTrainers = () => {
        if( !this.state.editForm && !this.state.addForm){
            return this.props.allTrainers.map(trainer => {
                return (
                    <Card key={trainer.id}>
                        <Card.Content>
                            {/* <Image
                            floated='right'
                            size='mini'
                            src='/images/avatar/large/steve.jpg'
                            /> */}
                            <Card.Header>{getFullName(trainer)}</Card.Header>
                            <Card.Meta>{trainer.level.name} Trainer</Card.Meta>
                            <Card.Description>
                                This will be bio!
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                            <Button value={trainer.id} onClick={this.toggleEditForm}>Edit</Button>
                            <Button value={trainer.id} onClick={this.deleteTrainer}>Delete</Button>
                            </div>
                        </Card.Content>
                    </Card>
                )
            })

        }else{
            return null
        }
    }

    // EDIT FORM ACTIONS -------------------

    deleteTrainer = (e) => {
        let id = e.target.value
        console.log('trainer id = ', id)
        fetch(`${API}/trainers/${id}`, {
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
                    this.props.deleteUser(id, "Trainer")
                }
            })
    }

    updateEditTrainer = (key, value) => {
        this.setState({
            editTrainer: {
                ...this.state.editTrainer,
                [key]: value
            }
        })
    }

    toggleEditForm = (e) => {
        let train = {}
        if(!this.state.editTrainer.id){
            train = this.props.allTrainers.find(t => t.id === parseInt(e.target.value))
        }
        
        this.setState({
            editForm: !this.state.editForm,
            addForm: false,
            editTrainer: train,
            errors: []
        })
    }

    submitEdit = () => {

        console.log("submitting and editTrainer = ", this.state.editTrainer)
        let updatedTrainer = {
            user: {
                id: this.state.editTrainer.id,
                first_name: this.state.editTrainer.first_name,
                last_name: this.state.editTrainer.last_name,
                dob: this.state.editTrainer.dob,
                email: this.state.editTrainer.email,
                phone: this.state.editTrainer.phone
            }
        }

        fetch(`${API}/trainers/${this.state.editTrainer.id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(updatedTrainer)
        }).then (resp => resp.json())
            .then(data => {
                console.log("got back: ",data)
                if(data.errors){
                    this.setState({
                        errors: data.errors.errors,
                    });
                }else{
                    this.toggleEditForm()
                    this.props.updateUser(data.user, "Trainer")
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
        console.log("level options: ", this.getLevelOptions())
        return (
            
            <div className="train-container">
                {this.state.addForm ? 
                    <AddTrainerForm toggleForm={this.toggleNewForm} levelOptions={this.getLevelOptions()} goBack={this.goBack}/> 
                : 
                    <p><Button onClick={this.toggleNewForm}>Add A Trainer</Button></p>
                }
                {this.state.editForm ? 
                    <EditTrainerForm trainer={this.state.editTrainer} errors={this.state.errors} 
                                    levelOptions={this.getLevelOptions()} 
                                    updateEditTrainer={this.updateEditTrainer} 
                                    submitEdit={this.submitEdit} goBack={this.goBack}/> 
                : null }
                <Card.Group>
                    {this.renderTrainers()}
                </Card.Group>
                
            </div>
        )
        
    }
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        allTrainers: state.user.allTrainers,
        levels: state.app.levels,
    }
}
export default connect(msp, {updateUser, deleteUser})(withRouter(TrainersContainer));



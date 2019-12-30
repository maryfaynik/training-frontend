import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button} from 'semantic-ui-react';

import {addPackage, updatePackage, deletePackage} from '../../actions/actions'
import { getLevelOptions } from '../../helpers/generalHelpers';

import {API} from '../../App'

class AddEditPackageForm extends Component {

    state = {
        id: -1,
        title: "",
        price: 0.0,
        level_id: -1,
        exp_weeks: 0,
        session_count: 0,
        errors: []
    }

    componentDidMount(){
        if(!this.props.isNew){
            let pack = this.props.editPack
            console.log("edit pack = ", pack)
             this.setState({
                 id: pack.id,
                 title: pack.title,
                 price: pack.price,
                 level_id: pack.level.id,
                 exp_weeks: pack.exp_weeks,
                 session_count: pack.session_count,
             })
        }
    }

    handleChange = (e, {value, name}) => {
        if(e.target.value){
            value = e.target.value
            name = e.target.name
        }

        this.setState({
            [name]: value
        })
    }

    handleSubmit = (e) =>{
        console.log("submitting package")
        e.preventDefault()
    
        const {isNew} = this.props

        // clet level = this.props.levels.find(level => level.id === this.state.level_id)
  
        let newPackage = {
            package: {
                title: this.state.title,
                price: this.state.price,
                level_id: this.state.level_id,
                exp_weeks: this.state.exp_weeks,
                session_count: this.state.session_count,
            }
        }

        console.log("newPackage ", newPackage)
        
        if(false){
            this.setState({
                errors: [ "Problemo"]
            })
        }else{
           
            let url = isNew ? "" : `/${this.state.id}`
            let method = isNew ? "POST" : "PATCH"
            
            fetch(`${API}/packages${url}`, {
                method: method,
                headers: {
                    "content-type": "application/json",
                    "accepts": "application/json"
                },
                body: JSON.stringify(newPackage)

            }).then (resp => resp.json())
                .then(data => {
    
                    if(data.errors){
                        this.setState({
                            errors: data.errors,
                        })
                    }else{
                        if(isNew){
                            console.log("adding package:", data.package)
                            this.props.addPackage(data.package)
                        }else{
                            console.log("calling update package...", data.package)
                            this.props.updatePackage(data.package)
                        }
                        this.props.toggleForm()
                    }
                })
        }
             
    }

    handleDelete = (e) =>{

        fetch(`${API}/packages/${this.state.id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            }
        })
        .then (resp => resp.json())
        .then(data => {
            if(data.errors){
                this.setState({
                    errors: data.errors,
                })
            }else{
                this.props.toggleForm()
                this.props.deletePackage(this.state.id)
            }
        })

    }

    renderErrors = () => {
        return this.state.errors.map((error, i) => <li key={i}>{error}</li>)
    }

    render(){
        console.log('rendering add/edit package form...state = ', this.state)
       
        return (
            <div className= 'outer-popup'>
            <div className="inner-popup">
                <Form className='package-form' id="package-form" value={this.state.id} onSubmit={this.handleSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Input onChange={this.handleChange} value={this.state.title} name="title" label='Title' type="text"/>
                    </Form.Group>
                    <Form.Group> 
                        <Form.Input onChange={this.handleChange} value={this.state.session_count} name="session_count" label='Number of Sessions' type="number"/>
                        <Form.Input onChange={this.handleChange} value={this.state.exp_weeks} name="exp_weeks" label='Expiration Weeks' type="number"/>
                    </Form.Group> 
                    <Form.Group>
                        <Form.Input onChange={this.handleChange} value={this.state.price} name="price" label='Price' type="number"/>
                        <Form.Select
                            onChange={this.handleChange}
                            value={this.state.level_id}
                            name="level_id"
                            label='Level'
                            options={getLevelOptions(this.props.levels)}
                            placeholder='Select Level'
                        />
                    </Form.Group>
                </Form>
                    <p>
                        <Button primary type="submit" form={"package-form"}>{this.props.isNew ? "Create Package" : "Save Changes"}</Button>
                        { this.props.isNew ? null : <Button onClick={this.handleDelete}>Delete Package</Button>}
                        <Button onClick={this.props.goBack}>Go Back</Button>
                    </p>
                    {this.state.errors.length > 0 ? <ul>{this.renderErrors()}</ul> : null}
            </div>
            </div>
        )
    }
}


export default connect(undefined, { addPackage, updatePackage, deletePackage })(withRouter(AddEditPackageForm))




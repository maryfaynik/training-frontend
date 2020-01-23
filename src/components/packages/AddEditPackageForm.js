import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Label, Header} from 'semantic-ui-react';

import {addPackage, updatePackage, deletePackage} from '../../actions/actions'
import { getLevelOptions } from '../../helpers/generalHelpers';

import {API} from '../../App'

const AddEditPackageForm = (props) => {

    // state = {
    //     id: -1,
    //     title: "",
    //     price: 0.0,
    //     level_id: -1,
    //     exp_weeks: 0,
    //     session_count: 0,
    //     errors: []
    // }

    let [id, setId] = useState(-1)
    let [price, setPrice] = useState(0.0)
    let [title, setTitle] = useState("")
    let [level_id, setLevel_id] = useState(-1)
    let [exp_weeks, setExp_weeks] = useState(0)
    let [session_count, setSession_count] = useState(0)
    let [errors, setErrors] = useState([])

    // componentDidMount(){
    useEffect(()=> {
        if(!props.isNew){
            let pack = props.editPack
             
            setId(pack.id)
            setTitle(pack.title)
            setPrice(pack.price)
            setLevel_id(pack.level.id)
            setExp_weeks(pack.exp_weeks)
            setSession_count(pack.session_count)
            
        }
    }, [])

    // const handleChange = (e, {value, name}) => {
    //     if(e.target.value){
    //         value = e.target.value
    //         name = e.target.name
    //     }

    //     setState({
    //         [name]: value
    //     })
    // }

    const handleSubmit = (e) =>{
        e.preventDefault()
    
        const {isNew} = props

        // clet level = props.levels.find(level => level.id === level_id)
  
        let newPackage = {
            package: {
                title: title,
                price: price,
                level_id: level_id,
                exp_weeks: exp_weeks,
                session_count: session_count,
            }
        }
        
        if(false){
            setErrors([ "Problemo"])
        }else{
           
            let url = isNew ? "" : `/${id}`
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
                        setErrors(data.errors)
                    }else{
                        if(isNew){
                            props.addPackage(data.package)
                        }else{

                            props.updatePackage(data.package)
                        }
                        props.toggleForm()
                    }
                })
        }
             
    }

    const handleDelete = (e) =>{

        fetch(`${API}/packages/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            }
        })
        .then (resp => resp.json())
        .then(data => {
            if(data.errors){
                setErrors(data.errors)
            }else{
                props.toggleForm()
                props.deletePackage(id)
            }
        })

    }

    const renderErrors = () => {
        return errors.map((error, i) => <li key={i}>{error}</li>)
    }


    return (
        <div className= 'outer-popup'>
        <div className="inner-popup">
            <Form className='package-form' id="package-form" value={id} onSubmit={handleSubmit}>
                <Header as="h3">{props.isNew ? "New" : "Edit"} Package</Header>
                <Form.Group >
                    <Form.Input onChange={(value) => setTitle(value)} value={title} name="title" label='Title' type="text"/>
                </Form.Group>
                <Form.Group > 
                    <Form.Input onChange={(value) => setSession_count(value)} value={session_count} name="session_count" label='Session Count' type="number"/>
                    <Form.Input onChange={(value) => setExp_weeks(value)} value={exp_weeks} name="exp_weeks" label="Expiration (weeks)" labelPosition='right' type="number"/>
                </Form.Group> 
                <Form.Group >
                    <Form.Input onChange={(value) => setPrice(value)} value={price} name="price" labelPosition='right' 
                                label="Price" type='number' placeholder='Price' icon='dollar sign' iconPosition='left'/>
                    <Form.Select
                        onChange={(value) => setLevel_id(value)}
                        value={level_id}
                        name="level_id"
                        label='Level'
                        options={getLevelOptions(props.levels)}
                        placeholder='Select Level'
                    />
                </Form.Group>
            </Form>
                <p>
                    <Button primary type="submit" form={"package-form"}>{props.isNew ? "Create Package" : "Save Changes"}</Button>
                    { props.isNew ? null : <Button onClick={handleDelete}>Delete Package</Button>}
                    <Button onClick={props.goBack}>Go Back</Button>
                </p>
                {errors.length > 0 ? <ul>{renderErrors()}</ul> : null}
        </div>
        </div>
    )
}


export default connect(undefined, { addPackage, updatePackage, deletePackage })(withRouter(AddEditPackageForm))




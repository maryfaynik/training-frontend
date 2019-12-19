import React from 'react';
import { withRouter } from 'react-router-dom'
import { Form, Button} from 'semantic-ui-react';

const EditTrainerForm = (props) => {

    const handleChange = (e) => {
        props.updateEditTrainer(e.target.name,  e.target.value)
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        props.submitEdit()
    }

    const renderErrors = () => {
        return props.errors.map(error => <li>{error}</li>)
    }

    console.log("here in form, props = ", props)

    return (
        
        <div className="add-trainer-form">
            <Form onSubmit={handleSubmit}>
                <Form.Group widths='equal'>
                    <Form.Input onChange={handleChange} value={props.trainer.first_name} name="first_name" label='First name' />
                    <Form.Input onChange={handleChange} value={props.trainer.last_name} name="last_name" label='Last name' placeholder='Last name' />
                </Form.Group>
                <Form.Group>
                    <Form.Select
                        onChange={handleChange}
                        value={props.trainer.level_id}
                        label='Level'
                        options={props.levelOptions}
                        placeholder='Select Level'
                    />
                    <Form.Input onChange={handleChange} value={new Date(props.trainer.dob).toISOString().split("T")[0]} type="date" name="dob" label='Date of Birth' placeholder='DOB' />
                </Form.Group> 
                <Form.Group>
                    <Form.Input onChange={handleChange} value={props.trainer.email} type="email" name="email" label='Email' placeholder='Email' />
                    <Form.Input onChange={handleChange} value={props.trainer.phone} type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="phone" label='Phone' placeholder='Phone' />
                </Form.Group>
                <Form.Group>
                    <Form.Button>Submit</Form.Button>
                    <Button onClick={props.goBack}>Go Back</Button>  
                </Form.Group>
                {props.errors.length > 0 ? <ul>{renderErrors()}</ul> : null}
            </Form>
        </div>
    )
    
    
}


export default withRouter(EditTrainerForm)



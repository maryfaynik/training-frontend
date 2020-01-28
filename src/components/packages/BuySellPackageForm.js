import React, { useState } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Header, Label, Segment} from 'semantic-ui-react';

import {sellPackage} from '../../actions/actions'
import ClientSearch from '../../helpers/ClientSearch'
import {getPackageOptions} from '../../helpers/generalHelpers'

import {API} from '../../App'


const BuySellPackageForm = (props) => {
    // state = {
    //     package_id: props.package.id,
    //     client_id: props.client.id,
    //     errors: []
    // }

    let [package_id, setPackage_id] = useState(props.package.id)
    let [client_id, setClient_id] = useState(props.client.id)
    let [errors, setErrors] = useState([])



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

        let pack = props.packages.find(pack => pack.id === package_id)
        let exp = new Date() 
        exp.setDate(exp.getDate() + pack.exp_weeks * 7)

        let soldPackage = {
            client_package: {
                client_id: client_id,
                package_id: package_id,
                session_count: pack.session_count,
                expiration: exp
            }
        }
        
        if(false){
            setErrors([ "Problemo"])
        }else{
        
            fetch(`${API}/client_packages`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accepts": "application/json"
                },
                body: JSON.stringify(soldPackage)

            }).then (resp => resp.json())
                .then(data => {
    
                    if(data.errors){
                        setErrors(data.errors)
                    }else{
                        props.sellPackage(data.client_package)
                        props.toggleForm()
                    }
                })
        }
             
    }

    const renderErrors = () => {
        return errors.map((error, i) => <li key={i}>{error}</li>)
    }
       
    return (
        <div className= 'outer-popup'>
        <div className="inner-popup">
            <Header as={'h1'}>{props.selling ? "Sell" : "Buy"} Package</Header>
            <Form className='sell-package-form' id="sell-package-form" onSubmit={handleSubmit}>
                <Form.Group>
                    <Segment>
                        <Label attached="top">Client</Label>
                        <ClientSearch client_id={client_id} clients={props.allClients} setClient={(id) => setClient_id(id)}/>

                    </Segment>
                </Form.Group>
                <Form.Group>  
                    <Segment>
                        <Label attached="top">Package</Label> 
                        <Form.Select
                            onChange={(e, {value}) => setPackage_id(value)}
                            value={package_id}
                            name="package_id"
                            options={getPackageOptions(props.packages)}
                            placeholder='Select Package'
                        />
                    </Segment>
                </Form.Group>
            </Form>
                <p>
                    <Button primary type="submit" form={"sell-package-form"}>{props.selling ? "Sell Package" : "Buy Package"}</Button>
                    <Button onClick={props.goBack}>Go Back</Button>
                </p>
                {errors.length > 0 ? <ul>{renderErrors()}</ul> : null}
        </div>
        </div>
    )
}


export default connect(undefined, { sellPackage })(withRouter(BuySellPackageForm))




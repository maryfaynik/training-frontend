import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Header, Label, Segment} from 'semantic-ui-react';

import {sellPackage} from '../../actions/actions'
import ClientSearch from '../../helpers/ClientSearch'
import {getPackageOptions} from '../../helpers/generalHelpers'

import {API} from '../../App'

class BuySellPackageForm extends Component {

    state = {
        package_id: this.props.package.id,
        client_id: this.props.client.id,
        errors: []
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

        e.preventDefault()

        let pack = this.props.packages.find(pack => pack.id === this.state.package_id)
        let exp = new Date() 
        exp.setDate(exp.getDate() + pack.exp_weeks * 7)

        let soldPackage = {
            client_package: {
                client_id: this.state.client_id,
                package_id: this.state.package_id,
                session_count: pack.session_count,
                expiration: exp
            }
        }
        
        if(false){
            this.setState({
                errors: [ "Problemo"]
            })
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
                        this.setState({
                            errors: data.errors,
                        })
                    }else{
                        this.props.sellPackage(data.client_package)
                        this.props.toggleForm()
                    }
                })
        }
             
    }

    renderErrors = () => {
        return this.state.errors.map((error, i) => <li key={i}>{error}</li>)
    }

    render(){

        return (
            <div className= 'outer-popup'>
            <div className="inner-popup">
                <Header as={'h1'}>{this.props.selling ? "Sell" : "Buy"} Package</Header>
                <Form className='sell-package-form' id="sell-package-form" value={this.state.id} onSubmit={this.handleSubmit}>
                    <Form.Group>
                        <Segment>
                            <Label attached="top">Client</Label>
                            <ClientSearch client_id={this.state.client_id} clients={this.props.allClients} setClient={(id) => this.setState({client_id: id})}/>

                        </Segment>
                    </Form.Group>
                    <Form.Group>  
                        <Segment>
                            <Label attached="top">Package</Label> 
                            <Form.Select
                                onChange={this.handleChange}
                                value={this.state.package_id}
                                name="package_id"
                                options={getPackageOptions(this.props.packages)}
                                placeholder='Select Package'
                            />
                        </Segment>
                    </Form.Group>
                </Form>
                    <p>
                        <Button primary type="submit" form={"sell-package-form"}>{this.props.selling ? "Sell Package" : "Buy Package"}</Button>
                        <Button onClick={this.props.goBack}>Go Back</Button>
                    </p>
                    {this.state.errors.length > 0 ? <ul>{this.renderErrors()}</ul> : null}
            </div>
            </div>
        )
    }
}


export default connect(undefined, { sellPackage })(withRouter(BuySellPackageForm))




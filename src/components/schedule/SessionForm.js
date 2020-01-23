import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, Radio, Segment, Label, Header, Confirm} from 'semantic-ui-react';

import ClientSearch from '../../helpers/ClientSearch'
import { isAvailable, getClientPackageOptions, getFullName, capitalize} from "../../helpers/generalHelpers"
import {addSession, updateSession, cancelSession, decreaseSessionCount} from '../../actions/actions'
import {API} from '../../App'
import BuySellPackageForm from '../packages/BuySellPackageForm';

const SessionForm = (props) => {

    let [id, setId] = useState(props.editSession.id)
    let [date, setDate] = useState(props.editSession.date)
    let [time, setTime] = useState(props.editSession.time)
    let [length, setLength] = useState(props.editSession.length)
    let [trainer_id, setTrainer_id] = useState(props.editSession.trainer_id)
    let [client_id, setClient_id] = useState(props.editSession.client_id)
    let [client_package_id, setClientPackage_id] = useState(props.editSession.client_package_id)
    let [status, setStatus] = useState(props.editSession.status)
    let [showPackForm, setShowPackForm] = useState(false)
    let [errors, setErrors] = useState([])
    let [confirmOpen, setConfirmOpen] = useState(false)
    let [confirmCancel, setConfirmCancel] = useState(false)

    const handleSubmit = (e) =>{

        e.preventDefault()
    
        const {isNew} = props
        let newDate = date.split("-")
        let newTime = time.split(":")
        let dayAndTime = new Date(newDate[0], newDate[1] - 1, newDate[2], newTime[0], newTime[1])
        
        let newSession = {
            session: {
                daytime: dayAndTime,
                trainer_id: trainer_id,
                client_id: client_id,
                client_package_id: client_package_id,
                status: "scheduled",
                length: parseInt(length)
            }
        }
        
        if(!client_id || !trainer_id){
            setErrors(["Must select client and trainer!"])
            
        }else if (isNew && !client_package_id){
            setErrors(["Must select package to deduct"])
          
        } else{
            
            let client = props.allClients.find(client => client.id === client_id)
            let trainer = props.allTrainers.find(trainer => trainer.id === trainer_id)
           
            if(!isAvailable(client, props.allSessions, newSession.session.daytime, newSession.session.length, id)){
                setErrors(["The client already has a session at this time. Try another time"])
            }else if(!isAvailable(trainer, props.allSessions, newSession.session.daytime, newSession.session.length, id)){
                setErrors(["The trainer has another session at this time. Try another time or trainer"])
            }else{
                let url = isNew ? "" : `/${id}`
                let method = isNew ? "POST" : "PATCH"
                
                fetch(`${API}/sessions${url}`, {
                    method: method,
                    headers: {
                        "content-type": "application/json",
                        "accepts": "application/json"
                    },
                    body: JSON.stringify(newSession)
    
                }).then (resp => resp.json())
                .then(data => {
    
                    if(data.errors){
                        setErrors(data.errors)

                    }else{

                        // Add / Update the session in redux
                        if(isNew){
                            props.addSession(data.session)
                            // Update the number of sessions left on client's package
                            let cp = props.clientPackages.find(cp => cp.id === client_package_id)
                            let obj = {
                                session_count: cp.session_count - 1
                            }
                            
                            fetch(`${API}/client_packages/${client_package_id}`, {
                                method: "PATCH",
                                headers: {
                                    "content-type": "application/json",
                                    "accepts": "application/json"
                                },
                                body: JSON.stringify(obj)
                
                            }).then (resp => resp.json())
                                .then(data => {
                                    if(data.errors){
                                        setErrors( data.errors)
                                    }else{
                                        props.toggleForm()
                                        props.decreaseSessionCount(client_package_id)
                                    }
                                })
                        }else{
                            props.updateSession(data.session)
                            props.toggleForm()
                        }

                    }
                })
            } 
        }       
    }

    const handleConfirmCancel = () => {
        setConfirmOpen(false)
        setConfirmCancel(false)
    }

    const handleStatus = (e, status) =>{

        // if(status === "cancelled" ) return 
        console.log("here, updating status to ", status)
        let obj = {
            status: status
        }

        fetch(`${API}/sessions/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(obj)

        })
        .then (resp => resp.json())
        .then(data => {
   
            if(data.errors){
                setErrors(data.errors)
            }else{
                props.toggleForm()
                props.updateSession(data.session)
            }
        })

    }

    const renderErrors = () => {
        return errors.map((error, i) => <li key={i}>{error}</li>)
    }

    const toggleForm = (e) => {
        if(e) e.preventDefault()
        setShowPackForm(!showPackForm)
    }

    const renderPackageForm = () => {
        return (<BuySellPackageForm 
            selling={true} 
            package={{}} 
            packages={props.packages} 
            toggleForm={toggleForm} 
            goBack={toggleForm} 
            client={props.allClients.find(client => client.id === client_id)} 
            allClients={props.allClients}
            />)
    }

    const renderPackageChoices = () => {
        let packOptions = getClientPackageOptions(client_id, props.clientPackages)
        if(packOptions.length < 1 && props.isNew){
            return <Fragment>
                    <Button size="mini" secondary onClick={toggleForm}>Buy Sessions</Button>
                </Fragment>
        }
        return (<Form.Select
                    onChange={(e, {value}) => setClientPackage_id(value)}
                    value={client_package_id}
                    name="client_package_id"
                    options={packOptions}
                    placeholder='Select Package'
                />)
    }


    let {isNew} = props
    return (
        showPackForm ? renderPackageForm()
        :
        <div className= 'outer-popup'>
            <Confirm open={confirmOpen} onCancel={handleConfirmCancel} onConfirm={()=>handleStatus(undefined, "cancelled")}
            content='Do you really want to cancel this session?'
            header='Are you sure?'
            />
            <div className="inner-popup">
                <Header as="h1"> {isNew ? "Create" : "Edit"} Session</Header>
                
                
                <Form className='session-form' id="session-form" value={id} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Segment className="client-trainer-select" >
                            <b>Status: { isNew? <span className="new-session">New</span> : <span className={`${status}-session`}>{capitalize(status)}</span>}</b>
                        </Segment>
                    </Form.Group>
                    <Form.Group widths="equal">
                        {isNew ? 
                            <Segment className="client-trainer-select" >
                                <Label attached="top">Trainer</Label>
                                <Form.Select
                                    onChange={(e, {value}) => setTrainer_id(value)}
                                    value={trainer_id}
                                    name="trainer_id"
                                    options={props.trainerOptions}
                                    placeholder='Select Trainer'
                                />
                            </Segment>
                        :
                            <Segment className="client-trainer-select" >
                                <b>Trainer: </b>{getFullName(props.allTrainers.find(t => t.id === trainer_id))}
                            </Segment>
                        }
                    </Form.Group>
                    <Form.Group>
                        { isNew ? 
                                <Segment className="client-trainer-select" >
                                <Label attached="top">Client</Label>
                                <ClientSearch client_id={client_id} clients={props.allClients} setClient={(id) => setClient_id(id)}/>
                                {client_id !== undefined ? 
                                    renderPackageChoices()
                                : null}
                            </Segment>
                        :
                            <Segment className="client-trainer-select">
                                <b>Client: </b>{getFullName(props.allClients.find(c => c.id === client_id))}
                            </Segment>
                        }
                        
                    </Form.Group> 
                    
                    <Form.Group inline>
                        <Label horizontal>Date</Label>
                        <Form.Input onChange={(e)=> setDate(e.target.value)} value={new Date(date).toISOString().split("T")[0]} name="date" type="date"/>
            
                        <Label>Time</Label>
                        <Form.Input onChange={(e)=> setTime(e.target.value)} value={time} name="time" type="time"/>
                    </Form.Group>

                    <Form.Group > 
                        <Label>Length</Label>
                        <Form.Field>
                            <Radio
                                label='30 min'
                                name='length'
                                value="30"
                                checked={length === '30'}
                                onChange={()=> setLength('30')}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='60 min'
                                name='length'
                                value="60"
                                checked={length === '60'}
                                onChange={()=> setLength('30')}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='90 min'
                                name='length'
                                value="90"
                                checked={length === '90'}
                                onChange={()=> setLength('30')}
                            />
                        </Form.Field>
                    </Form.Group>                     
                </Form>
                <p>
                    { props.isNew ? null : <Button onClick={(e) => setConfirmOpen(true) }>Cancel Session</Button>}
                    { props.isNew ? null : <Button onClick={(e) => handleStatus(e, "no-show")}>Mark No-Show</Button>}
                    { props.isNew ? null : <Button onClick={(e) => handleStatus(e, "complete")}>Mark Completed</Button>}
                </p>
                <p>    
                    <Button primary type="submit" form={"session-form"}>{props.isNew ? "Book Session" : "Save Changes"}</Button>
                    <Button onClick={props.goBack}>Go Back</Button>
                </p>

                {errors.length > 0 ? <ul>{renderErrors()}</ul> : null}

            </div>
        </div>
    )
}


const msp = (state) => {
    return {
        allClients: state.user.allClients,
        allSessions: state.schedule.allSessions,
        allTrainers: state.user.allTrainers,
        clientPackages: state.app.clientPackages,
        packages: state.app.packages
    }
}

export default connect(msp, { addSession, updateSession, cancelSession, decreaseSessionCount })(withRouter(SessionForm))




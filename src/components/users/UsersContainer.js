import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Button, Card, Menu, Input, Confirm} from 'semantic-ui-react';

import {getFullName, getAge, getLevelOptions} from '../../helpers/generalHelpers'
import { deleteUser} from '../../actions/actions'
import UserForm from './UserForm'
import UserModal from '../inTheWorks/UserModal'
import Loading from '../navigation/Loading'
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

const UsersContainer = (props) => {

    // state = {
    //     showForm: props.showForm,
    //     enterNew: props.enterNew,
    //     editUser: props.editUser ? props.editUser : defaultUser,
    //     errors: [],
    //     path: props.userType.toLowerCase() + "s",
    //     searchName: ""
    // }

    let [showForm, setShowForm] = useState(props.showForm)
    let [enterNew, setEnterNew] = useState(props.enterNew)
    let [editUser, setEditUser] = useState(props.editUser ? props.editUser : defaultUser)
    let [errors, setErrors] = useState([])
    let [path, setPath] = useState(props.userType.toLowerCase() + "s")
    let [searchName, setSearchName] = useState("")
    let [confirmOpen, setConfirmOpen] = useState(false)
    let [confirmDelete, setConfirmDelete] = useState(false)

    const handleConfirm = () => {
        setConfirmOpen(false)
        setConfirmDelete(true)
    }

    const handleConfirmDelete = () => {
        setConfirmOpen(false)
        setConfirmDelete(false)
    }

    const handleDeleteUser = (e) => {
    
        //eslint-disable-next-line
        if(!window.confirm("are you sure you want to delete this user?")) return 

        let id = e.target.value
        
        fetch(`${API}/${path}/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            },
        }).then (resp => resp.json())
        .then(data => {
            if(data.errors){
                setErrors(data.errors.errors)

            }else{ 
               
                let user = [...props.allTrainers, ...props.allClients].find(user => user.id === parseInt(id))
                props.deleteUser(user)
                goBack(true)
            }
        })
    }

    //Form Actions -------------------

    const viewProfile = (e) => {
        props.history.push(`/profile/${e.target.value}`)
    }

    const goBack = () => {
        if(props.back){
            props.history.goBack()
        }else{
            setShowForm(false)
            setEnterNew(true)
            setEditUser(defaultUser)
            setErrors([])

        }
    }

    const toggleForm = (e) => {
   
        let editUser = defaultUser
        let enterNew = true
        if(!!e && e.target.value ){
            editUser = props.allUsers.find(u => u.id === parseInt(e.target.value))
            enterNew = false
        }
        setShowForm(!showForm)
        setEditUser(editUser)
        setEnterNew(enterNew)
        setErrors([])

    }

    // SEARCH actions ----------------------
    const handleSearchChange = (e) => {
        setSearchName(e.target.value)
    }

    // RENDERS ------------------------------

    const renderForm = () =>{
        if(enterNew){
            return <UserForm isNew={true} editUser={editUser} toggleForm={toggleForm} levelOptions={getLevelOptions(props.levels)} goBack={goBack} userType={props.userType}/>
        }else{
            return <UserForm handleDeleteUser={handleDeleteUser} isNew={false} editUser={editUser} toggleForm={toggleForm} levelOptions={getLevelOptions(props.levels)} goBack={goBack} userType={props.userType}/>
        }
    }

    const renderAddButton = () =>{
        return  <p>
            <Button onClick={toggleForm}>{`Add ${props.userType}`}</Button>
        </p> 
    
    }

    const renderUsers = () => {
        const currentUser = props.user
        const type = props.userType
   
        //sort the users alphabetically and filter if needed
        let all = props.allUsers
        all.sort((a, b) => a.last_name.localeCompare(b.last_name))

        if(searchName !== ""){
            let key = searchName.toLowerCase()
            all = all.filter(user => getFullName(user).toLowerCase().includes(key))
        }

        // Display all users
        if( !showForm){
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
                                    <Button value={user.id} onClick={toggleForm}>Edit</Button> 
                                    </Fragment>
                                : null }
                                <Button value={user.id} onClick={viewProfile}>View Profile</Button>
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
        
    return (
        
        <div className="train-container">
            {showForm ?  renderForm() : null}
            {renderAddButton()}
            <Menu.Item>
                <Input icon='search' placeholder='Search by Name...'
                    onChange={handleSearchChange} />
            </Menu.Item>

            <Confirm open={confirmOpen} onCancel={handleConfirmDelete} onConfirm={handleConfirm}
                content='Do you really want to delete this user?'
                header='Are you sure?'
                />

            <p></p>
            {props.loading ? 
            <Loading/> 
            : 
            <Card.Group>
                {renderUsers()}
            </Card.Group>
            }
        
        
        </div>
    )
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



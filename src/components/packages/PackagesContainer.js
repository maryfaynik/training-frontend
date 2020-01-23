import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Grid, Header, Button, Divider, Icon, Menu} from 'semantic-ui-react';

import { deletePackage, updatePackage, addPackage} from "../../actions/actions"
import AddEditPackageForm from './AddEditPackageForm'
import BuySellPackageForm from './BuySellPackageForm'

import Loading from '../navigation/Loading'

const PackagesContainer = (props) => {

    // state = {
    //     form: "",
    //     showPopup: false,
    //     editPack: {},
    //     errors: []
    // }

    let [form, setForm] = useState("")
    let [showPopup, setShowPopup] = useState(false)
    let [editPack, setEditPack] = useState({})
    let [errors, setErrors] = useState([])


    const goBack = () => {

        setForm("")
        setShowPopup(false)
        setErrors([])

    }

    const toggleForm = (e) => {

        setShowPopup(!showPopup)
        setErrors([])
    }


    // HANDLERS -------------------------------

    const handleClick = (e, id) => {
  
        let name = e.target.name
        let thisEditPack = {}
        if(id !== -1) thisEditPack = props.packages.find(pack => pack.id === id)
       
        setShowPopup(true)
        setForm(name)
        setEditPack(thisEditPack)
    
    }

    // RENDERS ------------------------------
    const renderPopup = () => {
        switch(form){
            case "edit":
                return <AddEditPackageForm isNew={false} editPack={editPack} toggleForm={toggleForm} goBack={goBack} levels={props.levels}/>
            case "add":
                return <AddEditPackageForm isNew={true} toggleForm={toggleForm} goBack={goBack} levels={props.levels}/>
            case "sell":
                return <BuySellPackageForm selling={true} package={editPack} packages={props.packages} toggleForm={toggleForm} goBack={goBack} client={{}} allClients={props.allClients}/>
            case "buy":
                return <BuySellPackageForm selling={false} package={editPack} packages={props.packages} toggleForm={toggleForm} goBack={goBack} client={props.user} allClients={[props.user]}/>
                
            default:
                break
        }
    }
    
    const renderAddButton = () =>{
        return props.user.user_type === "Manager" ? <Button name="add" onClick={(e) => handleClick(e, -1)}><Icon name="plus"/>Add Package</Button> : null
    }

    // Render the level sections for the package list
    const renderLevelPackages = () => {
        return props.levels.map(level => {
            let packs = props.packages.filter(pack => pack.level.id === level.id)
            packs.sort((a, b) => a.price - b.price)
            return <Fragment key={level.id}>
                    <Grid.Row  columns={1}>
                        <Grid.Column>
                            <Header as="h3"><Icon name="angle right"/>{level.name} Packages:</Header>
                        </Grid.Column>
                    </Grid.Row>
                    {renderPackages(packs)}
                    <Divider/>
                    </Fragment>

        })
    }

    // Render the packages in the sub-heading 
    const renderPackages = (packs) => {
        let type = props.user.user_type
        
        let options = {
            "Manager": {
                package_button: "Sell Package",
                name: "sell"
            },
            "Trainer": {
                package_button: "Sell Package",
                name: "sell"
            },
            "Client": {
                package_button: "Purchase Package",
                name: "buy"
            }
        }

        return packs.map(pack => {
            return <Grid.Row key={pack.id} columns={2}>
                    <Grid.Column width={1}> </Grid.Column>
                    <Grid.Column width={10}>
                        <Header as='h3'
                            content={pack.title}
                            subheader={`${pack.session_count} ${pack.level.name} session${pack.session_count > 1 ? "s" : "" } | Price: $${pack.price}.00`}/>
                        <span>
                            {type === "Manager" ? <Button name="edit" onClick={(e) =>           handleClick(e, pack.id)}>Edit Package</Button> : null}
                            <Button name={options[type].name} onClick={(e) => 
                                handleClick(e, pack.id)}>{options[type].package_button}</Button>
                        </span>
                    </Grid.Column>
                    </Grid.Row>
        })
    }

    // MAIN RENDER --------------------------------
 

    return (

        <div className="packages-container">
            {showPopup ?  renderPopup() : null} 
            
            <Menu secondary>
                <Menu.Item>
                    <h1>All Packages</h1>
                </Menu.Item>
                <Menu.Item>
                    {renderAddButton()}
                </Menu.Item>
            </Menu>

            <Divider/>
            <Grid>
            {props.loading? 
                <Grid.Row><Grid.Column><Loading/></Grid.Column></Grid.Row>
            :  
                renderLevelPackages()
            }
                
            </Grid> 
        </div>
    )  
}

const msp = (state) => {
    return {
        user: state.user.user,
        packages: state.app.packages,
        levels: state.app.levels,
        allClients: state.user.allClients,
        loading: state.app.loading
    }
}
export default connect(msp, {deletePackage, updatePackage, addPackage})(withRouter(PackagesContainer));



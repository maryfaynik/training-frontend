import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Grid, Header, Button, Divider, Icon, Segment, Menu} from 'semantic-ui-react';

import { deletePackage, updatePackage, addPackage} from "../../actions/actions"
import AddEditPackageForm from './AddEditPackageForm';
import BuySellPackageForm from './BuySellPackageForm';


class PackagesContainer extends Component {

    state = {
        form: "",
        showPopup: false,
        editPack: {},
        errors: []
    }


    goBack = () => {
        this.setState({
            form: "",
            showPopup: false,
            errors: []
        })

    }

    toggleForm = (e) => {
        this.setState({
            showPopup: !this.state.showPopup,
            errors: []
        })
    }


    // HANDLERS -------------------------------

    handleClick = (e, id) => {
        console.log("clicked...e: ", e.target)
        let name = e.target.name
        let editPack = {}
        if(id !== -1) editPack = this.props.packages.find(pack => pack.id === id)
       
        this.setState({
            showPopup: true,
            form: name,
            editPack: editPack
        })
    }

    // RENDERS ------------------------------
    renderPopup = () => {
        switch(this.state.form){
            case "edit":
                return <AddEditPackageForm isNew={false} editPack={this.state.editPack} toggleForm={this.toggleForm} goBack={this.goBack} levels={this.props.levels}/>
            case "add":
                return <AddEditPackageForm isNew={true} toggleForm={this.toggleForm} goBack={this.goBack} levels={this.props.levels}/>
            case "sell":
                return <BuySellPackageForm selling={true} package={this.state.editPack} packages={this.props.packages} toggleForm={this.toggleForm} goBack={this.goBack} client={{}} allClients={this.props.allClients}/>
            case "buy":
                return <BuySellPackageForm selling={false} package={this.state.editPack} packages={this.props.packages} toggleForm={this.toggleForm} goBack={this.goBack} client={this.props.user} allClients={[this.props.user]}/>
                
            default:
                break
        }
    }
    
    renderAddButton = () =>{
        return this.props.user.type === "Manager" ? <Button name="add" onClick={(e) => this.handleClick(e, -1)}><Icon name="plus"/>Add Package</Button> : null
    }

    // Render the level sections for the package list
    renderLevelPackages = () => {
        return this.props.levels.map(level => {
            let packs = this.props.packages.filter(pack => pack.level.id === level.id)
            packs.sort((a, b) => a.price - b.price)
            return <Fragment>
                    <Grid.Row key={level.id} columns={1}>
                        <Grid.Column>
                            <Header as="h3"><Icon name="angle right"/>{level.name} Packages:</Header>
                        </Grid.Column>
                    </Grid.Row>
                    {this.renderPackages(packs)}
                    <Divider/>
                    </Fragment>

        })
    }

    // Render the packages in the sub-heading 
    renderPackages = (packs) => {
        let type = this.props.user.type
        
        let options = {
            "Manager": {
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
                            {type === "Manager" ? <Button name="edit" onClick={(e) => this.handleClick(e, pack.id)}>Edit Package</Button> : null}
                            {type === "Trainer" ? null : <Button name={options[type].name} onClick={(e) => this.handleClick(e, pack.id)}>{options[type].package_button}</Button>}
                        </span>
                    </Grid.Column>
                    </Grid.Row>
        })
    }

    // MAIN RENDER --------------------------------
    render(){

        return (

            <div className="packages-container">
                {this.state.showPopup ?  this.renderPopup() : null} 
                
                <Menu secondary>
                    <Menu.Item>
                        <h1>All Packages</h1>
                    </Menu.Item>
                    <Menu.Item>
                        {this.renderAddButton()}
                    </Menu.Item>
                </Menu>
  
                <Divider/>
                <Grid>
                    {this.renderLevelPackages()}  
                </Grid> 
            </div>
        )
        
    }
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        packages: state.app.packages,
        levels: state.app.levels,
        allClients: state.user.allClients
    }
}
export default connect(msp, {deletePackage, updatePackage, addPackage})(withRouter(PackagesContainer));



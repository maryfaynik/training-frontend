import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Item, Segment, Header, Button} from 'semantic-ui-react';

import { deletePackage, updatePackage, addPackage} from "../../actions/actions"
import {API} from '../../App'
import AddEditPackageForm from './AddEditPackageForm';


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
        console.dir(e)
        console.log(e.target)
        let name = e.target.name
        let editPack = {}
        if(id !== -1) editPack = this.props.packages.find(pack => pack.id === id)
        console.log("target id ", id)
        console.log("setting edit pack to ", editPack)
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
                break
            case "buy":
                break
            default:
                break
        }
    }
    
    renderAddButton = () =>{
        return this.props.user.type === "Manager" ? <Button name="add" onClick={(e) => this.handleClick(e, -1)}>Add Package</Button> : null
    }

    // Render the level sections for the package list
    renderLevelPackages = () => {
        return this.props.levels.map(level => {
            let packs = this.props.packages.filter(pack => pack.level.id === level.id)
            packs.sort((a, b) => a.price - b.price)
            return <Fragment key={level.id}>
                    <Header as="h2" content={`${level.name} Packages:`}/>
                    <Segment.Group>
                        {this.renderPackages(packs)}
                    </Segment.Group>
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
            return <Segment key={pack.id}>
                        <Header as='h2'
                            content={pack.title}
                            subheader={`${pack.session_count} ${pack.level.name} session${pack.session_count > 1 ? "s" : "" }`}/>
                        <Header as='h4' content={`Price: $${pack.price}.00`}/>
                        <span>
                            {type === "Manager" ? <Button name="edit" onClick={(e,) => this.handleClick(e, pack.id)}>Edit Package</Button> : null}
                            {type === "Trainer" ? null : <Button name={options[type].name} onClick={() => this.handleClick(pack.id)}>{options[type].package_button}</Button>}
                        </span>
                    </Segment>
        })
    }

    // MAIN RENDER --------------------------------
    render(){

        return (

            <div className="packages-container">
                {this.state.showPopup ?  this.renderPopup() : null} 
                {this.renderAddButton()}
  
                <h1>All Packages</h1>
                 <Item.Group divided>
                </Item.Group>
                
                <Segment.Group>
                    {this.renderLevelPackages()}  
                </Segment.Group> 
            </div>
        )
        
    }
    
}

const msp = (state) => {
    return {
        user: state.user.user,
        packages: state.app.packages,
        levels: state.app.levels
    }
}
export default connect(msp, {deletePackage, updatePackage, addPackage})(withRouter(PackagesContainer));



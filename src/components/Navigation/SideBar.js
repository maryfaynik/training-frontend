import React from 'react';
import { connect } from 'react-redux'
import { Menu} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { setActivePage } from '../../actions/actions'

const SideBar = (props) => {
  
    const getInfo = () => {
        switch(props.type){
            case "Manager":
                return {
                    schedule: {name: "Schedule", to: "/schedule"},
                    trainers: {name: "Trainers", to: "/trainers"},
                    clients: {name: "Clients", to: "/clients"},
                    packages: {name: "Manage Packages", to: "/packages"}
                }
            case "Trainer":
                return {
                    schedule: {name: "My Schedule", to: "/schedule"},
                    trainers: {name:  "My Profile", to: "/"},
                    clients: {name: "My Clients", to: "/clients"},
                    packages: {name: "Sell Packages", to: "/packages"}
                }
            case "Client":
                return {
                    schedule: {name: "My Schedule", to: "/schedule"},
                    trainers: {name: "My Trainers", to: "/trainers"},
                    clients: {name: "My Profile", to: "/"},
                    packages: {name: "Buy Packages", to: "/packages"}
                }
            default:
                return {
                    schedule: {name: "Schedule", to: "/schedule"},
                    trainers: {name: "Trainers", to: "/trainers"},
                    clients: {name: "Clients", to: "/clients"},
                    packages: {name: "Packages", to: "/packages"}
                }
        }
    }

    const info = getInfo() 
    
    const handleClick = (e, {value}) => {
        props.setActivePage(value)
    }

    return (
        <div className="sideBar">
            <Menu vertical>
                <Menu.Item
                as={Link} to='/landing'
                value='dashboard'
                onClick = {handleClick}
                active={props.activeItem === 'dashboard'}
                >
                Dashboard
                </Menu.Item>
                <Menu.Item
                as={Link} to={info.schedule.to}
                value="schedule"
                onClick = {handleClick}
                active={props.activeItem === 'schedule'}
                >
                {info.schedule.name}
                </Menu.Item>

                <Menu.Item 
                value="trainers"
                as={Link} to={info.trainers.to}
                onClick = {handleClick}
                active={props.activeItem === 'trainers'}
                >
                {info.trainers.name}
                </Menu.Item>

                <Menu.Item
                value="clients"
                as={Link} to={info.clients.to}
                onClick = {handleClick}
                active={props.activeItem === 'clients'}
                >
                {info.clients.name}
                </Menu.Item>

                <Menu.Item
                value="packages"
                as={Link} to={info.packages.to}
                onClick = {handleClick}
                active={props.activeItem === 'packages'}
                >
                {info.packages.name}
                </Menu.Item>
            
            </Menu>
        </div>
    )
        
}

const msp = (state) => {
    return {
        activeItem: state.app.activePage,
        type: state.user.user.type
    }

}


export default connect(msp, { setActivePage })(SideBar);

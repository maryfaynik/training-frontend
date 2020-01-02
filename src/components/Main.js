import React from 'react';
import { connect } from 'react-redux'

import SideBar from './SideBar'
import MainBody from './MainBody'

const Main = (props) => {

    return (
        <div className = "main">
            { props.user.id ? <SideBar/> : null}
            <MainBody/>
        </div>
    )
    
}
  
const msp = (state) => {
    return {
        user: state.user.user
    }
}


export default connect(msp)(Main);

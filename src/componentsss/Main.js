import React from 'react';
import { connect } from 'react-redux'

import SideBar from './SideBar'
import MainBody from './MainBody'
import Loading from './Loading'

const Main = (props) => {

    return (
        <div className = "main">
            { props.user.id ? <SideBar/> : null}
            { props.userLoading ? <Loading full={true}/> : <MainBody/> }
        </div>
    )
    
}
  
const msp = (state) => {
    return {
        user: state.user.user,
        allLoading: state.app.allLoading,
        userLoading: state.app.userLoading
    }
}


export default connect(msp)(Main);

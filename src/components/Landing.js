import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import ManagerDash from '../containers/navigation/ManagerDash'

const Landing = (props) => {

  const renderDash = () => {
    switch(props.user.type){
      case "Manager":
        return <ManagerDash/>
      default:
        return <Redirect to='/schedule'/>
    }
  }


    return (
      <div>
        {renderDash()}
      </div>
    )
}

const msp = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(msp)(Landing);
import React, { Component } from 'react';
import { connect } from 'react-redux'

import ManagerDash from './ManagerDash'

class Landing extends Component {

 
  renderDash = () => {
    switch(this.props.user.type){
      case "Manager":
        return <ManagerDash/>
      default:
        return <div> HI</div>
    }
  }


  render(){
   
    return (
      <div>
        {this.renderDash()}
      </div>
    )
  }
}

const msp = (state) => {
  return {
    user: state.user.user
  }
}

export default connect(msp)(Landing);
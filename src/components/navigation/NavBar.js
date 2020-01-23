import React from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { withRouter} from 'react-router-dom';
import { connect } from 'react-redux' 

import { setUser } from '../../actions/actions'

const NavBar = props => {
  
  const handleHomeClick = () =>{
    props.history.push('/')
  }
  const handleAcctClick = () =>{
    props.history.push('/settings')
  }

  const handleLogout = () =>{
    localStorage.removeItem("user_id")
    props.setUser({})
  }

  return (
    <div className="nav">
      <Menu >
        <Menu.Menu position="left">
          <Menu.Item
            name='home'
            onClick={handleHomeClick}
          ><Icon name="target"/></Menu.Item>
        </Menu.Menu>  
        <Menu.Menu position='right'>
          <Dropdown item icon='user' simple>
            <Dropdown.Menu>
              {/* <Dropdown.Item>
                <Icon name='dropdown' />
                <span className='text'>New</span>
                <Dropdown.Menu>
                  <Dropdown.Item>Session</Dropdown.Item>
                  <Dropdown.Item>Trainer</Dropdown.Item>
                  <Dropdown.Item>Client</Dropdown.Item>
                  <Dropdown.Item>Manager</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Item> */}
              <Dropdown.Item onClick={handleAcctClick}>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
              onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </Menu.Menu>
      </Menu>
      
    </div>
  );
};

const mdp = (dispatch) =>{
  return {
    setUser: (user) => dispatch(setUser(user, dispatch))
  }
}


export default connect(undefined, mdp)(withRouter(NavBar));

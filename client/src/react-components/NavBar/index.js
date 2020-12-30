import React, { Component } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { history } from 'react-router'
import './style.css'

export class NavBar extends Component {
  state = {
    anchorEl: null
  }

  handleMenuOpen = event => {
    this.setState({
      anchorEl: event.target
    })
  }

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    })
  }

  render () {
    const getRightSide = () => {
      if (!this.props.loggedIn) {
        return ( <ul className='right'><li><a href='/signup'>Sign Up</a></li><li><a href='/login'>Log In</a></li></ul> )
      } else {
        return (
          <div className='right'>
            <Button id='menuAnchor' aria-controls='user-menu' aria-haspopup='true' onClick={this.handleMenuOpen}><i className='material-icons left'>person</i>Profile</Button>
            <Menu
              id='user-menu'
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuItem><a href='/calendar'><i className='material-icons left'>person</i>My Profile</a></MenuItem>
              <MenuItem><a href='/calendar'><i className='material-icons left'>list</i>My Shopping List</a></MenuItem>
              <MenuItem><a href='/calendar'><i className='material-icons left'>mode_edit</i>My Ingredients</a></MenuItem>
              <MenuItem><a href='/logout'><i className='material-icons left'>exit_to_app</i>Log Out</a></MenuItem>
            </Menu>
          </div>
        )
      }
    }

    return (
      <nav className='teal darken-3'>
        <div className='nav-wrapper'> 
          <a href='/' className='brand-logo'>TEMP NAME</a>
          { getRightSide() }
        </div>
      </nav>
    )
  }
}

export default NavBar

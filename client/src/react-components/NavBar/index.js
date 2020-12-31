import React, { Component } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { getUserById } from '../../actions/actions'
import './style.css'

export class NavBar extends Component {
  state = {
    anchorEl: null,
    uid: null,
    username: 'Profile'
  }

  componentDidUpdate() {
    if (this.props.uid !== this.state.uid) {
      this.getName(this.props.uid).then(res => {
        this.setState({
          uid: this.props.uid,
          username: res
        })
      })
    }
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

  getName = (uid) => {
    if (!uid) {
      return Promise.resolve('Profile')
    }
    return getUserById(uid).then(res => {
      return res.username
    })
  }

  render () {
    const getRightSide = () => {
      if (!this.props.uid) {
        return ( <ul className='right'><li><a href='/signup'>Sign Up</a></li><li><a href='/login'>Log In</a></li></ul> )
      } else {
        return (
          <div className='right'>
            <Button id='menuAnchor' aria-controls='user-menu' aria-haspopup='true' onClick={this.handleMenuOpen}><i className='material-icons left'>person</i><h6>{this.state.username}</h6></Button>
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
          <a href='/' id='logo' className='brand-logo'>Grocery App</a>
          { getRightSide() }
        </div>
      </nav>
    )
  }
}

export default NavBar

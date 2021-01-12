import React, { Component } from 'react'
import { Button, Menu, MenuItem, AppBar, Toolbar, Typography, ButtonGroup, withStyles, IconButton } from '@material-ui/core'
import { Person, ExitToApp, PersonAdd, ClassSharp } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import { getUserById } from '../../actions/actions'
import './style.css'

const styles = theme => ({
  desktopSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  mobileSection: {
    display: 'flex',
    color: 'white',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  iconTextMix: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
})

export class NavBar extends Component {
  state = {
    userAnchorEl: null,
    authAnchorEl: null,
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

  handleUserMenuOpen = event => {
    this.setState({
      userAnchorEl: event.target
    })
  }

  handleUserMenuClose = () => {
    this.setState({
      userAnchorEl: null
    })
  }

  handleAuthMenuOpen = event => {
    this.setState({
      authAnchorEl: event.target
    })
  }

  handleAuthMenuClose = event => {
    this.setState({
      authAnchorEl: null
    })
  }

  getName = (uid) => {
    if (!uid) {
      return Promise.resolve('Profile')
    }
    return getUserById(uid).then(res => {
      if (res) {
        return res.username
      } else {
        return 'Profile'
      }
    })
  }

  render () {
    const { classes } = this.props

    const getRightSide = () => {
      if (!this.props.uid) {
        return (
          <div id='authButtons'>
            <div className={classes.desktopSection}>
              <ButtonGroup className='authButtons'>
                <Button variant='contained' onClick={() => window.open('/signup', '_self')}>Sign Up</Button>
                <Button variant='contained' onClick={() => window.open('/login', '_self')}>Log In</Button>
              </ButtonGroup> 
            </div>
            <div className={classes.mobileSection}>
              <IconButton edge='end' aria-controls='auth-menu' aria-haspopup='true' color='inherit' onClick={this.handleAuthMenuOpen}><MenuIcon /></IconButton>
              <Menu
                id='auth-menu'
                anchorEl={this.state.authAnchorEl}
                keepMounted
                open={Boolean(this.state.authAnchorEl)}
                onClose={this.handleAuthMenuClose}
              >
                <MenuItem><a href='/login' className={classes.iconTextMix}><Person />Log In</a></MenuItem>
                <MenuItem><a href='/signup' className={classes.iconTextMix}><PersonAdd />Sign Up</a></MenuItem>
              </Menu>
            </div>
          </div>
        )
      } else {
        return (
          <div style={{ marginLeft: 'auto' }}>
            <Button id='menuAnchor' variant='contained' color='secondary' aria-controls='user-menu' aria-haspopup='true' startIcon={<Person />} onClick={this.handleUserMenuOpen}>{this.state.username}</Button>
            <Menu
              id='user-menu'
              anchorEl={this.state.userAnchorEl}
              keepMounted
              open={Boolean(this.state.userAnchorEl)}
              onClose={this.handleUserMenuClose}
            >
              <MenuItem><a href='/calendar' className={classes.iconTextMix}><Person />My Profile</a></MenuItem>
              <MenuItem><a href='/logout' className={classes.iconTextMix}><ExitToApp />Log Out</a></MenuItem>
            </Menu>
          </div>
        )
      }
    }

    return (
      <AppBar color='primary' position='static'>
        <Toolbar className='nav-wrapper'> 
          <a href='/' id='logo' className='brand-logo'><Typography variant='h4'>MealPlanner</Typography></a>
          { getRightSide() }
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(NavBar)

import React, { useState, useEffect } from 'react'
import { Button, Menu, MenuItem, AppBar, Toolbar, Typography, ButtonGroup, IconButton } from '@material-ui/core'
import { Person, ExitToApp, PersonAdd, CalendarToday } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import { getUserById } from '../../actions/actions'
import './NavBar.css'

export default function NavBar (props) {
  const [uid, setUid] = useState(null)
  useEffect(() => {
    setUid(props.uid)
    getName(props.uid).then(res => setUsername(res))
  }, [props.uid])
  const [userAnchorEl, setUserAnchorEl] = useState(null)
  const [authAnchorEl, setAuthAnchorEl] = useState(null)
  const [username, setUsername] = useState('Profile')

  const classes = useStyles()

  const getRightSide = () => {
    if (!uid) {
      return (
        <div id='authButtons'>
          <div className={classes.desktopSection}>
            <ButtonGroup className='authButtons'>
              <Button variant='contained' onClick={() => window.open('/signup', '_self')}>Sign Up</Button>
              <Button variant='contained' onClick={() => window.open('/login', '_self')}>Log In</Button>
            </ButtonGroup>
          </div>
          <div className={classes.mobileSection}>
            <IconButton
              edge='end'
              aria-label='Navigation Menu'
              aria-controls='auth-menu'
              aria-haspopup='true'
              color='inherit'
              onClick={(event) => setAuthAnchorEl(event.target)}>
                <MenuIcon />
            </IconButton>
            <Menu
              id='auth-menu'
              anchorEl={authAnchorEl}
              keepMounted
              open={Boolean(authAnchorEl)}
              onClose={() => setAuthAnchorEl(null)}
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
          <Button id='menuAnchor' variant='contained' color='secondary' aria-controls='user-menu' aria-haspopup='true' startIcon={<Person />} onClick={(event) => setUserAnchorEl(event.target)}>{username}</Button>
          <Menu
            id='user-menu'
            anchorEl={userAnchorEl}
            keepMounted
            open={Boolean(userAnchorEl)}
            onClose={() => setUserAnchorEl(null)}
          >
            <MenuItem><a href='/profile' className={classes.iconTextMix}><Person />My Profile</a></MenuItem>
            <MenuItem><a href='/calendar' className={classes.iconTextMix}><CalendarToday />My Calendar</a></MenuItem>
            <MenuItem><a href='/logout' className={classes.iconTextMix}><ExitToApp />Log Out</a></MenuItem>
          </Menu>
        </div>
      )
    }
  }

  return (
    <AppBar className={classes.navBar} position='static'>
      <Toolbar className='nav-wrapper'>
        <a href='/' id='logo' className='brand-logo'><Typography variant='h1'>MealPlanner</Typography></a>
        {getRightSide()}
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles((theme) => ({
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
  },
  navBar: {
    background: '#303F9F !important',
    color: '#f0f0f0 !important',
    zIndex: '5'
  }
}))

const getName = (uid) => {
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

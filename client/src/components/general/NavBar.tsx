import React, { useState, useEffect } from 'react'
import { Button, Menu, MenuItem, AppBar, Toolbar, Typography, ButtonGroup, IconButton } from '@mui/material'
import { Person, ExitToApp, PersonAdd, CalendarToday } from '@mui/icons-material'
import { makeStyles, ClassNameMap } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu'
import { getUserById } from '../../actions/actions'
import './NavBar.css'
import { useHistory, Link } from 'react-router-dom'

export default function NavBar (props: { uid: string }) {
  const [uid, setUid] = useState<string | null>(null)
  useEffect(() => {
    setUid(props.uid)
    getName(props.uid).then(res => setUsername(res))
  }, [props.uid])
  const [userAnchorEl, setUserAnchorEl] = useState<Element | null>(null)
  const [authAnchorEl, setAuthAnchorEl] = useState<Element | null>(null)
  const [username, setUsername] = useState('Profile')

  const history = useHistory()

  const classes: ClassNameMap<any> = useStyles()

  const getRightSide = () => {
    if (!uid) {
      return (
        <div id='authButtons'>
          <div className={classes.desktopSection}>
            <ButtonGroup className='authButtons'>
              <Button variant='contained' onClick={() => history.push('/signup')}>Sign Up</Button>
              <Button variant='contained' onClick={() => history.push('/login')}>Log In</Button>
            </ButtonGroup>
          </div>
          <div className={classes.mobileSection}>
            <IconButton
              edge='end'
              aria-label='Navigation Menu'
              aria-controls='auth-menu'
              aria-haspopup='true'
              color='inherit'
              onClick={(event) => setAuthAnchorEl(event.target as Element)}>
                <MenuIcon />
            </IconButton>
            <Menu
              id='auth-menu'
              anchorEl={authAnchorEl}
              keepMounted
              open={Boolean(authAnchorEl)}
              onClose={() => setAuthAnchorEl(null)}
            >
              <MenuItem><Link to='/login' className={classes.iconTextMix}><Person />Log In</Link></MenuItem>
              <MenuItem><Link to='/signup' className={classes.iconTextMix}><PersonAdd />Sign Up</Link></MenuItem>
            </Menu>
          </div>
        </div>
      )
    } else {
      return (
        <div style={{ marginLeft: 'auto' }}>
          <Button id='menuAnchor' variant='contained' color='secondary' aria-controls='user-menu' aria-haspopup='true' startIcon={<Person />} onClick={(event) => setUserAnchorEl(event.target as Element)}>{username}</Button>
          <Menu
            id='user-menu'
            anchorEl={userAnchorEl}
            keepMounted
            open={Boolean(userAnchorEl)}
            onClose={() => setUserAnchorEl(null)}
          >
            <MenuItem><Link to='/profile' className={classes.iconTextMix}><Person />My Profile</Link></MenuItem>
            <MenuItem><Link to='/calendar' className={classes.iconTextMix}><CalendarToday />My Calendar</Link></MenuItem>
            <MenuItem><a href='/logout' className={classes.iconTextMix}><ExitToApp />Log Out</a></MenuItem>
          </Menu>
        </div>
      )
    }
  }

  return (
    <AppBar className={classes.navBar} position='static'>
      <Toolbar className='nav-wrapper'>
        <Link to='/' id='logo' className='brand-logo'><Typography variant='h1'>MealPlanner</Typography></Link>
        {getRightSide()}
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles((theme: any) => ({
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
    zIndex: 5
  }
}))

const getName = (uid: string) => {
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

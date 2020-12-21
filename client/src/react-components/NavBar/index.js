import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import './style.css'

export class NavBar extends Component {
  render () {
    return (
      <div id='navDiv'>
        <a href='/'><h1>TEMP NAME</h1></a>
        <ButtonGroup>
          <Button>Sign Up</Button>
          <Button>Log In</Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default NavBar

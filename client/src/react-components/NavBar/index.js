import React, { Component } from 'react'
import './style.css'

export class NavBar extends Component {
  state = {
    loggedIn: false
  }

  
  render () {
    const getRightSide = () => {
      if (!this.state.loggedIn) {
        return ( <ul class="right"><li><a href='/signup'>Sign Up</a></li><li><a href='/login'>Log In</a></li></ul> )
      } else {
        return ( <ul class="right"><li><i class="material-icons left">person</i>Profile</li></ul> )
      }
    }

    return (
      <nav class="teal darken-3">
        <div class='nav-wrapper'> 
          <a href="." class="brand-logo">TEMP NAME</a>
          { getRightSide() }
        </div>
      </nav>
    )
  }
}

export default NavBar

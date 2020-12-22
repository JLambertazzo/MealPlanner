import React, { Component } from 'react'
import './style.css'

export class NavBar extends Component {
  state = {
    loggedIn: false
  }

  
  render () {
    const getRightSide = () => {
      if (!this.state.loggedIn) {
        return ( <ul className="right"><li><a href='/signup'>Sign Up</a></li><li><a href='/login'>Log In</a></li></ul> )
      } else {
        return ( <ul className="right"><li><i className="material-icons left">person</i>Profile</li></ul> )
      }
    }

    return (
      <nav className="teal darken-3">
        <div className='nav-wrapper'> 
          <a href="." className="brand-logo">TEMP NAME</a>
          { getRightSide() }
        </div>
      </nav>
    )
  }
}

export default NavBar

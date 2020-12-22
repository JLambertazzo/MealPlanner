import React, { Component } from 'react'
import './style.css'

export class NavBar extends Component {
  render () {
    return (
      <div id='navDiv'>
        <button class="waves-effect waves-light btn" href='/'><h1>TEMP NAME</h1></button>
        <button class="waves-effect waves-light btn" href='/'>Sign Up</button>
        <button class="waves-effect waves-light btn" href='/'>Log In</button>
      </div>
    )
  }
}

export default NavBar

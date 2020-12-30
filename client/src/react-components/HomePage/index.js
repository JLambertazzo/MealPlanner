import React, { Component } from 'react'
import NavBar from '../NavBar'
import './style.css'

export class HomePage extends Component {
  render () {
    return (
      <div>
        <NavBar loggedIn={this.props.loggedIn}/>
        <h1>HomePage</h1>
        <a className="btn waves-effect waves-light teal darken-2" href="/calendar">Go To Calendar</a>
      </div>
    )
  }
}

export default HomePage

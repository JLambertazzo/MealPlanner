import React, { Component } from 'react'
import NavBar from '../NavBar'
import './style.css'

export class HomePage extends Component {
  render () {
    return (
      <div id='home'>
        <NavBar loggedIn={this.props.uid}/>
        <div id='content'>
          <video src='/gstorevid.mp4' autoPlay loop muted />
          <div id='text'>
            <h1>Grocery App</h1>
            <a className="btn waves-effect waves-light teal darken-2" href="/calendar">Get Started</a>
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage

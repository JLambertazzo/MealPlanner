import React, { Component } from 'react'
import NavBar from '../NavBar'
import { Button } from '@material-ui/core'
import './style.css'

export class HomePage extends Component {
  render () {
    return (
      <div id='home'>
        <NavBar uid={this.props.uid || 'a'}/>
        <div id='content'>
          <video src='/gstorevid.mp4' autoPlay loop muted />
          <div id='text'>
            <h1>Grocery App</h1>
            <Button variant='contained' color='secondary' onClick={() => window.open('/calendar', '_self')}>Get Started</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage

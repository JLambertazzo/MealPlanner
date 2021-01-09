import React, { Component } from 'react'
import NavBar from '../NavBar'
import { Button } from '@material-ui/core'
import './style.css'

export class HomePage extends Component {
  render () {
    return (
      <div id='home'>
        <NavBar uid={this.props.uid}/>
        <div id='content'>
          <video src='/gstorevid.mp4' autoPlay loop muted />
          <div id='text'>
<<<<<<< HEAD
            <Button color='primary' variant='contained' href='/calendar'>Get Started</Button>
=======
            <h1>Grocery App</h1>
            <Button variant='contained' color='secondary' onClick={() => window.open('/calendar', '_self')}>Get Started</Button>
>>>>>>> ed216dc5d82a5053f2c94107a893334417d0b341
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage

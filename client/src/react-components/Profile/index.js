import React, { Component } from 'react'
import NavBar from '../NavBar'

export class Profile extends Component {
  render() {
    return (
      <div>
        <NavBar uid={this.props.uid} />
        
      </div>
    )
  }
}

export default Profile

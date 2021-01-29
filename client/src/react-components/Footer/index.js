import React, { Component } from 'react'
import { AppBar, Typography } from '@material-ui/core'
import './style.css'

export class Footer extends Component {
  render () {
    return (
      <AppBar className='footer'>
        <Typography variant='h5'>Made by Julien Bertazzo Lambert</Typography>
      </AppBar>
    )
  }
}

export default Footer

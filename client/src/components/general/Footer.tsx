import React from 'react'
import { AppBar, Typography } from '@material-ui/core'
import './Footer.css'

export default function Footer () {
  return (
    <AppBar className='footer'>
      <Typography variant='body1'>Made by Julien Bertazzo Lambert</Typography>
    </AppBar>
  )
}
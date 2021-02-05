import React from 'react'
import { AppBar, Typography } from '@material-ui/core'
import './Footer.css'

export default function Footer () {
  return (
    <AppBar className='footer'>
      <Typography variant='h5'>Made by Julien Bertazzo Lambert</Typography>
    </AppBar>
  )
}
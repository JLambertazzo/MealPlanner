import './App.css'
import { checkLoggedIn, reduxLogIn, reduxLogOut } from './actions/actions'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './themes/default'
import React, { useState, useEffect } from 'react'
import HomePage from './pages/home/HomePage'
import Calendar from './pages/calendar/CalendarView'
import AuthForm from './pages/auth/AuthForm'
import Profile from './pages/profile/Profile'
import { useSelector, useDispatch } from 'react-redux'

export default function App () {
  const dispatch = useDispatch()
  useEffect(() => {
    checkLoggedIn().then(res => {
      const newUID = res.uid
      console.log('got ' + newUID)
      dispatch(reduxLogIn(newUID))
    })
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <HomePage />} />
          <Route exact path='/calendar' render={() => <Calendar />} />
          <Route exact path='/login' render={(props) => <AuthForm {...props} showLogin />} />
          <Route exact path='/signup' render={(props) => <AuthForm {...props} />} />
          <Route exact path='/profile' render={() => <Profile />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}

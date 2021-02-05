import './App.css'
import { checkLoggedInTest } from './actions/actions'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './themes/default'
import React, { useState, useEffect } from 'react'
import HomePage from './pages/home/HomePage'
import Calendar from './pages/calendar/CalendarView'
import AuthForm from './pages/auth/AuthForm'
import Profile from './pages/profile/Profile'

export default function App () {
  const [uid, setUid] = useState(null)
  useEffect(() => {
    checkLoggedInTest(setUid)
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <HomePage uid={uid} />} />
          <Route exact path='/calendar' render={() => <Calendar uid={uid} />} />
          <Route exact path='/login' render={(props) => <AuthForm {...props} showLogin />} />
          <Route exact path='/signup' render={(props) => <AuthForm {...props} />} />
          <Route exact path='/profile' render={() => <Profile uid={this.state.uid} />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}

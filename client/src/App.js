import './App.css'
import { checkLoggedIn } from './actions/actions'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './themes/default'
import React, { Component } from 'react'
import HomePage from './react-components/HomePage'
import Calendar from './react-components/Calendar'
import AuthForm from './react-components/AuthForm'
import Profile from './react-components/Profile'

class App extends Component {
  state = {
    uid: null
  }

  componentDidMount () {
    checkLoggedIn(this)
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' render={() => <HomePage uid={this.state.uid}/>} />
            <Route exact path='/calendar' render={() => <Calendar uid={this.state.uid} />} />
            <Route exact path='/login' render={(props) => <AuthForm {...props} showLogin={true}/>} />
            <Route exact path='/signup' render={(props) => <AuthForm {...props} showLogin={false}/>} />
            <Route exact path='/profile' render={() => <Profile uid={this.state.uid} />} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    )
  }
}

export default App

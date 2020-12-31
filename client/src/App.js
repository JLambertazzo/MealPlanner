import './App.css'
import { checkLoggedIn } from './actions/actions'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import React, { Component } from 'react'
import HomePage from './react-components/HomePage'
import Calendar from './react-components/Calendar'
import AuthForm from './react-components/AuthForm'

class App extends Component {
  state = {
    uid: null
  }

  componentDidMount () {
    checkLoggedIn(this)
  }

  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <HomePage uid={this.state.uid}/>} />
          <Route exact path='/calendar' render={() => <Calendar uid={this.state.uid} />} />
          <Route exact path='/login' render={(props) => <AuthForm {...props} showLogin={true}/>} />
          <Route exact path='/signup' render={(props) => <AuthForm {...props} showLogin={false}/>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App

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
    checkLoggedIn(this).then(res => console.log(this.state))
  }

  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={() => <HomePage loggedIn={this.state.uid}/>} />
          <Route exact path='/calendar' render={() => <Calendar />} />
          <Route exact path='/login' render={() => <AuthForm showLogin={true}/>} />
          <Route exact path='/signup' render={() => <AuthForm showLogin={false}/>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App

import './App.css'
import { checkLoggedIn } from './actions/actions'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
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

  theme = createMuiTheme({
    palette: {
      primary: {
        light: '#666ad1',
        main: '#303F9F',
        dark: '#001970',
        contrastText: '#fff',
      },
      secondary: {
        light: '#439889',
        main: '#00695C',
        dark: '#003d33',
        contrastText: '#fff',
      },
    },
  })

  render () {
    return (
      <ThemeProvider theme={this.theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' render={() => <HomePage uid={this.state.uid}/>} />
            <Route exact path='/calendar' render={() => <Calendar uid={this.state.uid} />} />
            <Route exact path='/login' render={(props) => <AuthForm {...props} showLogin={true}/>} />
            <Route exact path='/signup' render={(props) => <AuthForm {...props} showLogin={false}/>} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    )
  }
}

export default App

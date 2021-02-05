import React, { Component } from 'react'
import NavBar from '../../components/general/NavBar'
import { login, createUser } from '../../actions/actions.js'
import { Button, TextField, FormControl, Typography } from '@material-ui/core'
import { Person, PersonAdd } from '@material-ui/icons'
import './styles.css'

export class AuthForm extends Component {
  state = {
    username: '',
    pass: '',
    confPass: ''
  }

  handleUsernameChange = event => {
    this.setState({ username: event.target.value })
  }

  handlePassChange = event => {
    this.setState({ pass: event.target.value })
  }

  handleConfPassChange = event => {
    this.setState({ confPass: event.target.value })
  }

  getConfPassField = () => {
    if (!this.props.showLogin) {
      return (
      <FormControl className="input-field">
        <TextField label='Confirm Password' type='password' onChange={this.handleConfPassChange} inputProps={{ minLength: 8 }} required/>
      </FormControl>)
    }
  }

  setInputActive = (event) => {
    event.target.previousElementSibling.classList.add('active')
  }

  setInputInactive = (event) => {
    if (event.target.value === '') {
      event.target.previousElementSibling.classList.remove('active')
    }
  }

  handleLogin = async event => {
    event.preventDefault()
    const payload = {
      username: this.state.username,
      password: this.state.pass
    }
    try {
      await login(payload)
      window.open('/calendar', '_self')
    } catch(error) {
      console.log(error)
    }
  }

  handleSignup = async (event) => {
    event.preventDefault()
    if (this.state.pass !== this.state.confPass) {
      return
    }
    const payload = {
      username: this.state.username,
      password: this.state.pass
    }
    try {
      await createUser(payload)
      await login(payload)
      window.open('/calendar', '_self')
    } catch(error) {
      console.log(error)
    }
  }
  
  render() {
    return (
      <div id="authForm">
        <NavBar />
        <form className="container" onSubmit={this.props.showLogin ? this.handleLogin : this.handleSignup}>
          <Typography variant='h4'>{this.props.showLogin ? <Person /> : <PersonAdd />} {this.props.showLogin ? 'Log In' : 'Sign Up'}</Typography>
          <FormControl className="input-field">
            <TextField label='Username' onChange={this.handleUsernameChange} inputProps={{ minLength: 5 }} required/>
          </FormControl>
          <FormControl className="input-field">
            <TextField label='Password' type='password' onChange={this.handlePassChange} inputProps={{ minLength: 8 }} required/>
          </FormControl>
          {this.getConfPassField()}
          <FormControl className="input-field">
            <Button type='submit' variant='contained'>{this.props.showLogin ? 'Log In' : 'Sign Up'}</Button>
          </FormControl>
        </form>
      </div>
    )
  }
}

export default AuthForm

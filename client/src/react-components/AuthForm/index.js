import React, { Component } from 'react'
import NavBar from '../NavBar'
import { login, createUser } from '../../actions/actions.js'
import './styles.css'

export class AuthForm extends Component {
  state = {
    email: '',
    pass: '',
    confPass: ''
  }

  handleEmailChange = event => {
    this.setState({ email: event.target.value })
  }

  handlePassChange = event => {
    this.setState({ pass: event.target.value })
  }

  handleConfPassChange = event => {
    this.setState({ confPass: event.target.value })
  }

  getConfPassField = () => {
    if (!this.props.showLogin) {
      return (<div className="input-field">
      <label for="confPass">Confirm Password:</label>
      <input 
        name="confPass"
        type="password" 
        onFocus={this.setInputActive}
        onBlur={this.setInputInactive}  
        onChange={this.handleConfPassChange} 
        required 
      />
      </div>)
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
    // api call
    const payload = {
      email: this.state.email,
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
    // api 
    if (this.state.pass !== this.state.confPass) {
      return
    }
    const payload = {
      email: this.state.email,
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
          <h3 className="center-align"><i class="material-icons">{this.props.showLogin ? 'person' : 'person_add'}</i>{this.props.showLogin ? 'Log In' : 'Sign Up'}</h3>
          <div className="input-field">
            <label for="email">Email:</label>
            <input 
              name="email" 
              type="email"
              onFocus={this.setInputActive}
              onBlur={this.setInputInactive} 
              onChange={this.handleEmailChange} 
              required 
            />
          </div>
          <div className="input-field">
            <label for="pass">Password:</label>
            <input 
              type="password"
              name="pass"
              onFocus={this.setInputActive}
              onBlur={this.setInputInactive}
              onChange={this.handlePassChange} 
              required 
            />
          </div>
          {this.getConfPassField()}
          <div className="input-field">
              <input 
                type="submit" 
                value={this.props.showLogin ? 'Log In' : 'Sign Up'} 
                className="btn waves-effect waves-light right teal darken-2"
                required 
              />
          </div>
        </form>
      </div>
    )
  }
}

export default AuthForm

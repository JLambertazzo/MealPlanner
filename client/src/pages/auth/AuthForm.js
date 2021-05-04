import React, { useState } from 'react'
import NavBar from '../../components/general/NavBar'
import { useHistory } from 'react-router-dom'
import { login, createUser, reduxLogIn } from '../../actions/actions.js'
import { Button, TextField, FormControl, Typography } from '@material-ui/core'
import { Person, PersonAdd } from '@material-ui/icons'
import { useDispatch } from 'react-redux'
import './AuthForm.css'

export default function AuthForm (props) {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const [confPass, setConfPass] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()
  return (
    <div id='authForm'>
      <NavBar />
      <form
        className='container'
        onSubmit={props.showLogin ? (event) => handleLogin(event, username, pass, dispatch, history) : (event) => handleSignup(event, username, pass, confPass, dispatch, history)}
      >
        <Typography variant='h2'>{props.showLogin ? <Person /> : <PersonAdd />} {props.showLogin ? 'Log In' : 'Sign Up'}</Typography>
        <FormControl className='input-field'>
          <TextField label='Username' id='username-input' InputLabelProps={{ for: 'username-input' }} onChange={(event) => setUsername(event.target.value)} inputProps={{ minLength: 5 }} required />
        </FormControl>
        <FormControl className='input-field'>
          <TextField label='Password' id='pass-input' InputLabelProps={{ for: 'pass-input' }} type='password' onChange={(event) => setPass(event.target.value)} inputProps={{ minLength: 8 }} required />
        </FormControl>
        {getConfPassField(props, setConfPass)}
        <FormControl className='input-field'>
          <Button type='submit' variant='contained'>{props.showLogin ? 'Log In' : 'Sign Up'}</Button>
        </FormControl>
      </form>
    </div>
  )
}

const getConfPassField = (props, setConfPass) => {
  if (!props.showLogin) {
    return (
      <FormControl className='input-field'>
        <TextField
          label='Confirm Password'
          type='password'
          onChange={(event) => setConfPass(event.target.value)}
          inputProps={{ minLength: 8 }}
          required
          id='confpass-input'
          InputLabelProps={{ for: 'confpass-input' }}
        />
      </FormControl>)
  }
}

const handleLogin = async (event, username, pass, dispatch, history) => {
  event.preventDefault()
  const payload = {
    username: username,
    password: pass
  }
  try {
    const user = await login(payload)
    dispatch(reduxLogIn(user._id))
    console.log('logged in')
  } catch (error) {
    console.log('error l: ' + error)
  } finally {
    history.push('/calendar')
  }
}

const handleSignup = async (event, username, pass, confPass, dispatch, history) => {
  event.preventDefault()
  if (pass !== confPass) {
    return
  }
  const payload = {
    username: username,
    password: pass
  }
  try {
    await createUser(payload)
    const user = await login(payload)
    dispatch(reduxLogIn(user._id))
  } catch (error) {
    console.log('error s: ' + error)
  } finally {
    history.push('/calendar')
  }
}

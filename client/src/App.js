import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HomePage from './react-components/HomePage'
import Calendar from './react-components/Calendar'
import AuthForm from './react-components/AuthForm'

function App () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' render={() => <HomePage />} />
        <Route exact path='/calendar' render={() => <Calendar />} />
        <Route exact path='/login' render={() => <AuthForm showLogin={true}/>} />
        <Route exact path='/signup' render={() => <AuthForm showLogin={false}/>} />
      </Switch>
    </BrowserRouter>
  )
}

export default App

import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import HomePage from './react-components/HomePage'
import Calendar from './react-components/Calendar'

function App () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' render={() => <HomePage />} />
        <Route exact path='/calendar' render={() => <Calendar />} />
      </Switch>
    </BrowserRouter>
  )
}

export default App

import React, { Component } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'

import NavBar from '../NavBar'

export class CalendarView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datesWithMeals: [new Date()]
    }
  }

  addDate = date => {
    this.setState(prevState => ({
      datesWithMeals: [...prevState.datesWithMeals, date]
    }))
  }
  
  handleChange = value => {
    this.addDate(value)
  }
  
  render () {
    const styleCalendar = ({ date, view }) => {
      if (view === 'month') {
        if (this.state.datesWithMeals.find(el => el.toDateString() === date.toDateString())) {
          return 'testClassName'
        }
      } else {
        console.log('at least it ran')
      }
    }

    return (
      <div id='calView'>
        <NavBar />
        <Calendar onChange={this.handleChange} tileClassName={styleCalendar} />
      </div>
    )
  }
}

export default CalendarView

import React, { Component } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'

import NavBar from '../NavBar'

export class CalendarView extends Component {
  render () {
    return (
      <div id='calView'>
        <NavBar />
        <Calendar />
      </div>
    )
  }
}

export default CalendarView

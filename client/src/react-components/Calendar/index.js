import React, { Component } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'

import NavBar from '../NavBar'
import MealModal from '../MealModal'

export class CalendarView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datesWithMeals: [new Date()],
      showModal: false
    }
  }

  addDate = date => {
    this.setState(prevState => ({
      datesWithMeals: [...prevState.datesWithMeals, date]
    }))
  }

  setModal = show => {
    this.setState({
      showModal: show
    })
  }
  
  handleChange = value => {
    this.setModal(true)
    this.addDate(value)
  }
  
  render () {
    const calendarContent = ({ activeStartDate, date, view }) => {
      if (view === 'month') {
        if (this.state.datesWithMeals.find(el => el.toDateString() === date.toDateString())) {
          return(<div>.</div>) 
        } else { 
          return null 
        }
      }
    }

    return (
      <div id='calView'>
        <NavBar />
        <Calendar className="custom-calendar-styles grey lighten-5" onChange={this.handleChange} tileContent={calendarContent} />
        <MealModal isOpen={this.state.showModal} closeModal={() => this.setModal(false)} />
      </div>
    )
  }
}

export default CalendarView

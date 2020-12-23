import React, { Component } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'

import NavBar from '../NavBar'
import MealModal from '../MealModal'
import ListModal from '../ListModal'

export class CalendarView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datesWithMeals: [new Date()],
      showMealModal: false,
      showListModal: true,
      selectedDate: new Date()
    }
  }

  addDate = date => {
    this.setState(prevState => ({
      datesWithMeals: [...prevState.datesWithMeals, date]
    }))
  }

  setMealModal = show => {
    this.setState({
      showMealModal: show
    })
  }

  setListModal = show => {
    this.setState({
      showListModal: show
    })
  }
  
  handleChange = value => {
    this.setState({
      selectedDate: value
    })
    this.showListModal()
  }

  showMealModal = () => {
    this.setListModal(false)
    this.setMealModal(true)
  }

  showListModal = () => {
    this.setListModal(true)
    this.setMealModal(false)
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
        <ListModal 
          isOpen={this.state.showListModal} 
          exit={() => this.setListModal(false)} 
          date={this.state.selectedDate}
          showMealModal={this.showMealModal} 
        />
        <MealModal 
          isOpen={this.state.showMealModal} 
          exit={() => this.setMealModal(false)} 
          date={this.state.selectedDate}
          showListModal={this.showListModal} 
        />
      </div>
    )
  }
}

export default CalendarView

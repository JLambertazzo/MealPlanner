import React, { Component } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'

import NavBar from '../NavBar'
import MealModal from '../MealModal'
import ListModal from '../ListModal'
import ShoppingModal from '../ShoppingModal'
import IngredientModal from '../IngredientModal'

export class CalendarView extends Component {
  state = {
    datesWithMeals: [new Date()],
    showMealModal: false,
    showListModal: false,
    showShoppingModal: false,
    showIngredientModal: false,
    selectedDate: new Date()
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

  setShoppingModal = show => {
    this.setState({
      showShoppingModal: show
    })
  }
  setIngredientModal = show => {
    this.setState({
      showIngredientModal: show
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
        <NavBar uid={this.props.uid}/>
        <Calendar className="custom-calendar-styles grey lighten-5" onChange={this.handleChange} tileContent={calendarContent} />
        <div id="buttonContainer" className={(this.state.showListModal || this.state.showMealModal || this.state.showShoppingModal || this.state.showIngredientModal 
          ? 'hide' : '')}>
          <button className="btn waves-effect waves-light" onClick={() => this.setShoppingModal(true)} ><i className="material-icons left">list</i>Generate Shopping List</button>
          <button className="btn waves-effect waves-light" onClick={() => this.setIngredientModal(true)}><i className="material-icons left">mode_edit</i>Edit My Ingredients</button>
        </div>
        <ListModal 
          uid={this.props.uid}
          isOpen={this.state.showListModal} 
          exit={() => this.setListModal(false)} 
          date={this.state.selectedDate}
          showMealModal={this.showMealModal}
        />
        <MealModal
          uid={this.props.uid}
          isOpen={this.state.showMealModal} 
          exit={() => this.setMealModal(false)} 
          date={this.state.selectedDate}
          showListModal={this.showListModal} 
        />
        <ShoppingModal
          uid={this.props.uid}
          isOpen={this.state.showShoppingModal}
          exit={() => this.setShoppingModal(false)}
        />
        <IngredientModal
          uid={this.props.uid}
          isOpen={this.state.showIngredientModal}
          exit={() => this.setIngredientModal(false)}  
        />
      </div>
    )
  }
}

export default CalendarView

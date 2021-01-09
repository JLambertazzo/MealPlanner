import React, { Component } from 'react'
import Calendar from 'react-calendar'
import { Button } from '@material-ui/core'
import { List, Edit } from '@material-ui/icons'
import { getUserById } from '../../actions/actions'
import 'react-calendar/dist/Calendar.css'
import './style.css'

import NavBar from '../NavBar'
import MealModal from '../MealModal'
import ListModal from '../ListModal'
import ShoppingModal from '../ShoppingModal'
import IngredientModal from '../IngredientModal'

export class CalendarView extends Component {
  state = {
    datesWithMeals: [],
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.uid !== prevProps.uid || (this.state.showListModal === false && prevState.showListModal === true)) {
      getUserById(this.props.uid).then(user => {
        if (!user) {
          return
        }
        const datesWithMeals = []
        user.meals.forEach(meal => {
          if (!datesWithMeals.includes(new Date(meal.date).toDateString())) {
            datesWithMeals.push(new Date(meal.date).toDateString())
          }
        })
        this.setState({ datesWithMeals: datesWithMeals })
      })
    }
  }
  
  render () {
    const calendarContent = ({ date, view }) => {
      if (view === 'month' && this.props.uid) {
        if (this.state.datesWithMeals.includes(date.toDateString())) {
          return(<div>.</div>) 
        } else { 
          return null 
        }
      }
    }

    return (
      <div id='calView'>
        <NavBar uid={this.props.uid}/>
        <div id='content'>
          <Calendar className="custom-calendar-styles" calendarType='US' onChange={this.handleChange} tileContent={calendarContent} minDetail='month'/>
          <div id="buttonContainer" className={(this.state.showListModal || this.state.showMealModal || this.state.showShoppingModal || this.state.showIngredientModal 
            ? 'hide' : '')}>
            <Button color='primary' variant='contained' onClick={() => this.setShoppingModal(true)} startIcon={<List />}>Generate Shopping List</Button>
            <Button color='primary' variant='contained' onClick={() => this.setIngredientModal(true)} startIcon={<Edit />}>Edit My Ingredients</Button>
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
      </div>
    )
  }
}

export default CalendarView

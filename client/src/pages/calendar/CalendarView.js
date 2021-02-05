import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import { Button } from '@material-ui/core'
import { List, Edit } from '@material-ui/icons'
import { getUserById } from '../../actions/actions'
import 'react-calendar/dist/Calendar.css'
import './CalendarView.css'

import NavBar from '../../components/general/NavBar'
import MealModal from '../../components/calendar/MealModal'
import ListModal from '../../components/calendar/ListModal'
import ShoppingModal from '../../components/calendar/ShoppingModal'
import IngredientModal from '../../components/calendar/IngredientModal'

export default function CalendarView (props) {
  useEffect(() => {
    getUserById(props.uid).then(user => {
      if (!user) {
        return
      }
      const datesWithMeals = []
      user.meals.forEach(meal => {
        if (!datesWithMeals.includes(new Date(meal.date).toDateString())) {
          datesWithMeals.push(new Date(meal.date).toDateString())
        }
      })
      setDatesWithMeals(datesWithMeals)
    })
  }, [props.uid])
  const [datesWithMeals, setDatesWithMeals] = useState([])
  const [showMealModal, setShowMealModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showShoppingModal, setShowShoppingModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const calendarContent = ({ date, view }) => {
    if (view === 'month' && props.uid) {
      if (datesWithMeals.includes(date.toDateString())) {
        return (<div>.</div>)
      } else {
        return null
      }
    }
  }

  const toMealModal = () => {
    setShowListModal(false)
    setShowMealModal(true)
  }

  const toListModal = () => {
    setShowListModal(true)
    setShowMealModal(false)
  }

  return (
    <div id='calView'>
      <NavBar uid={props.uid} />
      <div id='content'>
        <div id='main'>
          <div>
            <Calendar className="custom-calendar-styles" calendarType='US' onChange={(value) => handleChange(value, setShowListModal, setSelectedDate)} tileContent={calendarContent} minDetail='month' />
          </div>
          <div id="buttonContainer" className={(showListModal || showMealModal || showShoppingModal || showIngredientModal ? 'hide' : '')}>
            <Button color='primary' variant='contained' onClick={() => setShowShoppingModal(true)} startIcon={<List />}>My Shopping List</Button>
            <Button color='primary' variant='contained' onClick={() => setShowIngredientModal(true)} startIcon={<Edit />}>Edit My Pantry</Button>
          </div>
        </div>
        <ListModal
          uid={props.uid}
          isOpen={showListModal}
          exit={() => setShowListModal(false)}
          date={selectedDate}
          showMealModal={toMealModal}
        />
        <MealModal
          uid={props.uid}
          isOpen={showMealModal} 
          exit={() => setShowMealModal(false)}
          date={selectedDate}
          showListModal={toListModal}
        />
        <ShoppingModal
          uid={props.uid}
          isOpen={showShoppingModal}
          exit={() => setShowShoppingModal(false)}
        />
        <IngredientModal
          uid={props.uid}
          isOpen={showIngredientModal}
          exit={() => setShowIngredientModal(false)}
        />
      </div>
    </div>
  )
}

const handleChange = (value, setShowListModal, setSelectedDate) => {
  setSelectedDate(value)
  setShowListModal(true)
}

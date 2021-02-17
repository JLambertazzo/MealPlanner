import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Calendar from 'react-calendar'
import { Typography, List, ListItem, ListItemText } from '@material-ui/core'
import { getUserById } from '../../actions/actions'
import datetime from 'date-and-time'
import 'react-calendar/dist/Calendar.css'
import './CalendarView.css'

import NavBar from '../../components/general/NavBar'
import ActionDrawer from '../../components/calendar/ActionDrawer'
import MealModal from '../../components/calendar/MealModal'
import ListModal from '../../components/calendar/ListModal'
import ShoppingModal from '../../components/calendar/ShoppingModal'
import IngredientModal from '../../components/calendar/IngredientModal'

export default function CalendarView (props) {
  const [mealsByDate, setMealsByDate] = useState({})
  const [showMealModal, setShowMealModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showShoppingModal, setShowShoppingModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDrawer, setShowDrawer] = useState(false)
  const width = useWidth()
  const firstUpdate = useRef(true)
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    getUserById(props.uid).then(user => {
      if (!user) {
        return
      }
      const mealsByDate = {}
      user.meals.forEach(meal => {
        if (mealsByDate[new Date(meal.date).toDateString()]) {
          mealsByDate[new Date(meal.date).toDateString()].push(meal)
        } else {
          mealsByDate[new Date(meal.date).toDateString()] = [meal]
        }
      })
      setMealsByDate(mealsByDate)
    })
  }, [props.uid, showMealModal, showListModal, showShoppingModal, showIngredientModal])
  useEffect(() => {
    setShowDrawer(false)
  }, [showMealModal, showListModal, showShoppingModal, showIngredientModal])

  const calendarContent = ({ date, view }) => {
    if (view === 'month' && props.uid) {
      return getTileContent(mealsByDate[date.toDateString()])
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
          <ActionDrawer
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            setShowShoppingModal={setShowShoppingModal}
            setShowIngredientModal={setShowIngredientModal} 
          />
          <div className={showDrawer ? 'shade' : 'shade hide'} onClick={() => setShowDrawer(false)}/>
          <Calendar
            className="custom-calendar-styles"
            calendarType='US'
            onChange={(value) => handleChange(value, setShowListModal, setSelectedDate)}
            tileContent={calendarContent}
            tileClassName={'calendar-button-styles'}
            formatShortWeekday={(locale, date) => datetime.format(date, (width > 768 ? 'dddd' : 'ddd'))}
            minDetail='month'
          />
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

const getTileContent = (meals) => {
  if (meals) {
    return(
      <div>
        <List className='calendar-list'>
          {
            meals.map((meal, index) => {
              if (index < 3) {
                return (  
                  <ListItem className='calendar-list-item'>
                    <ListItemText primary={<Typography variant='body2'><b>{index === 2 ? '...' : meal.name}</b></Typography>} />
                  </ListItem>
                )
              } else {
                return null
              }
            })
          }
        </List>
        <Typography className='meal-count-display' variant='body2'><b>{meals.length}<span className='meal-count-text'> meals</span></b></Typography>
      </div>
    )
  } else {
    console.log('null stuff')
    return null
  }
}

const useWidth = () => {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return width;
}

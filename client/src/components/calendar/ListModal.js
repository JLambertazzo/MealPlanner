import React, { useState } from 'react'
import Modal from 'react-modal'
import { Button, Accordion, AccordionSummary, AccordionDetails, ButtonGroup, Typography } from '@material-ui/core'
import { Add, Close, ExpandMore } from '@material-ui/icons'
import { getUserById } from '../../actions/actions'
import { uid } from 'react-uid'
import './ListModal.css'

export default function ListModal (props) {
  const [meals, setMeals] = useState([])
  return (
    <Modal
      id='listModal'
      isOpen={props.isOpen}
      onAfterOpen={() => getMealsToday(props, setMeals)}
      onRequestClose={props.exit}
      contentLabel='List Modal'
    >
      <div className='modalHeader'>
        <Typography variant='h4'>Meals for {props.date.toDateString()}:</Typography>
        <ButtonGroup id='controlButtons'>
          <Button variant='contained' onClick={() => showMealModal(props)} startIcon={<Add />}>New Meal</Button>
          <Button variant='contained' onClick={props.exit} startIcon={<Close />}>Close</Button>
        </ButtonGroup>
      </div>
      {meals.map(meal => {
        return (
          <Accordion key={uid(meal)}>
            <AccordionSummary expandIcon={<ExpandMore />} ><Typography variant='h6'>{getMealText(meal.mealNum)} {meal.name}</Typography></AccordionSummary>
            <AccordionDetails>
              <div className='mealDetails'>
                <Typography variant='h6'>Ingredients: </Typography>
                <ul>
                  {
                    meal.ingredients.map(ingredient => {
                      return (
                        <li key={uid(ingredient)}>
                          {ingredient.qty} {ingredient.units} of {ingredient.name}
                        </li>)
                    })
                  }
                </ul>
              </div>
              <div className='mealDetails'>
                <Typography variant='h6'>Description:</Typography>
                <ul>{meal.description}</ul>
              </div>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Modal>
  )
}

const getMealsToday = (props, setMeals) => {
  if (!props.uid) {
    return
  }
  getUserById(props.uid).then(res => {
    const mealsToday = res.meals.filter(element => {
      const mealDate = new Date(element.date)
      return (mealDate.toDateString() === props.date.toDateString())
    })
    setMeals(mealsToday)
  }).catch(error => console.log(error))
}

const showMealModal = (props) => {
  props.showMealModal()
  props.exit()
}

const getMealText = (mealNum) => {
  if (mealNum === 0) {
    return 'Breakfast:'
  } else if (mealNum === 1) {
    return 'Lunch:'
  } else if (mealNum === 2) {
    return 'Dinner:'
  } else {
    return 'Snack:'
  }
}

import React, { Component } from 'react'
import Modal from 'react-modal'
import { Button, Accordion, AccordionSummary, AccordionDetails, ButtonGroup, Typography } from '@material-ui/core'
import { Add, Close, ExpandMore } from '@material-ui/icons'
import { getUserById } from '../../actions/actions'
import './styles.css'

export class ListModal extends Component {
  state = {
    meals: []
  }

  getMealsToday = () => {
    if (!this.props.uid) {
      console.log(this.props.uid, 'no uid')
      return
    }
    getUserById(this.props.uid).then(res => {
      const mealsToday = res.meals.filter(element => {
        const mealDate = new Date(element.date)
        return (mealDate.toDateString() === this.props.date.toDateString())
      })
      this.setState({
        meals: mealsToday
      })
    }).catch(error => console.log(error))
  }
  
  showMealModal = () => {
    this.props.showMealModal()
    this.props.exit()
  }

  getMealText = (mealNum) => {
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

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        id='listModal'
        isOpen={this.props.isOpen}
        onAfterOpen={this.getMealsToday}
        onRequestClose={this.props.exit}
        contentLabel="List Modal"
      >
        <div className='modalHeader'>
          <Typography variant='h4'>Meals for {this.props.date.toDateString()}:</Typography>
          <ButtonGroup id='controlButtons'>
            <Button variant='contained' onClick={this.showMealModal} startIcon={<Add />}>New Meal</Button>
            <Button variant='contained' onClick={this.props.exit} startIcon={<Close />}>Close</Button>
          </ButtonGroup>
        </div>
          
        {this.state.meals.map(meal => {
          return(
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />} ><Typography variant='h6'>{this.getMealText(meal.mealNum)} {meal.name}</Typography></AccordionSummary>
              <AccordionDetails>
                <div className='mealDetails'>
                  <Typography variant='h6'>Ingredients: </Typography>
                  <ul>
                    {
                      meal.ingredients.map(ingredient => {
                        return(<li>
                          {ingredient.qty} {ingredient.name}
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
}

export default ListModal

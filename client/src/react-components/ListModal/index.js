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
          <ButtonGroup>
            <Button variant='contained' color='danger' onClick={this.showMealModal} startIcon={<Add />}>New Meal</Button>
            <Button variant='contained' onClick={this.props.exit} startIcon={<Close />}>Close</Button>
          </ButtonGroup>
        </div>
          
        {this.state.meals.map(meal => {
          return(
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />} >{meal.name}</AccordionSummary>
              <AccordionDetails>
                <h6>Ingredients: </h6>
                <ul>
                  {
                    meal.ingredients.map(ingredient => {
                      return(<li>
                        {ingredient.qty} {ingredient.name}
                      </li>)
                    })
                  }
                </ul>
                <h6>Description:</h6>
                <ul>{meal.description}</ul>
              </AccordionDetails>
            </Accordion>
          )
        })}

      </Modal>
    )
    }
}

export default ListModal

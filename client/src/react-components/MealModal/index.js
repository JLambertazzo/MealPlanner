import React, { Component } from 'react'
import Modal from 'react-modal'
import { Select, FormControl, InputLabel, Button, TextField, MenuItem, Input } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'
import { addMeal } from '../../actions/actions'
import './styles.css'

export class index extends Component {
  state = {
    mealName: '',
    mealNum: '',
    ingredients: [{
      name: '',
      qty: ''
    }],
    description: ''
  }

  handleReturn = () => {
    this.props.showListModal()
    this.props.exit()
  }

  handleClose = () => {
    this.setState({ ingredients: [{ name: '', qty: 0 }] })
  }

  handleNameChange = event => {
    this.setState({ mealName: event.target.value })
  }

  handleNumChange = event => {
    this.setState({ mealNum: event.target.value })
  }

  handleIngredientQtyChange = event => {
    const index = event.target.parentElement.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].qty = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleIngredientNameChange = event => {
    const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].name = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleAddIngredient = event => {
    event.preventDefault()
    this.setState(prevState => { 
      return {
        ingredients: [...prevState.ingredients, { name: '', qty: '' }]
      }
    })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    const validMealNum = this.state.mealNum || 0
    // convert mealNum to number and call api
    const payload = {
      name: this.state.mealName,
      ingredients: this.state.ingredients.filter(ingredient => ingredient.name && ingredient.qty),
      date: this.props.date.toString(),
      mealNum: parseInt(validMealNum),
      description: this.state.description
    }
    addMeal(payload, this.props.uid).then(() => this.handleReturn()).catch(error => console.log(error))
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
        onAfterClose={this.handleClose}
        contentLabel="Meal Modal"
      >
        <Button variant='contained' startIcon={<ChevronLeft />} onClick={this.handleReturn}>Return</Button>
        <h4>Add a meal for {this.props.date.toDateString()}</h4>
        <form id='mealModalForm' onSubmit={this.handleSubmit}>
          <FormControl className="input-field">
            <TextField label='Meal Name' onChange={this.handleNameChange} required />
          </FormControl>
          <FormControl className="input-field">
            <InputLabel id='selectLabel'>Meal:</InputLabel>
            <Select labelId='selectLabel' name='mealNum' id="mealSelect" onChange={this.handleNumChange} required >
              <MenuItem value="0">Breakfast</MenuItem>
              <MenuItem value="1">Lunch</MenuItem>
              <MenuItem value="2">Dinner</MenuItem>
              <MenuItem value="3">Snack</MenuItem>
            </Select>
          </FormControl>
          <FormControl className='input-field list-holder'>
            <h6>Ingredients:</h6>
            <ul>
            {
              this.state.ingredients.map((ingredient, index) => {
                return(
                  <li className='ingredientContainer' index={index}>
                    <Input className='qInput' type='number' placeholder='Quantity' onChange={this.handleIngredientQtyChange} />
                    <TextField className='nInput' label='Ingredient Name' onChange={this.handleIngredientNameChange} />
                  </li>
                )
              })
            }
            </ul>
            <Button variant='contained' onClick={this.handleAddIngredient}>Add Ingredient</Button>
          </FormControl>
          <FormControl className="input-field">
            <TextField label='Meal Description' onChange={this.handleDescriptionChange} />
          </FormControl>
          <Button type="submit" variant='contained'>Submit</Button>
          <Button variant='contained' onClick={this.props.exit}>Cancel</Button>
        </form>
      </Modal>
    )
  }
}

export default index

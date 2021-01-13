import React, { Component } from 'react'
import Modal from 'react-modal'
import { getUserById, setIngredients } from '../../actions/actions'
import { Button, Typography, TextField } from '@material-ui/core'
import { Save, Add, ChevronLeft } from '@material-ui/icons'
import './styles.css'

export class IngredientModal extends Component {
  state = {
    ingredients: [{
      name: '',
      qty: ''
    }]
  }

  getData = () => {
    getUserById(this.props.uid).then(user => {
      if (user.ingredients.length !== 0) {
        this.setState({
          ingredients: user.ingredients
        })
      }
    }).catch(error => console.log(error))
  }

  saveData = () => {
    this.state.ingredients.forEach(ingredient => {
      if (ingredient.qty === '') {
        ingredient.qty = 0
      }
    })
    setIngredients({ ingredients: this.state.ingredients }, this.props.uid).then(res => {
      console.log('saved successfully') // TODO display in frontend please
    }).catch(error => console.log(error))
  }

  handleReturn = () => {
    this.props.exit()
  }

  handleIngredientQtyChange = event => {
    const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
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

  afterClose = () => {
    this.setState({ ingredients: [{ name: '', qty: '' }] })
  }

  render() {
    return (
      <Modal
        id='ingredientModal'
        isOpen={this.props.isOpen}
        onAfterOpen={this.getData}
        onRequestClose={this.props.exit}
        onAfterClose={this.afterClose}
        contentLabel="Ingredients Modal"
      >
        <div className='modalHeader'>
          <Typography variant='h4'>My Ingredients:</Typography>
          <Button onClick={this.handleReturn} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
        </div>
        <div className='list-holder'>
          <ul>
            {
              this.state.ingredients.map((ingredient, index) => {
                return(
                  <div>
                    <li className='ingredientContainer' index={index}>
                      <TextField label='Quantity' className='qInput' type='number' value={ingredient.qty} onChange={this.handleIngredientQtyChange} />
                      <TextField label='Ingredient' className='nInput' type='text' value={ingredient.name} onChange={this.handleIngredientNameChange} />
                    </li>
                    <hr />
                  </div>
                )
              })
            }
          </ul>
          <Button variant='contained' startIcon={<Add />} onClick={this.handleAddIngredient}>Add Ingredient</Button>
          <Button id='saveButton' variant='contained' startIcon={<Save />} onClick={this.saveData}>Save Data</Button>
        </div>
      </Modal>
    )
  }
}

export default IngredientModal

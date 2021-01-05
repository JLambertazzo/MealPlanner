import React, { Component } from 'react'
import Modal from 'react-modal'
import { getUserById, setIngredients } from '../../actions/actions'
import { Button } from '@material-ui/core'
import { Save, Add, ChevronLeft } from '@material-ui/icons'
import './styles.css'

export class IngredientModal extends Component {
  state = {
    ingredients: [{
      name: '',
      qty: 0
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
    setIngredients({ ingredients: this.state.ingredients }, this.props.uid).then(res => {
      console.log('saved successfully') // TODO display in frontend please
    }).catch(error => console.log(error))
  }

  handleReturn = () => {
    this.props.exit()
  }

  handleIngredientQtyChange = event => {
    const index = event.target.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].qty = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleIngredientNameChange = event => {
    const index = event.target.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].name = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleAddIngredient = event => {
    event.preventDefault()
    this.setState(prevState => { 
      return {
        ingredients: [...prevState.ingredients, { name: '', qty: 0 }]
      }
    })
  }

  afterClose = () => {
    this.setState({ ingredients: [{ name: '', qty: 0 }] })
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onAfterOpen={this.getData}
        onRequestClose={this.props.exit}
        onAfterClose={this.afterClose}
        contentLabel="Ingredients Modal"
      >
        <Button onClick={this.handleReturn} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
        <h5>My Ingredients:</h5>
        <div className='list-holder'>
          <ul>
            {
              this.state.ingredients.map((ingredient, index) => {
                return(
                  <li className='ingredientContainer' index={index}>
                    <input className='qInput' type='number' value={ingredient.qty} placeholder='Quantity' onChange={this.handleIngredientQtyChange} />
                    <input className='nInput' type='text' value={ingredient.name} placeholder='Ingredient Name' onChange={this.handleIngredientNameChange} />
                  </li>
                )
              })
            }
          </ul>
          <Button variant='contained' startIcon={<Add />} onClick={this.handleAddIngredient}>Add Ingredient</Button>
          <Button variant='contained' startIcon={<Save />} onClick={this.saveData}>Save Data</Button>
        </div>
      </Modal>
    )
  }
}

export default IngredientModal

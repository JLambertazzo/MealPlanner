import React, { Component } from 'react'
import Modal from 'react-modal'
import { addMeal } from '../../actions/actions'
import './styles.css'

export class index extends Component {
  state = {
    mealName: '',
    mealNum: '',
    ingredients: [{
      name: '',
      qty: 0
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
        <button onClick={this.handleReturn} className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">chevron_left</i>Return</button>
        <h4>Add a meal for {this.props.date.toDateString()}</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="input-field">
            <input type="text" className="validate" placeholder="Meal Name" onChange={this.handleNameChange} required />
          </div>
          <div className="input-field">
            <select id="mealSelect" onChange={this.handleNumChange}>
              <option value="0">Breakfast</option>
              <option value="1">Lunch</option>
              <option value="2">Dinner</option>
              <option value="3">Snack</option>
            </select>

          </div>
          <div className='input-field list-holder'>
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
            <button className='btn waves-effect waves-light' onClick={this.handleAddIngredient}>Add Ingredient</button>
          </div>
          <div className="input-field">
            <input type="text" placeholder="Description" className="validate" onChange={this.handleDescriptionChange} />
          </div>
          <input type="submit" value="Submit" className="btn waves-effect waves-light teal darken-3 right" />
          <input type="submit" value="Cancel" onClick={this.props.exit} className="btn waves-effect waves-light red darken-2 right" />
        </form>
      </Modal>
    )
  }
}

export default index

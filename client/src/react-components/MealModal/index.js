import React, { Component } from 'react'
import Modal from 'react-modal'
import './styles.css'

export class index extends Component {
  state = {
    mealName: '',
    mealNum: '',
    ingredients: [],
    description: ''
  }

  handleReturn = () => {
    this.props.showListModal()
    this.props.exit()
  }

  handleNameChange = event => {
    this.setState({ mealName: event.target.value })
  }

  handleNumChange = event => {
    this.setState({ mealNum: event.target.value })
  }

  handleIngredientChange = event => {
    this.setState({ ingredients: event.target.value.split(',').forEach(el => el.trim()) })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    if (this.state.mealNum === '') {
      this.setState({ mealNum: '0' })
    }
    // convert mealNum to number and call api
    this.handleReturn()
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
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
          <div className="input-field list-holder">
            <input placeholder="ingredients" className="validate" onChange={this.handleIngredientChange} required />
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

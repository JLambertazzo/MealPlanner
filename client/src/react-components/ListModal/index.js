import React, { Component } from 'react'
import Modal from 'react-modal'
import './styles.css'

export class ListModal extends Component {
  getMealsByDate(date = new Date()) {
    // hardcoded for now
    return [
      {
        name: 'name',
        date: new Date(),
        mealNum: 2,
        ingredients: [],
        description: 'a meal'
      },
      {
        name: 'name2',
        date: new Date(),
        mealNum: 2,
        ingredients: [],
        description: 'a meal'
      },
      {
        name: 'name3',
        date: new Date(),
        mealNum: 2,
        ingredients: [],
        description: 'a meal'
      },
      {
        name: 'name4',
        date: new Date(),
        mealNum: 2,
        ingredients: [],
        description: 'a meal'
      },
      {
        name: 'name5',
        date: new Date(),
        mealNum: 2,
        ingredients: [],
        description: 'a meal'
      },
      {
        name: 'name6',
        date: new Date(),
        mealNum: 2,
        ingredients: [],
        description: 'a meal'
      }
    ]
  }

  showMealModal = () => {
    this.props.showMealModal()
    this.props.exit()
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
      isOpen={this.props.isOpen}
      onAfterOpen={this.afterModalOpen}
      onRequestClose={this.props.exit}
      contentLabel="List Modal"
      >
        <h4>Meals for {this.props.date.toDateString()}:</h4>
          
        {this.getMealsByDate().map(meal => {
          return(<details>
            <summary>{meal.name}</summary>
            <h6>Ingredients: </h6>
            <ul>{meal.ingredients}</ul>
            <h6>Description:</h6>
            <ul>{meal.description}</ul>
          </details>)
        })}

        <button onClick={this.showMealModal} className="btn waves-effect waves-light teal darken-2 right"><i className='material-icons left'>add</i>New Meal</button>
        <button onClick={this.props.exit} className="btn waves-effect waves-light red darken-2 right"><i className="material-icons left">close</i>Close</button>
      </Modal>
    )
    }
}

export default ListModal

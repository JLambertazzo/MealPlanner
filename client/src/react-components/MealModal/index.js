import React, { Component } from 'react'
import Modal from 'react-modal'
import './style.css'

export class index extends Component {
  handleReturn = () => {
    this.props.showListModal()
    this.props.exit()
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterModalOpen}
        onRequestClose={this.props.exit}
        contentLabel="Meal Modal"
      >
        <button onClick={this.handleReturn} className="btn waves-effect waves-light teal darken-2"><i class="material-icons left">chevron_left</i>Return</button>
        <h4>Add a meal for {this.props.date.toDateString()}</h4>
        <form>
          <div className="input-field">
            <input type="text" className="validate" placeholder="Meal Name" required />
          </div>
          <div className="input-field">
            <select id="mealSelect">
              <option value="0">Breakfast</option>
              <option value="1">Lunch</option>
              <option value="2">Dinner</option>
              <option value="3">Snack</option>
            </select>

          </div>
          <div className="input-field">
            <input type="text" placeholder="ingredients - fix" className="validate" required/>
          </div>
          <div className="input-field">
            <input type="text" placeholder="Description" className="validate" />
          </div>
          <input type="submit" value="Cancel" onClick={this.props.exit} className="btn waves-effect waves-light red darken-2 right" />
          <input type="submit" value="Submit" className="btn waves-effect waves-light teal darken-3 right" />
        </form>
      </Modal>
    )
  }
}

export default index

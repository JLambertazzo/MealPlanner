import React, { Component } from 'react'
import Modal from 'react-modal'
import './style.css'

export class index extends Component {
  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        isOpen={this.props.isOpen}
        onAfterOpen={this.afterModalOpen}
        onRequestClose={this.props.closeModal}
        contentLabel="Meal Modal"
      >
        <form>
          <div className="input-field">
            <input type="text" className="validate" placeholder="Meal Name" required />
          </div>
          <div className="input-field">
            <input type="date" className="validate" required />

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
          <input type="submit" value="Cancel" onClick={this.props.closeModal} className="btn waves-effect waves-light red darken-2" />
          <input type="submit" value="Submit" className="btn waves-effect waves-light teal darken-3" />
        </form>
      </Modal>
    )
  }
}

export default index

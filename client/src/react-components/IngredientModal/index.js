import React, { Component } from 'react'
import Modal from 'react-modal'
import './styles.css'

export class IngredientModal extends Component {
  handleReturn = () => {
    this.props.exit()
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
        contentLabel="Ingredients Modal"
      >
        <button onClick={this.handleReturn} className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">chevron_left</i>Return</button>
        <h5>Ingredients:</h5>
      </Modal>
    )
  }
}

export default IngredientModal

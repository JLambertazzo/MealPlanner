import React, { Component } from 'react'
import Modal from 'react-modal'
import { uid } from 'react-uid'
import { getUserById } from '../../actions/actions'
import './styles.css'

export class ShoppingModal extends Component {
  state = {
    need: {}
  }

  getData = () => {
    getUserById(this.props.uid).then(user => {
      const need = {}
      user.meals.forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          need[ingredient.name] = ingredient.qty
        })
      })
      user.ingredients.forEach(ingredient => {
        if (need[ingredient.name] && (need[ingredient.name] - ingredient.qty) > 0) {
          need[ingredient.name] -= ingredient.qty
        } else if (need[ingredient.name]) {
          delete need[ingredient.name]
        }
      })
      this.setState({
        need: need
      })
    })
  }

  handleReturn = () => {
    this.props.exit()
  }

  handleCopy = () => {
    const text = this.state.need.reduce((acc, curr) => {
      acc = `${acc}- ${curr} `
    })
    // maybe use a lib or something
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
        onAfterOpen={this.getData}
        contentLabel="Shopping List Modal"
      >
        <button onClick={this.handleReturn} className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">chevron_left</i>Return</button>
        <div id="shoppingContainer">
          <h5>My Shopping List:</h5>
          <ul>
            {
              Object.keys(this.state.need).map(key => {
                return(
                  <li key={uid(key)}>{this.state.need[key]} {key}</li>
                )
              })
            }
          </ul>
        </div>  
        <h5>Export List:</h5>
        <div id="exportContainer">
          <button className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">content_copy</i>Copy to Clipboard</button>
          <button className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">printer</i>Print</button>
          <button className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">email</i>Share by Email</button>
          <button className="btn waves-effect waves-light teal darken-2"><i className="material-icons left">message</i>Share by Messenger</button>
        </div>
      </Modal>
    )
  }
}

export default ShoppingModal

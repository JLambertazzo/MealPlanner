import React, { Component } from 'react'
import Modal from 'react-modal'
import { uid } from 'react-uid'
import { getUserById } from '../../actions/actions'
import './styles.css'

export class ShoppingModal extends Component {
  state = {
    need: []
  }

  getData = () => {
    const have = ['hardcoded', 'for']
    getUserById(this.props.uid).then(user => {
      user.meals.forEach(meal => {
        const keep = meal.ingredients.filter(el => !have.includes(el))
        this.setState(prevState => {
          return { need: [...prevState.need, ...keep] }
        })
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
              this.state.need.map(el => {
                return(
                  <li key={uid(el)}>{el.name}</li>
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

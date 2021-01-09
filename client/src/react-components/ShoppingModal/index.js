import React, { Component } from 'react'
import Modal from 'react-modal'
import { uid } from 'react-uid'
import { getUserById } from '../../actions/actions'
import { Button, Typography } from '@material-ui/core'
import { ChevronLeft, FileCopy, Print, Email, Message } from '@material-ui/icons'
import './styles.css'

export class ShoppingModal extends Component {
  state = {
    need: {}
  }

  getData = () => {
    getUserById(this.props.uid).then(user => {
      if (!user) {
        return
      }
      const need = {}
      user.meals.forEach(meal => {
        if (Date.now() < new Date(meal.date).getTime()) {
          meal.ingredients.forEach(ingredient => {
            need[ingredient.name] = ingredient.qty
          })
        }
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

  getText = () => {
    const text = Object.keys(this.state.need).reduce((acc, curr) => {
      acc = `${acc}- ${curr}: ${this.state.need[curr]} `
    }, '')
    return text
  }

  handleCopy = () => {
    window.navigator.clipboard.writeText(this.getText())
  }

  handleEmail = () => {
    window.open(`mailto:?subject=Groceries&body=${this.getText()}`, '_blank')
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        id='shoppingModal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
        onAfterOpen={this.getData}
        contentLabel="Shopping List Modal"
      >
        <div className='modalHeader'>
          <Typography variant='h4'>My Shopping List:</Typography>
          <Button onClick={this.handleReturn} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
        </div>
        <div id="shoppingContainer">
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
        <Typography variant='h5' align='center'>Export List:</Typography>
        <div id="exportContainer">
          <Button variant='contained' onClick={this.handleCopy} startIcon={<FileCopy />}>Copy to Clipboard</Button>
          <Button variant='contained' onClick={() => window.print()} startIcon={<Print />}>Print</Button>
          <Button variant='contained' onClick={this.handleEmail} startIcon={<Email />}>Share by Email</Button>
        </div>
      </Modal>
    )
  }
}

export default ShoppingModal

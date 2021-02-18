import React, { useState } from 'react'
import Modal from 'react-modal'
import { getUserById, setUserIngredients } from '../../actions/actions'
import { Button, Typography, Snackbar, SnackbarContent, makeStyles, IconButton } from '@material-ui/core'
import { Save, Add, ChevronLeft, ErrorOutline, Close, CheckCircleOutline } from '@material-ui/icons'
import IngredientList from '../general/IngredientList'
import './IngredientModal.css'

export default function IngredientModal (props) {
  const [ingredients, setIngredients] = useState([{ name: '', units: 'cup', qty: '' }])
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  const classes = useStyles()
  return (
    <Modal
      id='ingredientModal'
      isOpen={props.isOpen}
      onAfterOpen={() => getData(props, setIngredients)}
      onRequestClose={props.exit}
      onAfterClose={() => afterClose(setIngredients)}
      contentLabel="Ingredients Modal"
    >
      <div className='modalHeader'>
        <Typography variant='h4'>My Ingredients:</Typography>
        <Button onClick={props.exit} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
      </div>
      <div className='list-holder'>
        <IngredientList
          ingredients={ingredients}
          uid={props.uid}
          handleQtyChange={(event) => handleIngredientQtyChange(event, ingredients, setIngredients)}
          handleUnitsChange={(event) => handleIngredientUnitsChange(event, ingredients, setIngredients)}
          handleNameChange={(event) => handleIngredientNameChange(event, ingredients, setIngredients)}
          removeIngredient={(index) => removeIngredient(index, ingredients, setIngredients)}
        />
        <Button variant='contained' startIcon={<Add />} onClick={(event) => handleAddIngredient(event, ingredients, setIngredients)}>Add Ingredient</Button>
        <Button id='saveButton' variant='contained' startIcon={<Save />} onClick={() => saveData(props, ingredients, setSuccessOpen, setErrorOpen)}>Save Data</Button>
        <Snackbar
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          autoHideDuration={4000}
          anchorOrigin={{ 
            vertical: 'bottom',
            horizontal: 'center'
          }}
          >
          <SnackbarContent
            message={<Typography variant='body1'><CheckCircleOutline className={classes.snackbarIcon} />Successfully Saved Ingredients...</Typography>}
            action={<IconButton className={classes.snackbarIcon} aria-label='close snackbar'><Close /></IconButton>}
            className={classes.successSnackbar}
          />
        </Snackbar>
        <Snackbar
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          autoHideDuration={4000}
          anchorOrigin={{ 
            vertical: 'bottom',
            horizontal: 'center'
          }}
          >
          <SnackbarContent
            message={<Typography variant='body1'><ErrorOutline className={classes.snackbarIcon} />Error Saving Ingredients...</Typography>}
            action={<IconButton className={classes.snackbarIcon} aria-label='close snackbar'><Close /></IconButton>}
            className={classes.errorSnackbar} 
          />
        </Snackbar>
      </div>
    </Modal>
  )
}

const useStyles = makeStyles({
  errorSnackbar: {
    background: 'red !important',
    color: '#f0f0f0 !important'
  },
  successSnackbar: {
    background: 'green !important',
    color: '#f0f0f0 !important'
  },
  snackbarIcon: {
    verticalAlign: 'text-bottom',
    marginBottom: '0 !important',
    color: '#f0f0f0'
  }
})

const getData = (props, setIngredients) => {
  getUserById(props.uid).then(user => {
    if (user && user.ingredients.length !== 0) {
      setIngredients(user.ingredients)
    }
  }).catch(error => console.log(error))
}

const saveData = (props, ingredients, setSuccessOpen, setErrorOpen) => {
  ingredients.forEach(ingredient => {
    if (ingredient.qty === '') {
      ingredient.qty = 0
    }
  })
  setUserIngredients({ ingredients: ingredients }, props.uid).then(res => {
    if (res) {
      setSuccessOpen(true)
    } else {
      setErrorOpen(true)
    }
  }).catch(error => console.log(error))
}

const handleIngredientQtyChange = (event, ingredients, setIngredients) => {
  const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
  const newIngredients = [...ingredients]
  newIngredients[index].qty = event.target.value
  setIngredients(newIngredients)
}

const handleIngredientUnitsChange = (event, ingredients, setIngredients) => {
  const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
  const newIngredients = [...ingredients]
  newIngredients[index].units = event.target.value
  setIngredients(newIngredients)
}

const handleIngredientNameChange = (event, ingredients, setIngredients) => {
  const index = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('index')
  const newIngredients = [...ingredients]
  newIngredients[index].name = event.target.value
  setIngredients(newIngredients)
}

const handleAddIngredient = (event, ingredients, setIngredients) => {
  event.preventDefault()
  setIngredients([...ingredients, { name: '', units: 'cup', qty: ''}])
}

const afterClose = (setIngredients) => {
  setIngredients([{ name: '', units: 'cup', qty: '' }])
}

const removeIngredient = (index, ingredients, setIngredients) => {
  const newIngredients = [...ingredients]
  newIngredients.splice(index, 1)
  setIngredients(newIngredients)
}

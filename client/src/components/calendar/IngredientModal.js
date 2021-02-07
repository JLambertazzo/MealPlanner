import React, { useState } from 'react'
import Modal from 'react-modal'
import { getUserById, setUserIngredients } from '../../actions/actions'
import { Button, Typography, TextField, FormControl, NativeSelect, InputLabel } from '@material-ui/core'
import { Save, Add, ChevronLeft } from '@material-ui/icons'
import { uid } from 'react-uid'
import './IngredientModal.css'

export default function IngredientModal (props) {
  const [ingredients, setIngredients] = useState([{ name: '', units: 'cup', qty: '' }])
  return (
    <Modal
      id='ingredientModal'
      isOpen={props.isOpen}
      onAfterOpen={getData}
      onRequestClose={props.exit}
      onAfterClose={() => afterClose(setIngredients)}
      contentLabel="Ingredients Modal"
    >
      <div className='modalHeader'>
        <Typography variant='h4'>My Ingredients:</Typography>
        <Button onClick={props.exit} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
      </div>
      <div className='list-holder'>
        <ul>
          {
            ingredients.map((ingredient, index) => {
              return (
                <div key={uid(ingredient)}>
                  <li className='ingredientContainer' index={index}>
                    <TextField label='Quantity' className='qInput' type='number' value={ingredient.qty} onChange={(event) => handleIngredientQtyChange(event, ingredients, setIngredients)} />
                    <FormControl>
                      <InputLabel htmlFor="units">Units</InputLabel>
                      <NativeSelect
                        className='uInput'
                        value={ingredients[index].units}
                        onChange={(event) => handleIngredientUnitsChange(event, ingredients, setIngredients)}
                        name='units'
                      >
                        <optgroup label='Mass'>
                          <option value='kg'>kilogram</option>
                          <option value='g'>gram</option>
                          <option value='oz'>ounce</option>
                          <option value='lb'>pound</option>
                        </optgroup>
                        <optgroup label='Volume'>
                          <option value='ml'>mL</option>
                          <option value='l'>L</option>
                          <option value='tsp'>teaspoon</option>
                          <option value='Tbs'>tablespoon</option>
                          <option value='cup'>cup</option>
                          <option value='pnt'>pint</option>
                        </optgroup>
                      </NativeSelect>
                    </FormControl>
                    <TextField label='Ingredient' className='nInput' type='text' value={ingredient.name} onChange={(event) => handleIngredientNameChange(event, ingredients, setIngredients)} />
                  </li>
                  <hr />
                </div>
              )
            })
          }
        </ul>
        <Button variant='contained' startIcon={<Add />} onClick={(event) => handleAddIngredient(event, ingredients, setIngredients)}>Add Ingredient</Button>
        <Button id='saveButton' variant='contained' startIcon={<Save />} onClick={saveData}>Save Data</Button>
      </div>
    </Modal>
  )
}

const getData = (props, setIngredients) => {
  getUserById(props.uid).then(user => {
    if (user.ingredients.length !== 0) {
      setIngredients(user.ingredients)
    }
  }).catch(error => console.log(error))
}

const saveData = (props, ingredients) => {
  ingredients.forEach(ingredient => {
    if (ingredient.qty === '') {
      ingredient.qty = 0
    }
  })
  setUserIngredients({ ingredients: ingredients }, props.uid).then(res => {
    console.log('saved successfully') // TODO display in frontend
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
  const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
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
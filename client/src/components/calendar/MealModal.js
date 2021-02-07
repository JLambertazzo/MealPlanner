import React, { useState } from 'react'
import Modal from 'react-modal'
import { Select, FormControl, InputLabel, Button, TextField, MenuItem, Typography, NativeSelect, List, ListItem } from '@material-ui/core'
import { Close, ChevronLeft, Publish } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { addMeal } from '../../actions/actions'
import { uid } from 'react-uid'
import './MealModal.css'

export default function MealModal (props) {
  const [mealName, setMealName] = useState('')
  const [mealNum, setMealNum] = useState('')
  const [ingredients, setIngredients] = useState([{
    name: '',
    units: 'cup',
    qty: ''
  }])
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['one', 'two'])

  Modal.setAppElement('#root')
  return (
    <Modal
      id='mealModal'
      isOpen={props.isOpen}
      onRequestClose={props.exit}
      onAfterClose={() => handleClose(setMealName, setMealNum, setIngredients, setDescription)}
      contentLabel='Meal Modal'
    >
      <div className='modalHeader'>
        <Typography variant='h4'>Add a meal for {props.date.toDateString()}</Typography>
        <Button variant='contained' startIcon={<ChevronLeft />} onClick={() => handleReturn(props)}>Return</Button>
      </div>
      <form id='mealModalForm' onSubmit={(event) => handleSubmit(event, props, mealName, mealNum, ingredients, description)}>
        <FormControl className="input-field">
          <TextField label='Meal Name' onChange={(event) => setMealName(event.target.value)} required />
        </FormControl>
        <FormControl className="input-field">
          <InputLabel id='selectLabel' required>Meal:</InputLabel>
          <Select labelId='selectLabel' name='mealNum' id="mealSelect" onChange={(event) => setMealNum(event.target.value)} required >
            <MenuItem value="0">Breakfast</MenuItem>
            <MenuItem value="1">Lunch</MenuItem>
            <MenuItem value="2">Dinner</MenuItem>
            <MenuItem value="3">Snack</MenuItem>
          </Select>
        </FormControl>
        <FormControl className='input-field list-holder'>
          <Typography variant='h5'>Ingredients:</Typography>
          <List component='nav' aria-label='ingredient list'>
            {
              ingredients.map((ingredient, index) => {
                return(
                  <div key={uid(ingredient)}>
                    <ListItem className='ingredientContainer' index={index}>
                      <TextField type='number' label='Quantity' className='qInput' inputProps={{ type: 'number' }} onChange={(event) => handleIngredientQtyChange(event, ingredients, setIngredients)} />
                      <FormControl>
                        <InputLabel htmlFor="units">Units</InputLabel>
                        <NativeSelect
                          className='uInput'
                          value={ingredient.units}
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
                      <Autocomplete
                        style={{ minWidth: '175px', margin: '5px' }}
                        options={options}
                        groupBy={() => 'Suggestions:'}
                        disableClearable
                        freeSolo
                        renderInput={(params) => <TextField {...params} label='Ingredient' /> }
                      />
                    </ListItem>
                    <hr />
                  </div>
                )
              })
            }
          </List>
          <Button variant='contained' onClick={(event) => handleAddIngredient(event, ingredients, setIngredients)}>Add Ingredient</Button>
        </FormControl>
        <FormControl className='input-field'>
          <TextField label='Description' onChange={(event) => setDescription(event.target.value)} />
        </FormControl>
        <div className='modalFooterButtons'>
          <Button startIcon={<Publish />} type='submit' variant='contained'>Submit</Button>
          <Button startIcon={<Close />} variant='contained' onClick={props.exit}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

const handleReturn = (props) => {
  props.showListModal()
  props.exit()
}

const handleClose = (setMealName, setMealNum, setIngredients, setDescription) => {
  setMealName('')
  setMealNum('')
  setIngredients([{ name: '', units: 'cup', qty: '' }])
  setDescription('')
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
  const newIngredients = [...ingredients, { name: '', units: 'cup', qty: '' }]
  setIngredients(newIngredients)
}

const handleSubmit = (event, props, mealName, mealNum, ingredients, description) => {
  event.preventDefault()
  const validMealNum = mealNum || 0
  // convert mealNum to number and call api
  const payload = {
    name: mealName,
    ingredients: ingredients.filter(ingredient => ingredient.name && ingredient.qty),
    date: props.date.toString(),
    mealNum: parseInt(validMealNum),
    description: description
  }
  addMeal(payload, props.uid).then(() => handleReturn(props)).catch(error => console.log(error))
}

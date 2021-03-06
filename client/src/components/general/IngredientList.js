import React, { useState, useEffect } from 'react'
import { List, ListItem, FormControl, InputLabel, NativeSelect, TextField, IconButton } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { getUserById } from '../../actions/actions'
import { uid } from 'react-uid'

export default function IngredientList (props) {
  const [options, setOptions] = useState(['Loading...'])
  useEffect(() => {
    getUserById(props.uid).then(user => {
      if (!user || user.ingredientHistory.length === 0) {
        setOptions(['None Found'])
      } else {
        setOptions(user.ingredientHistory)
      }
    })
  }, [props.uid])
  return (
    <List component='nav' aria-label='ingredient list'>
      {
        props.ingredients.map((ingredient, index) => {
          return(
            <div key={uid(ingredient)}>
              <ListItem className='ingredientContainer' index={index}>
                <TextField
                  type='number'
                  label='Quantity'
                  className='qInput'
                  id={`qinput-${index}`}
                  InputLabelProps={{ for: `qinput-${index}` }}
                  inputProps={{ type: 'number' }}
                  onInput={props.handleQtyChange}
                  value={ingredient.qty}
                />
                <FormControl>
                  <InputLabel htmlFor={`uinput-${index}`}>Units</InputLabel>
                  <NativeSelect
                    className='uInput'
                    id={`uinput-${index}`}
                    value={ingredient.units}
                    onChange={props.handleUnitsChange}
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
                  defaultValue={ingredient.name}
                  renderInput={(params) => <TextField {...params} label='Ingredient' onSelect={props.handleNameChange} /> }
                />
                <IconButton aria-label='remove entry' onClick={() => props.removeIngredient(index)}>
                  <Clear />
                </IconButton>
              </ListItem>
              <hr />
            </div>
          )
        })
      }
    </List>
  )
}

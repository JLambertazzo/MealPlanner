import React, { useState, useEffect } from 'react'
import { List, ListItem, FormControl, InputLabel, NativeSelect, TextField } from '@material-ui/core'
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
                  inputProps={{ type: 'number' }}
                  onChange={props.handleQtyChange}
                  value={ingredient.qty}
                />
                <FormControl>
                  <InputLabel htmlFor="units">Units</InputLabel>
                  <NativeSelect
                    className='uInput'
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
              </ListItem>
              <hr />
            </div>
          )
        })
      }
    </List>
  )
}

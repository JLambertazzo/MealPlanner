import React, { useState } from 'react'
import { List, ListItem, Dialog, DialogTitle, DialogContent, Button, DialogActions, ListItemText, Typography, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { uid } from 'react-uid'
import './ReuseModal.css'

export default function ReuseModal (props) {
  const [mealNum, setMealNum] = useState('')
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      scroll='paper'
      aria-label="reuse previous meals"
    >
      <DialogTitle id="reuse-dialog-title">Select Meal</DialogTitle>
      <DialogContent dividers id='reuse-dialog-content'>
        <List>
          {
            props.meals.map(meal => {
              return (
                <ListItem
                  key={uid(meal)}
                  button
                  onClick={() => props.handleSelect({...meal, mealNum: mealNum})}
                  className='reuse-list-item'
                >
                  <ListItemText
                    className='reuse-list-text'
                    primary={meal.name}
                    secondary={getMealSecondary(meal)} />
                </ListItem>
              )
            })
          }
        </List>
      </DialogContent>
      <DialogActions>
        <FormControl variant="filled">
          <InputLabel id='reuse-select-label' htmlFor='reuse-meal-select'>Meal</InputLabel>
          <Select
            variant='outlined'
            id='reuse-meal-select'
            aria-labelledby='reuse-select-label'
            value={mealNum}
            onChange={(event) => setMealNum(event.target.value)}
          >
            <MenuItem value={0}>Breakfast</MenuItem>
            <MenuItem value={1}>Lunch</MenuItem>
            <MenuItem value={2}>Dinner</MenuItem>
            <MenuItem value={3}>Snack</MenuItem>
          </Select>
        </FormControl>
        <Button
          id='reuse-meal-submit'
          onClick={props.handleClose}
          variant='contained' color='primary'
        >
          <Typography variant='body2'>Close</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const getMealSecondary = (meal) => {
  return(
    <span>{meal.description}<br/>ingredients: {meal.ingredients.reduce((acc, curr, index) => {
      if (index > 2) {
        return acc
      }
      return acc = `${acc}${curr.name}, `
  }, '')}</span>
  )
} 

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
      aria-labelledby="reuse-dialog-title"
      aria-describedby="reuse-dialog-description"
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
                  <ListItemText primary={meal.name} />
                </ListItem>
              )
            })
          }
        </List>
      </DialogContent>
      <DialogActions>
        <FormControl variant="filled">
          <InputLabel id="reuse-meal-label">Meal</InputLabel>
          <Select
            variant='outlined'
            labelId="reuse-meal-label"
            id='reuse-meal-select'
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

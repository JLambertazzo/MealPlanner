import React from 'react'
import { List, ListItem, Dialog, DialogTitle, DialogContent, Button, DialogActions, ListItemText, Typography } from '@material-ui/core'
import './ReuseModal.css'

export default function ReuseModal (props) {
  return (
    <Dialog
        open={props.open}
        onClose={props.handleClose}
        scroll="paper"
        aria-labelledby="reuse-dialog-title"
        aria-describedby="reuse-dialog-description"
      >
        <DialogTitle id="reuse-dialog-title">Select Meal</DialogTitle>
        <DialogContent dividers id='reuse-dialog-content'>
          <List>
            {
              props.meals.map(meal => {
                return (
                  <ListItem button onClick={() => props.setValue(meal.name)} className='reuse-list-item'>
                    <ListItemText primary={meal.name}/>
                  </ListItem>
                )
              })
            }
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} variant='contained' color='primary'><Typography variant='body2'>Close</Typography></Button>
        </DialogActions>
      </Dialog>
  )
}

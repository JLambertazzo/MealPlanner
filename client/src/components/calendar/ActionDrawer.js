import React from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import { ChevronRight, Edit } from '@material-ui/icons'
import ListIcon from '@material-ui/icons/List'
import './ActionDrawer.css'

export default function ActionDrawer ({ showDrawer, setShowDrawer,setShowShoppingModal, setShowIngredientModal }) {
  return (
    <Drawer
      id='calendar-action-drawer'
      variant='permanent'
      className={showDrawer ? 'full' : 'small'}
    >
      <List>
        <ListItem button onClick={() => setShowDrawer(!showDrawer)} className='action-list-item'>
          <ListItemIcon className='action-icon-container'>
            <ChevronRight className={showDrawer ? 'drawer-control left' : 'drawer-control'} color='primary' />
          </ListItemIcon>
          <ListItemText className={showDrawer ? '' : 'hide'} primary={<Typography variant='body1'>Close</Typography>}/>
        </ListItem>
        <ListItem button onClick={() => setShowShoppingModal(true)} className='action-list-item'>
          <ListItemIcon className='action-icon-container'>
            <Edit color='primary' />
          </ListItemIcon>
          <ListItemText className={showDrawer ? '' : 'hide'} primary={<Typography variant='body1'>Shopping List</Typography>}/>
        </ListItem>
        <ListItem button onClick={() => setShowIngredientModal(true)} className='action-list-item'>
          <ListItemIcon className='action-icon-container'>
            <ListIcon  color='primary' />
          </ListItemIcon>
          <ListItemText className={showDrawer ? '' : 'hide'} primary={<Typography variant='body1'>My Pantry</Typography>}/>
        </ListItem>
      </List>
    </Drawer>
  )
}

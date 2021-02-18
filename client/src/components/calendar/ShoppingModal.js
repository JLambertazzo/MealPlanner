import React, { useState } from 'react'
import Modal from 'react-modal'
import { uid } from 'react-uid'
import { getUserById } from '../../actions/actions'
import { Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, FormControl, TextField } from '@material-ui/core'
import { ChevronLeft, FileCopy, Print, Email } from '@material-ui/icons'
import convert from 'convert-units'
import './ShoppingModal.css'

export default function ShoppingModal (props) {
  const [need, setNeed] = useState({})
  const [time, setTime] = useState(7)
  Modal.setAppElement('#root')
  return (
    <Modal
      id='shoppingModal'
      isOpen={props.isOpen}
      onRequestClose={props.exit}
      onAfterOpen={() => getData(props, time, setNeed)}
      contentLabel='Shopping List Modal'
    >
      <div className='modalHeader'>
        <Typography variant='h4'>My Shopping List:</Typography>
        <Button onClick={props.exit} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
      </div>
      <div className='tablediv'>
        <TableContainer component='paper'>
          <Table aria-label='Ingredient Table'>
            <TableHead className='primaryBack'>
              <TableRow>
                <TableCell><Typography variant='h6' color='secondary'>Ingredient</Typography></TableCell>
                <TableCell><Typography variant='h6' color='secondary'>Quantity</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Object.keys(need).map(name => {
                  return (
                    <TableRow key={name} className='row'>
                      <TableCell><Typography color='textPrimary'>{name}</Typography></TableCell>
                      {
                        Object.keys(need[name]).map(units => {
                          return (
                            <TableCell component='th' scope='row' key={uid(units)}><Typography>{need[name][units]} {units}</Typography></TableCell>
                          )
                        })
                      }
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Typography variant='h5' align='center'>Export List:</Typography>
      <div id='exportContainer'>
        <Button variant='contained' onClick={() => handleCopy(need)} startIcon={<FileCopy />}>Copy to Clipboard</Button>
        <Button variant='contained' onClick={() => window.print()} startIcon={<Print />}>Print</Button>
        <Button variant='contained' onClick={() => handleEmail(need)} startIcon={<Email />}>Share by Email</Button>
      </div>
      <Typography variant='h5' align='center'>Date Range to Shop For:</Typography>
      <div id='dateRangeContainer'>
        <FormControl>
          <TextField
            type='number'
            defaultValue={7}
            label='Date Range'
            className='qInput'
            inputProps={{ type: 'number', min: 1 }}
            onChange={(event) => handleTimeChange(event, props, time, setNeed, setTime)}
          />
        </FormControl>
      </div>
    </Modal>
  )
}

const getData = (props, time, setNeed) => {
  getUserById(props.uid).then(user => {
    if (!user || user.meals.length === 0) {
      setNeed({ None: { kg: 0 } })
      return
    }
    const need = {}
    const now = new Date()
    let maxTime = new Date()
    if (time && time >= 0) {
      maxTime.setDate(maxTime.getDate() + (time + 1))
    } else {
      maxTime = new Date(8640000000000000)
    }
    user.meals.forEach(meal => {
      const mealDate = new Date(meal.date)
      if (mealDate < maxTime && (now < mealDate.getTime() || now.toDateString() === mealDate.toDateString())) {
        meal.ingredients.forEach(ingredient => {
          const [qty, units] = convertUnits(ingredient.qty, ingredient.units)
          if (!need[ingredient.name]) {
            need[ingredient.name] = {}
          }
          if (!need[ingredient.name][units]) {
            need[ingredient.name][units] = qty
          } else {
            need[ingredient.name][units] += qty
          }
        })
      }
    })
    user.ingredients.forEach(ingredient => {
      const [qty, units] = convertUnits(ingredient.qty, ingredient.units)
      if (need[ingredient.name] && need[ingredient.name][units]) {
        need[ingredient.name][units] -= qty
      }
    })
    setNeed(need)
  }).catch(error => {
    setNeed({ Error: {kg: ''} })
    console.log(error)
  })
}

const convertUnits = (qty, units) => {
  if (['ml', 'l', 'tsp', 'Tbs', 'cup', 'pnt'].includes(units)) {
    return [Math.round(convert(qty).from(units).to('ml')), 'ml']
  } else if (['kg', 'g', 'oz', 'lb'].includes(units)) {
    return [Math.round(convert(qty).from(units).to('kg')), 'kg']
  } else {
    console.log('Error converting')
    return [qty, units]
  }
}

const getText = (need) => {
  const text = Object.keys(need).reduce((acc, name) => {
    let kgtext = null
    let mltext = null
    if (need[name].kg) {
      const qty = need[name].kg
      kgtext = (qty > 0 ? `${name}: ${qty} kg${qty > 1 ? 's' : ''}\n` : null)
    }
    if (need[name].ml) {
      const qty = need[name].ml
      mltext = (qty > 0 ? `${name}: ${qty} mL${qty > 1 ? 's' : ''}\n` : null)
    }
    const totalText = (kgtext || '') + (mltext || '')
    return acc + totalText
  }, '')
  return text
}

const handleCopy = (need) => {
  window.navigator.clipboard.writeText(getText(need))
}

const handleEmail = (need) => {
  window.open(`mailto:?subject=Groceries&body=${getText(need)}`, '_blank')
}

const handleTimeChange = (event, props, time, setNeed, setTime) => {
  setTime(event.target.value)
  this.getData(props, time, setNeed)
}

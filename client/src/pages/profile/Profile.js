import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../../components/general/NavBar'
import { Typography, Table, TableBody, TableHead, TableRow, TableCell, TableContainer } from '@material-ui/core'
import './Profile.css'
import { getUserById } from '../../actions/actions'
import { uid } from 'react-uid'

export default function Profile (props) {
  const [username, setUsername] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [meals, setMeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    getData(props.uid, setUsername, setIngredients, setMeals, setIsLoading)
  }, [props.uid])

  return (
    <div id='profileWrapper'>
      <NavBar uid={props.uid} />
      <div id='loading' className={isLoading ? '' : 'hide'}>
        <Typography variant='h1'>Loading...</Typography>
      </div>
      <div id='profileContent'>
        <div id='profileLeft' className='profileInfo'>
          <img src='favicon.ico' alt='temporary icon' />
          <Typography variant='h4'>{username}</Typography>
          <Typography variant='body2'>{meals.length} meals created</Typography>
          <Typography variant='body2'>{ingredients.length} ingredients used</Typography>
        </div>
        <div id='profileRight' class='profileInfo'>
          <div id='myMeals' className='tablediv'>
            <TableContainer component='paper'>
              <Table aria-label='Meal Table'>
                <TableHead className='primaryBack'>
                  <TableRow>
                    <TableCell><Typography variant='h6' color='secondary'>My Meals</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    meals.map(meal => {
                      return (
                        <TableRow className='row' key={uid(meal)}>
                          <TableCell><Typography color='textPrimary'>{meal}</Typography></TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div id='myIngredients' className='tablediv'>
            <TableContainer component='paper'>
              <Table aria-label='Ingredient Table'>
                <TableHead className='primaryBack'>
                  <TableRow>
                    <TableCell><Typography variant='h6' color='secondary'>My Ingredients</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    ingredients.map(name => {
                      return (
                        <TableRow key={name} className='row'>
                          <TableCell><Typography color='textPrimary'>{name}</Typography></TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

const getData = (uid, setUsername, setIngredients, setMeals, setIsLoading) => {
  setIsLoading(true)
  getUserById(uid).then(user => {
    if (!user) {
      setUsername('user not found')
      setIngredients(['None'])
      setMeals(['None'])
      setIsLoading(false)
      return
    }
    setUsername(user.username)
    if (user.meals.length === 0) {
      setMeals(['None'])
    } else {
      const meals = []
      user.meals.forEach(meal => {
        if (!meals.includes(meal.name)) {
          meals.push(meal.name)
        }
      })
      setMeals(meals)
    }
    if (user.ingredients.length === 0) {
      setIngredients(['None'])
    } else {
      const ingredients = []
      user.ingredients.forEach(ingredient => {
        if (!ingredients.includes(ingredient.name)) {
          ingredients.push(ingredient.name)
        }
      })
      setIngredients(ingredients)
    }
  })
  setIsLoading(false)
}

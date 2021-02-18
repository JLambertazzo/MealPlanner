import React, { useState, useEffect, useRef } from 'react'
import NavBar from '../../components/general/NavBar'
import { Typography, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, IconButton } from '@material-ui/core'
import { DeleteOutlineRounded } from '@material-ui/icons'
import './Profile.css'
import { getUserById, deleteMealHistory, deleteIngredientHistory } from '../../actions/actions'
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

  const handleDeleteMeal = (mid) => {
    deleteMealHistory(props.uid, mid).then(getData(props.uid, setUsername, setIngredients, setMeals, setIsLoading))
  }

  const handleDeleteIngredient = (ingredient) => {
    deleteIngredientHistory(props.uid, ingredient).then(getData(props.uid, setUsername, setIngredients, setMeals, setIsLoading))
  }

  return (
    <div id='profileWrapper'>
      <NavBar uid={props.uid} />
      <div id='profileContent'>
        <div id='profileLeft' className='profileInfo'>
          <img src='favicon.ico' alt='temporary icon' />
          <Typography variant='h4'>{username}</Typography>
          <Typography variant='body2'>{isLoading ? '[loading...]' : meals.length } meals created</Typography>
          <Typography variant='body2'>{isLoading ? '[loading...]' : ingredients.length} ingredients used</Typography>
        </div>
        <div id='profileRight' class='profileInfo'>
          <div id='myMeals' className='tablediv'>
            <TableContainer component='paper'>
              <Table aria-label='Meal Table'>
                <TableHead className='primaryBack'>
                  <TableRow>
                    <TableCell><Typography variant='h6' color='secondary'>My Meals</Typography></TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    isLoading ? 'Loading...' : meals.map(meal => {
                      return (
                        <TableRow className='row' key={uid(meal)}>
                          <TableCell><Typography color='textPrimary'>{meal.name}</Typography></TableCell>
                          <TableCell><IconButton className='delete-button' onClick={() => handleDeleteMeal(meal._id)}><DeleteOutlineRounded /></IconButton></TableCell>
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
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    isLoading ? 'Loading...' : ingredients.map(name => {
                      return (
                        <TableRow key={name} className='row'>
                          <TableCell><Typography color='textPrimary'>{name}</Typography></TableCell>
                          <TableCell><IconButton className='delete-button' onClick={() => handleDeleteIngredient(name)}><DeleteOutlineRounded /></IconButton></TableCell>
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
    if (user.mealHistory.length === 0) {
      setMeals([{ name: 'None' }])
    } else {
      const mealHistory = []
      user.mealHistory.forEach(meal => {
        mealHistory.push({ name: meal.name, _id: meal._id })
      })
      setMeals(mealHistory)
    }
    if (user.ingredientHistory.length === 0) {
      setIngredients(['None'])
    } else {
      const ingredientHistory = []
      user.ingredientHistory.forEach(ingredient => {
        ingredientHistory.push(ingredient)
      })
      setIngredients(ingredientHistory)
    }
  })
  setIsLoading(false)
}

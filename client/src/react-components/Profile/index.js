import React, { Component } from 'react'
import NavBar from '../NavBar'
import { Typography, Table, TableBody, TableHead, TableRow, TableCell, TableContainer } from '@material-ui/core'
import './style.css'
import { getUserById } from '../../actions/actions'
import { uid } from 'react-uid'
import Footer from '../Footer'

export class Profile extends Component {
  state = {
    username: '',
    ingredients: [],
    meals: [],
    isLoading: true
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.uid !== this.props.uid) {
      this.getData()
    }
  }
  
  getData = () => {
    this.setState({ isLoading: true })
    getUserById(this.props.uid).then(user => {
      if (!user) {
        this.setState({
          username: 'error 404',
          ingredients: ['None'],
          meals: ['None'],
          isLoading: false
        })
        return
      }
      this.setState({
        username: user.username
      })
      if (user.meals.length === 0) {
        this.setState({ meals: ['None'] })
      } else {
        const meals = []
        user.meals.forEach(meal => {
          meals.push(meal.name)
        })
        this.setState({ meals: meals  })
      }
      if (user.ingredients.length === 0) {
        this.setState({
          ingredients: ['None']
        })
      } else {
        const ingredients = []
        user.ingredients.forEach(ingredient => {
          ingredients.push(ingredient.name)
        })
        this.setState({ ingredients: ingredients })
      }
    })
    this.setState({ isLoading: false })
  }

  render () {
    return (
      <div>
        <NavBar uid={this.props.uid} />
        <div id='loading' className={this.state.isLoading ? '' : 'hide'}>
          <Typography variant='h1'>Loading...</Typography>
        </div>
        <div id='profileContent'>
          <div id='profileLeft' className='profileInfo'>
            <img src='favicon.ico' alt='temporary icon' />
            <Typography variant='h4'>{this.state.username}</Typography>
            <Typography variant='body2'>{this.state.meals.length} meals created</Typography>
            <Typography variant='body2'>{this.state.ingredients.length} ingredients used</Typography>
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
                      this.state.meals.map(meal => {
                        return(
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
                      this.state.ingredients.map(name => {
                        return(
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
}

export default Profile

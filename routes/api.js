'use strict'
const log = console.log
const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

const { mongoose } = require('../db/mongoose')
const { ObjectID } = require('mongodb')
const { User } = require('../db/user')

const bodyParse = require('body-parser')
const { mongo } = require('mongoose')
router.use(bodyParse.json())

function isMongoError (error) {
  return typeof error === 'object' && error !== null && error.name === 'MongoNetworkError'
}

const mongoChecker = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    log('Issue with mongoose connection')
    res.status(500).send('Internal server error')
    return false
  } else {
    next()
  }
}

const idChecker = async (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    log('invalid user id:', req.params.id)
    res.status(404).send()
    return
  }
  next()
}

const mealIdChecker = async (req, res, next) => {
  if (!ObjectID.isValid(req.params.mealId)) {
    log('invalid id')
    res.status(404).send()
    return
  }
  next()
}

const ingredientIdChecker = async (req, res, next) => {
  if (!ObjectID.isValid(req.params.ingredientId)) {
    log('invalid id')
    res.status(404).send()
    return
  }
  next()
}

// check if a user is currently logged in
router.get('/api/checkloggedin', (req, res) => {
  if (req.session.user) {
    res.send({ uid: req.session.user })
  } else {
    res.status(401).send()
  }
})

// get user by id
router.get('/api/users/:id', mongoChecker, idChecker, (req, res) => {
  User.findById(req.params.id).then(result => {
    if (result) {
      res.send(result)
    } else {
      res.status(404).send()
    }
  }).catch(error => {
    log(error)
    if (isMongoError(error)) {
      res.status(500).send('internal server error')
    } else {
      res.status(400).send('bad request')
    }
  })
})

// create user
// expects:
// {
//   username: 'username',
//   password: 'password'
// }
router.post('/api/users', mongoChecker, async (req, res) => {
  if (process.env.BLOCK_SIGNUP) {
    res.status(401).send('Signup Not Allowed Curerntly :(')
  } else {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      meals: [],
      mealHistory: [],
      ingredients: [],
      ingredientHistory: []
    })

    try {
      const otherUsers = await User.findOne({ username: req.body.username })
      if (otherUsers) {
        res.status(400).send('username already taken')
      } else {
        const result = await user.save()
        res.send(result)
      }
    } catch (error) {
      log(error)
      if (isMongoError(error)) {
        res.status(500).send('internal server error')
      } else {
        res.status(400).send('bad request')
      }
    }
  }
})

// login user
// expects:
// {
//   username: 'username',
//   password: 'password'
// }
router.post('/api/login', mongoChecker, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user._id
      res.send(user)
    } else if (user) {
      res.status(401).send('forbidden')
    } else {
      res.status(404).send('resource not found')
    }
  } catch (error) {
    log(error)
    if (isMongoError(error)) {
      res.status(500).send('internal server error')
    } else {
      res.status(400).send('bad request')
    }
  }
})

// Add meal
// expects:
// {
//   name: 'meal name',
//   ingredients: [{ name: 'name', units: 'units', qty: qty }],
//   date: 'date string',
//   mealNum: num,
//   description: 'description of meal' // optional
// }
router.post('/api/users/:id/meals', mongoChecker, idChecker, (req, res) => {
  const ingredients = []
  req.body.ingredients.forEach(element => {
    ingredients.push({
      name: element.name,
      units: element.units,
      qty: element.qty
    })
  })
  const meal = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    date: req.body.date,
    mealNum: req.body.mealNum,
    description: req.body.description || ''
  }
  User.findById(req.params.id).then(result => {
    if (result) {
      if (!result.meals.find(resMeal => resMeal.name === meal.name && sameIngredients(meal.ingredients, resMeal.ingredients))) {
        result.mealHistory.push(meal)
      }
      ingredients.forEach(ingredient => {
        if (!result.ingredientHistory.includes(ingredient.name)) {
          result.ingredientHistory.push(ingredient.name)
        }
      })
      result.meals.push(meal)
      result.save()
      res.send(result)
    } else {
      res.status(404).send('resource not found')
    }
  }).catch(error => {
    log(error)
    if (isMongoError(error)) {
      res.status(500).send('internal server error')
    } else {
      res.status(400).send('bad request')
    }
  })
})

//helper function for adding to history
const sameIngredients = (ingredients, resIngredients) => {
  ingredients.forEach((ingredient, index) => {
    if (!resIngredients[index] ||
      ingredient.name !== resIngredients[index].name ||
      ingredient.qty !== resIngredients[index].qty ||
      ingredient.units !== resIngredients[index].units) {
        return false
    }
  })
  return true
}

// Set ingredients
// expects:
// {
//   ingredients: [{
//     name: 'ingredient name',
//     units: 'units',
//     qty: number
//   }]
// }
router.patch('/api/users/:id/ingredients', mongoChecker, idChecker, (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: { ingredients: req.body.ingredients }}).then(result => {
    if (result) {
      req.body.ingredients.forEach(ingredient => {
        if (!result.ingredientHistory.includes(ingredient.name)) {
          result.ingredientHistory.push(ingredient.name)
        }
      })
      result.save()
      res.send(result)
    } else {
      res.status(404).send('resource not found')
    }
  }).catch(error => {
    log(error)
    if (isMongoError(error)) {
      res.status(500).send('internal server error')
    } else {
      res.status(400).send('bad request')
    }
  })
})

// Delete meal by mealId
router.delete('/api/users/:id/meals/:mealId', mongoChecker, idChecker, mealIdChecker, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).send('resource not found')
      return
    }
    const meal = user.meals.id(req.params.mealId)
    if (!meal) {
      res.status(404).send('resource not found')
      return
    }
    user.meals = user.meals.filter(element => element._id.toString() !== req.params.mealId)
    await user.save()
    res.send(user)
  } catch (error) {
    log(error)
    if (isMongoError(error)) {
      res.status(500).send('internal server error')
    } else {
      res.status(400).send('bad request')
    }
  }
})

// Delete ingredient by in ingredientsId
router.delete('/api/users/:id/ingredients/:ingredientId', mongoChecker, idChecker, ingredientIdChecker, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).send('resource not found')
      return
    }
    const ingredient = user.ingredients.id(req.params.ingredientId)
    if (!ingredient) {
      res.status(404).send('resource not found')
      return
    }
    user.ingredients = user.ingredients.filter(element => element._id.toString() !== req.params.ingredientId)
    await user.save()
    res.send(user)
  } catch (error) {
    log(error)
    if (isMongoError(error)) {
      res.status(500).send('internal server error')
    } else {
      res.status(400).send('bad request')
    }
  }
})

module.exports = router

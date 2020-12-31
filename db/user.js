'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const ingredientsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  }
})

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  mealNum: {
    type: Number,
    required: true
  },
  ingredients: {
    type: [ingredientsSchema],
    required: true
  },
  description: String
})

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  meals: [MealSchema],
  ingredients: [ingredientsSchema]
})

UserSchema.pre('save', function (next) {
  const user = this

  // checks to ensure we don't hash password more than once
  if (user.isModified('password')) {
    // generate salt and hash the password
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        console.log(err)
        return false
      }
      user.password = hash
      next()
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }

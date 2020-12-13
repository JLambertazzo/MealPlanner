'use strict'
const log = console.log

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose')
mongoose.set('useFindAndModify', false)

// set up body parse middleware and static folder
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/client/build')))

// TODO MOVE TO ROUTES FOLDER, NOT BE USED HERE
const isMongoError = (error) => {
  return typeof error === 'object' && error !== null && error.name === 'MongoNetworkError'
}

const mongoChecker = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    log('Issue with mongoose connection')
    res.status(500).send('internal server error')
    return
  }
  next()
}

app.get('*', (req, res) => {
  const validPaths = ['/']
  if (!validPaths.includes(req.url)) {
    res.status(404).send('404 not found :(')
  }
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

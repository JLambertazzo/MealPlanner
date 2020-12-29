'use strict'
const log = console.log

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const { mongoose } = require('./db/mongoose')
mongoose.set('useFindAndModify', false)

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// set up body parse middleware and static folder
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/client/build')))

app.use(session({
  secret: 'a hardcoded secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 36000000,
    httpOnly: true
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  unset: 'destroy'
}))

//api routes
app.use(require('./routes/api'))

app.get('*', (req, res) => {
  const validPaths = ['/', '/calendar', '/login', '/signup']
  if (!validPaths.includes(req.url)) {
    res.status(404).send('404 not found :(')
  }
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  log(`listening on port ${port}`)
})

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

const validUrls = ['/', '/calendar', '/login', '/signup', '/profile']
const authUrls = ['/calendar', '/profile']
const unAuthUrls = ['/login', '/signup']

const authenticate = (req, res, next) => {
  if (!req.session.user && authUrls.includes(req.url)) {
    res.status(301).redirect('/signup')
  } else {
    next()
  }
}

const unauthenticate = (req, res, next) => {
  if (req.session.user && unAuthUrls.includes(req.url)) {
    res.status(301).redirect('/calendar')
  } else {
    next()
  }
}

// set up body parse middleware and static folder
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/client/public')))

app.use(session({
  secret: 'a hardcoded secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 36000000,
    sameSite: 'strict',
    httpOnly: true
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  unset: 'destroy'
}))

// api routes
app.use(require('./routes/api'))

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      console.error('error: ' + err)
    })
  }
  res.status(301).redirect('/')
})

app.get('*', authenticate, unauthenticate, (req, res) => {
  if (!validUrls.includes(req.url)) {
    res.status(404).send('404 not found :(')
  }
  res.sendFile(path.join(__dirname, './index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  log(`listening on port ${port}`)
})

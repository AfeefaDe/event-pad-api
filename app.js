var express = require('express')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var events = require('./routes/events')
var participants = require('./routes/participants')
var tasks = require('./routes/tasks')
var router = express.Router()
var models = require('./models')

var app = express()

if (app.get('env') !== 'test') {
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(router)

// init event
router.use('/events/:eventUri', function (req, res, next) {
  models.Event.findOne({
    where: {
      uri: req.params.eventUri
    }
  }).then(event => {
    if (event) {
      res.locals.event = event
      next()
    } else {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    }
  }).catch(next)
})

app.use('/', index)
app.use('/events', events)
app.use('/events/:eventUri/participants', participants)
app.use('/events/:eventUri/tasks', tasks)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  const status = err.status || 500
  err.status = undefined
  res.status(status)
  res.send({
    message: err.message,
    status: status,
    error: (app.get('env') === 'development') ? err : undefined,
    stack: (app.get('env') === 'development') ? err.stack.split('\n') : undefined
  })
})

module.exports = app

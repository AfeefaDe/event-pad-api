var express = require('express')
var router = express.Router()
var eventsController = require('../controllers/events_controller')
var models = require('../models')
var participants = require('./participants')
var checklists = require('./checklists')

router.post('/', eventsController.create)

router.param('eventUri', function (req, res, next, eventUri) {
  models.Event.findOne({
    where: {
      uri: eventUri
    }
  }).then(event => {
    if (event) {
      req.event = event
      next()
    } else {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    }
  }).catch(next)
})

const eventRouter = express.Router()
router.use('/:eventUri', eventRouter)

eventRouter.get('/', eventsController.show)

eventRouter.use('/participants', participants)
eventRouter.use('/checklists', checklists)

module.exports = router

var models = require('../models')
var express = require('express')
var router = express.Router({ mergeParams: true })

router.post('/', function (req, res, next) {
  models.Participant.create({
    name: req.body.name,
    email: req.body.email,
    rsvp: req.body.rsvp,
    eventId: req.params.eventId
  }).then(participant => {
    res.status(201).send(participant)
  }).catch(err => {
    next(err)
  })
})

router.get('/', function (req, res, next) {
  Promise.all([
    models.Event.findById(req.params.eventId),
    models.Participant.findAll({
      where: {
        eventId: req.params.eventId
      }
    })
  ]).then(values => {
    const event = values[0]
    const participants = values[1]
    if (event && participants) {
      res.send(participants)
    } else {
      next()
    }
  }).catch(err => {
    next(err)
  })
})

router.get('/:id', function (req, res, next) {
  models.Participant.findOne({
    where: {
      id: req.params.id,
      eventId: req.params.eventId
    }
  }).then(participant => {
    if (participant) {
      res.send(participant)
    } else {
      next()
    }
  }).catch(err => {
    next(err)
  })
})

module.exports = router

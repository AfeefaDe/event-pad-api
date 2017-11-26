var models = require('../models')
var express = require('express')
var router = express.Router({ mergeParams: true })
var routesHelper = require('./routes_helper')

router.post('/', function (req, res, next) {
  models.Participant.create({
    name: req.body.name,
    email: req.body.email,
    rsvp: req.body.rsvp,
    eventId: req.params.eventId
  }).then(participant => {
    res.status(201).send(participant)
  }).catch(err => {
    routesHelper.handleError(err, res, next)
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
  findParticipant(req.params.id, req.params.eventId)
    .then(participant => {
      if (participant) {
        res.send(participant)
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
})

router.patch('/:id', function (req, res, next) {
  findParticipant(req.params.id, req.params.eventId)
    .then(participant => {
      if (participant) {
        models.Participant.update({
          name: req.body.name,
          rsvp: req.body.rsvp
        }).then(participant => {
          res.send(participant)
        }).catch(err => {
          routesHelper.handleError(err, res, next)
        })
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
})

router.delete('/:id', function (req, res, next) {
  findParticipant(req.params.id, req.params.eventId)
    .then(participant => {
      participant.destroy().then(destroyed => {
        res.status(204).json('')
      }).catch(err => {
        next(err)
      })
    })
})

function findParticipant (id, eventId) {
  return models.Participant.findOne({
    where: {
      id: id,
      eventId: eventId
    }
  })
}

module.exports = router

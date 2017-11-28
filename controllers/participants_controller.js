'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

module.exports = {
  create (req, res, next) {
    const event = res.locals.event
    models.Participant.create({
      name: req.body.name,
      email: req.body.email,
      rsvp: req.body.rsvp,
      eventId: event.id
    }).then(participant => {
      res.status(201).send(participant)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    const event = res.locals.event
    event.getParticipants().then(participants => {
      res.send(participants)
    }).catch(err => {
      next(err)
    })
  },

  show (req, res, next) {
    const event = res.locals.event
    findParticipant(req.params.id, event.id)
      .then(participant => {
        if (participant) {
          res.send(participant)
        } else {
          next()
        }
      }).catch(err => {
        next(err)
      })
  },

  update (req, res, next) {
    const event = res.locals.event
    findParticipant(req.params.id, event.id)
      .then(participant => {
        if (participant) {
          participant.update({
            name: req.body.name,
            rsvp: req.body.rsvp
          }).then(participant => {
            res.send(participant)
          }).catch(err => {
            controllersHelper.handleError(err, res, next)
          })
        } else {
          next()
        }
      }).catch(err => {
        next(err)
      })
  },

  delete (req, res, next) {
    const event = res.locals.event
    findParticipant(req.params.id, event.id)
      .then(participant => {
        participant.destroy().then(destroyed => {
          res.status(204).json('')
        }).catch(err => {
          next(err)
        })
      })
  }
}

function findParticipant (id, eventId) {
  return models.Participant.findOne({
    where: {
      id: id,
      eventId: eventId
    }
  })
}

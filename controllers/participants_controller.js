'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

module.exports = {
  create (req, res, next) {
    models.Participant.create({
      name: req.body.name,
      email: req.body.email,
      rsvp: req.body.rsvp,
      eventId: req.params.eventId
    }).then(participant => {
      res.status(201).send(participant)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    Promise.all([
      models.Event.findById(req.params.eventId),
      models.Participant.findAll({
        where: {
          eventId: req.params.eventId
        },
        attributes: models.Participant.defaultAttributes
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
  },

  show (req, res, next) {
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
  },

  update (req, res, next) {
    findParticipant(req.params.id, req.params.eventId)
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
    findParticipant(req.params.id, req.params.eventId)
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

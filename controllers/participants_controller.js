'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

module.exports = {
  create (req, res, next) {
    const event = req.event
    models.Participant.createFromJson(event.id, req.body).then(id => {
      return models.Participant.findById(id).then(participant => {
        res.status(201).send(participant)
      })
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    const event = req.event
    event.getParticipants().then(participants => {
      res.send(participants)
    }).catch(err => {
      next(err)
    })
  },

  show (req, res, next) {
    res.send(req.participant)
  },

  update (req, res, next) {
    req.participant.update({
      name: req.body.name,
      rsvp: req.body.rsvp
    }).then(participant => {
      res.send(participant)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  delete (req, res, next) {
    req.participant.destroy().then(destroyed => {
      res.status(204).json('')
    }).catch(err => {
      next(err)
    })
  }
}

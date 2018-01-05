'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

module.exports = {
  create (req, res, next) {
    models.Event.createFromJson(req.body).then(id => {
      return models.Event.findById(id).then(event => {
        res.status(201).send(event)
      })
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  show (req, res, next) {
    models.Event.findById(req.event.id, {
      include: models.Event.getDefaultIncludes()
    }).then(event => {
      res.send(event)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  }
}

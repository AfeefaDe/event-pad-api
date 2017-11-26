'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')
var crypto = require('crypto')
var slug = require('slug')

module.exports = {
  create (req, res, next) {
    const token = crypto.randomBytes(32).toString('base64').replace(/\W/g, '').slice(0, 24)
    const titleSlug = slug(req.body.title)
    const uri = `${token}-${titleSlug}`

    models.Event.create({
      title: req.body.title,
      dateStart: req.body.dateStart,
      location: req.body.location,
      description: req.body.description,
      uri
    }).then(event => {
      res.status(201).send(event)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  show (req, res, next) {
    models.Event.findById(req.params.id).then(event => {
      if (event) {
        res.send(event)
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
  },

  showByUri (req, res, next) {
    const uri = req.query.uri

    if (!uri) {
      next()
    }

    models.Event.findOne({where: {uri}}).then(event => {
      if (event) {
        res.send(event)
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
  }
}

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
    const uri = req.params.uri

    models.Event.findOne({
      where: {uri},
      include: [
        {
          association: 'participants'
        },
        {
          association: 'tasks',
          include: {
            association: 'assignees',
            through: { // hide pivot table: https://github.com/sequelize/sequelize/issues/3664
              attributes: []
            }
          }
        }
      ]
    }).then(event => {
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

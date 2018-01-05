'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

const Op = models.sequelize.Op

module.exports = {
  create (req, res, next) {
    const eventId = req.event.id
    let promise
    // bulk create
    if (Array.isArray(req.body)) {
      promise = models.Checklist.bulkCreateFromJson(eventId, req.body).then(ids => {
        return models.Checklist.findAll({
          where: {
            id: {
              [Op.in]: ids
            }
          }
        })
      })
    // single create
    } else {
      promise = models.Checklist.createFromJson(eventId, req.body).then(id => {
        return models.Checklist.findById(id)
      })
    }
    promise.then(result => {
      res.status(201).send(result)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    const eventId = req.event.id
    models.Checklist.findAll({
      where: {
        eventId
      },
      include: models.Checklist.getDefaultIncludes()
    }).then(checklists => {
      if (checklists) {
        res.send(checklists)
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
  },

  show (req, res, next) {
    res.send(req.checklist)
  },

  update (req, res, next) {
    req.checklist.update({
      title: req.body.title
    }).then(checklist => {
      res.send(checklist)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  delete (req, res, next) {
    return req.checklist.destroy().then(destroyed => {
      res.status(204).json('')
    }).catch(err => {
      next(err)
    })
  }
}

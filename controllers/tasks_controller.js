'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

const Op = models.sequelize.Op

module.exports = {
  create (req, res, next) {
    const checklistId = req.checklist.id
    let promise
    // bulk create
    if (Array.isArray(req.body)) {
      promise = models.Task.bulkCreateFromJson(checklistId, req.body).then(ids => {
        return models.Task.findAll({
          where: {
            id: {
              [Op.in]: ids
            }
          }
        })
      })
    // single create
    } else {
      promise = models.Task.createFromJson(checklistId, req.body).then(id => {
        return models.Task.findById(id)
      })
    }
    promise.then(result => {
      res.status(201).send(result)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    const checklistId = req.checklist.id
    models.Task.findAll({
      where: {
        checklistId
      },
      include: {
        association: 'assignees',
        through: {
          attributes: []
        }
      }
    }).then(tasks => {
      if (tasks) {
        res.send(tasks)
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
  },

  show (req, res, next) {
    res.send(req.task)
  },

  update (req, res, next) {
    req.task.update({
      name: req.body.name,
      checked: req.body.checked
    }).then(task => {
      res.send(task)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  delete (req, res, next) {
    return req.task.destroy().then(destroyed => {
      res.status(204).json('')
    }).catch(err => {
      next(err)
    })
  },

  addAssigneeToTask (req, res, next) {
    let participantPromise
    if (req.body.id) {
      participantPromise = findParticipant(req.body.id, req.event.id)
    } else {
      participantPromise = models.Participant.create({
        name: req.body.name,
        rsvp: req.body.rsvp,
        eventId: req.event.id
      })
    }

    participantPromise.then(assignee => {
      req.task.addAssignee(assignee).then(() => {
        res.status(201).send(assignee)
      }).catch(err => {
        next(err)
      })
    }).catch(err => {
      next(err)
    })
  },

  removeAssigneeFromTask (req, res, next) {
    findParticipant(req.params.assigneeId, req.event.id).then(assignee => {
      if (assignee) {
        req.task.removeAssignee(assignee).then(() => {
          res.status(204).json('')
        }).catch(err => {
          next(err)
        })
      } else {
        next()
      }
    }).catch(err => {
      next(err)
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

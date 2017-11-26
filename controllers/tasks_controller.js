'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

module.exports = {
  create (req, res, next) {
    let tasks = null
    if (Array.isArray(req.body)) {
      tasks = req.body
    } else {
      tasks = [req.body]
    }

    const eventId = req.params.eventId

    const data = tasks.map(task => {
      return {
        name: task.name,
        eventId
      }
    })
    models.Task.bulkCreate(data).then(() => {
      models.Task.findAll({where: {eventId}}).then(tasks => {
        res.status(201).send(tasks)
      })
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    Promise.all([
      models.Event.findById(req.params.eventId),
      models.Task.findAll({
        where: {
          eventId: req.params.eventId
        }
      })
    ]).then(values => {
      const event = values[0]
      const tasks = values[1]
      if (event && tasks) {
        res.send(tasks)
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
  },

  show (req, res, next) {
    findTask(req.params.id, req.params.eventId)
      .then(task => {
        if (task) {
          res.send(task)
        } else {
          next()
        }
      }).catch(err => {
        next(err)
      })
  },

  update (req, res, next) {
    findTask(req.params.id, req.params.eventId)
      .then(task => {
        if (task) {
          task.update({
            name: req.body.name,
            rsvp: req.body.rsvp
          }).then(task => {
            res.send(task)
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
    findTask(req.params.id, req.params.eventId)
      .then(task => {
        task.destroy().then(destroyed => {
          res.status(204).json('')
        }).catch(err => {
          next(err)
        })
      })
  },

  addParticipantToTask (req, res, next) {
    Promise.all([
      findTask(req.params.id, req.params.eventId),
      findParticipant(req.params.id, req.params.eventId)
    ]).then(values => {
      const task = values[0]
      const worker = values[1]
      task.setWorkers([worker]).then(associatedWorkers => {
        res.status(204).json('')
      }).catch(err => {
        next(err)
      })
    }).catch(err => {
      next(err)
    })
  },

  removeParticipantFromTask (req, res, next) {
    findTaskParticipant(req.params.id, req.params.participantId)
      .then(taskParticpant => {
        taskParticpant.destroy().then(destroyed => {
          res.status(204).json('')
        }).catch(err => {
          next(err)
        })
      })
  }
}

function findTask (id, eventId) {
  return models.Task.findOne({
    where: {
      id: id,
      eventId: eventId
    }
  })
}

function findParticipant (id, eventId) {
  return models.Participant.findOne({
    where: {
      id: id,
      eventId: eventId
    }
  })
}

function findTaskParticipant (taskId, participantId) {
  return models.TaskParticipant.findOne({
    where: {
      taskId: taskId,
      participantId: participantId
    }
  })
}

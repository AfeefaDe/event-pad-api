'use strict'

var models = require('../models')
var controllersHelper = require('./controllers_helper')

function createTask (eventId, task) {
  return models.Task.create({
    name: task.name,
    eventId
  })
}

function bulkCreateTasks (eventId, tasks) {
  const data = tasks.map(task => {
    return {
      name: task.name,
      eventId
    }
  })

  return models.Task.bulkCreate(data).then(() => {
    return models.Task.findAll({where: {eventId}})
  })
}

module.exports = {
  create (req, res, next) {
    const eventId = res.locals.event.id
    let promise
    if (Array.isArray(req.body)) {
      promise = bulkCreateTasks(eventId, req.body)
    } else {
      promise = createTask(eventId, req.body)
    }
    return promise.then(result => {
      res.status(201).send(result)
    }).catch(err => {
      controllersHelper.handleError(err, res, next)
    })
  },

  index (req, res, next) {
    const eventId = res.locals.event.id
    models.Task.findAll({
      where: {
        eventId: eventId
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
    const eventId = res.locals.event.id
    findTask(req.params.id, eventId)
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
    const eventId = res.locals.event.id
    findTask(req.params.id, eventId)
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
    const eventId = res.locals.event.id
    findTask(req.params.id, eventId)
      .then(task => {
        task.destroy().then(destroyed => {
          res.status(204).json('')
        }).catch(err => {
          next(err)
        })
      })
  },

  addAssigneeToTask (req, res, next) {
    const eventId = res.locals.event.id
    const taskId = req.params.id

    let participantPromise
    if (req.body.id) {
      participantPromise = findParticipant(req.body.id, eventId)
    } else {
      participantPromise = models.Participant.create({
        name: req.body.name,
        rsvp: req.body.rsvp,
        eventId: eventId
      })
    }

    Promise.all([
      findTask(taskId, eventId),
      participantPromise
    ]).then(values => {
      const task = values[0]
      const assignee = values[1]
      task.addAssignee(assignee).then(() => {
        res.status(201).send(assignee)
      }).catch(err => {
        next(err)
      })
    }).catch(err => {
      next(err)
    })
  },

  removeAssigneeFromTask (req, res, next) {
    const eventId = res.locals.event.id
    const taskId = req.params.id

    Promise.all([
      findTask(taskId, eventId),
      findParticipant(req.params.participantId, eventId)
    ]).then(values => {
      const task = values[0]
      const assignee = values[1]
      if (assignee) {
        task.removeAssignee(assignee).then(() => {
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

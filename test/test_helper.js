'use strict'

var models = require('../models')
var crypto = require('crypto')
var slug = require('slug')
var sequelize = models.sequelize

module.exports = {
  createEvent (attributes = {}) {
    if (!attributes.title) {
      attributes.title = 'Neues Event'
    }

    if (!attributes.uri) {
      const token = crypto.randomBytes(32).toString('base64').replace(/\W/g, '').slice(0, 24)
      const titleSlug = slug(attributes.title)
      attributes.uri = `${token}-${titleSlug}`
    }

    return models.Event.create({
      title: attributes.title,
      uri: attributes.uri || crypto.randomBytes(32).toString('base64').replace(/\W/g, '').slice(0, 24) + '-Neues-Event'
    })
  },

  createTaskAssignee (taskId, participantId) {
    return models.TaskAssignee.create({
      taskId: taskId,
      participantId: participantId
    })
  },

  createParticipant (eventId) {
    if (eventId) {
      return this.createParticipantWithEventId(eventId)
    } else {
      return this.createEvent().then(newEvent => {
        return this.createParticipantWithEventId(newEvent.id)
      })
    }
  },

  createParticipantWithEventId (eventId) {
    return models.Participant.create({
      name: 'Neuer Teilnehmer',
      email: 'test@example.com',
      rsvp: '1',
      eventId: eventId
    }).then(participant => {
      return models.Participant.findById(participant.id, {
        include: 'event'
      })
    })
  },

  createTask (checklistId) {
    if (checklistId) {
      return this.createTaskWithChecklistId(checklistId)
    } else {
      return this.createChecklist().then(newChecklist => {
        return this.createTaskWithChecklistId(newChecklist.id)
      })
    }
  },

  createTaskWithChecklistId (checklistId) {
    return models.Task.create({
      checklistId,
      name: 'Neuer Task'
    }).then(task => {
      return models.Task.findById(task.id, {
        include: {
          association: 'checklist',
          include: 'event'
        }
      })
    })
  },

  createChecklist (eventId) {
    if (eventId) {
      return this.createChecklistWithEventId(eventId)
    } else {
      return this.createEvent().then(newEvent => {
        return this.createChecklistWithEventId(newEvent.id)
      })
    }
  },

  createChecklistWithTasks (eventId) {
    let promise
    if (eventId) {
      promise = this.createChecklistWithEventId(eventId)
    } else {
      promise = this.createEvent().then(newEvent => {
        return this.createChecklistWithEventId(newEvent.id)
      })
    }
    return promise.then(newChecklist => {
      return this.createTaskWithChecklistId(newChecklist.id).then(() => {
        return this.createTaskWithChecklistId(newChecklist.id).then(() => {
          return newChecklist
        })
      })
    })
  },

  createChecklistWithEventId (eventId) {
    return models.Checklist.createFromJson(eventId, {
      title: 'Neue Checklist'
    }).then(id => {
      return models.Checklist.findById(id, {
        include: 'event'
      })
    })
  },

  assertPromiseError (promise, done, errorCallback) {
    promise.then(result => {
      done(new Error('Promise should not succeed with result: ' + result))
    }).catch(error => {
      errorCallback(error)
      done()
    })
  },

  truncateTables (models) {
    return sequelize.transaction(t => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {transaction: t})
        .then(() => {
          const promises = []
          models.forEach(model => {
            promises.push(model.destroy({
              truncate: true, transaction: t
            }))
          })
          return Promise.all(promises)
        })
        .then(() => {
          return sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {transaction: t})
        })
    })
  },

  after (after) {
    after(done => {
      this.truncateTables([
        models.TaskAssignee,
        models.Participant,
        models.Task,
        models.Checklist,
        models.Event
      ]).then(() => {
        models.sequelize.close()
        done()
      })
    })
  }
}

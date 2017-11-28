'use strict'

var db = require('../models')
var crypto = require('crypto')
var slug = require('slug')

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

    return db.Event.create({
      title: attributes.title,
      uri: attributes.uri || crypto.randomBytes(32).toString('base64').replace(/\W/g, '').slice(0, 24) + '-Neues-Event'
    })
  },

  createTaskParticipant (taskId, participantId) {
    return db.TaskParticipant.create({
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
    return db.Participant.create({
      name: 'Neuer Teilnehmer',
      email: 'test@example.com',
      rsvp: '1',
      eventId: eventId
    }).then(participant => {
      return db.Participant.findById(participant.id, {
        include: 'event'
      })
    })
  },

  createTask (eventId) {
    if (eventId) {
      return this.createTaskWithEventId(eventId)
    } else {
      return this.createEvent().then(newEvent => {
        return this.createTaskWithEventId(newEvent.id)
      })
    }
  },

  createTaskWithEventId (eventId) {
    return db.Task.create({
      name: 'Neuer Task',
      eventId: eventId
    }).then(task => {
      return db.Task.findById(task.id, {
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

  after (after) {
    after(done => {
      Promise.all([
        db.TaskParticipant.destroy({
          where: {},
          truncate: true
        }),
        db.Participant.destroy({
          where: {},
          truncate: true
        }),
        db.Task.destroy({
          where: {},
          truncate: true
        }),
        db.Event.destroy({
          where: {},
          truncate: true
        })
      ]).then(() => {
        db.sequelize.close()
        done()
      })
    })
  }
}

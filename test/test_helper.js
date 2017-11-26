'use strict'

var db = require('../models')

module.exports = {
  createEvent (attributes = {}) {
    return db.Event.create({
      title: attributes.title || 'Neues Event',
      uri: attributes.uri || 'A1b2C3-Neues-Event'
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

  after (after, closeConnection, timeout) {
    console.log('outer')
    after(() => setTimeout(() => {
      console.log('inner')
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
        if (closeConnection) {
          db.sequelize.close()
        }
      })
    }, timeout))
  }
}

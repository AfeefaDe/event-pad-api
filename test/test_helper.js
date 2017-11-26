'use strict'

var db = require('../models')

module.exports = {
  createEvent () {
    return db.Event.create({
      title: 'Neues Event'
    })
  },

  createParticipant (eventId) {
    if(eventId) {
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

  after (after) {
    after(() => setTimeout(() => {
      Promise.all([
        db.Participant.destroy({
          where: {},
          truncate: true
        }),
        db.Event.destroy({
          where: {},
          truncate: true
        })
      ]).then(() => {
        db.sequelize.close()
      })
    }, 10))
  }
}

'use strict'

var db = require('../models')

module.exports = {
  createEvent () {
    return db.Event.create({
      title: 'Neues Event'
    })
  },

  createParticipant () {
    return this.createEvent().then(newEvent => {
      return db.Participant.create({
        name: 'Neuer Teilnehmer',
        email: 'test@example.com',
        rsvp: '1',
        eventId: newEvent.id
      })
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
        }),
      ]).then(() => {
        db.sequelize.close()
      })
    }, 10))
  }
}

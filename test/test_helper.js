'use strict'

var db = require('../models')

module.exports = {
  createEvent () {
    return db.Event.create({
      title: 'Neues Event'
    })
  },

  after (after) {
    after(() => setTimeout(() => {
      db.Event.destroy({
        where: {},
        truncate: true
      }).then(() => {
        db.sequelize.close()
      })
    }, 10))
  }
}

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Participants', 'eventId', {
      type: Sequelize.INTEGER,
      after: 'id'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Participants', 'eventId', {
      type: Sequelize.INTEGER,
      after: 'rsvp'
    })
  }
}

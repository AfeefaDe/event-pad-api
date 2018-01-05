'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tasks', 'checklistId', {
      type: Sequelize.INTEGER,
      after: 'id'
    }).then(() => {
      queryInterface.removeColumn('Tasks', 'eventId')
    })
  },

  down: (queryInterface, Sequelize) => {
  }
}

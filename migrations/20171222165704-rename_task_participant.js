'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('TaskParticipants', 'TaskAssignees')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('TaskAssignees', 'TaskParticipants')
  }
}

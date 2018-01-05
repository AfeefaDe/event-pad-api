'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tasks', 'checked', {
      type: Sequelize.BOOLEAN,
      after: 'name',
      defaultValue: false,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tasks', 'checked')
  }
}

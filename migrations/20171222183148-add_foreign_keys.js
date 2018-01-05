'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Tasks', ['checklistId'], {
      type: 'FOREIGN KEY',
      name: 'fkey_checklistId',
      references: {
        table: 'Checklists',
        field: 'id'
      },
      onDelete: 'cascade'
    }).then(() => {
      return queryInterface.addConstraint('TaskAssignees', ['taskId'], {
        type: 'FOREIGN KEY',
        name: 'fkey_taskId',
        references: {
          table: 'Tasks',
          field: 'id'
        },
        onDelete: 'cascade'
      }).then(() => {
        return queryInterface.addConstraint('TaskAssignees', ['participantId'], {
          type: 'FOREIGN KEY',
          name: 'fkey_participantId',
          references: {
            table: 'Participants',
            field: 'id'
          },
          onDelete: 'cascade'
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Tasks', 'fkey_checklistId').then(() => {
      return queryInterface.removeConstraint('TaskAssignees', 'fkey_taskId')
    }).then(() => {
      return queryInterface.removeConstraint('TaskAssignees', 'fkey_participantId')
    })
  }
}

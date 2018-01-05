'use strict'

module.exports = (sequelize, DataTypes) => {
  var TaskAssignee = sequelize.define('TaskAssignee', {
    taskId: DataTypes.INTEGER,
    participantId: DataTypes.INTEGER
  })

  return TaskAssignee
}

'use strict'

module.exports = (sequelize, DataTypes) => {
  var TaskParticipant = sequelize.define('TaskParticipant', {
    taskId: DataTypes.INTEGER,
    participantId: DataTypes.INTEGER
  })

  return TaskParticipant
}

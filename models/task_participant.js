'use strict'

module.exports = (sequelize, DataTypes) => {
  var TaskParticipant = sequelize.define('TaskParticipant', {
    taskId: DataTypes.INTEGER,
    participantId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })

  return TaskParticipant
}

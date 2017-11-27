'use strict'

module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 250]
      }
    },
    eventId: DataTypes.INTEGER
  })

  Task.associate = models => {
    Task.belongsToMany(models.Participant, {
      through: {
        model: models.TaskParticipant,
        unique: true
      },
      as: 'assignees',
      foreignKey: 'participantId'
    })
  }

  Task.defaultAttributes = ['id', 'name']

  return Task
}

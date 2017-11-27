'use strict'

module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 250]
      }
    },
    dateStart: DataTypes.DATE,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    uri: DataTypes.STRING
  })

  Event.defaultAttributes = ['id', 'title', 'location', 'description', 'dateStart', 'uri']

  Event.associate = models => {
    Event.hasMany(models.Participant, {
      as: 'participants'
    })

    Event.hasMany(models.Task, {
      as: 'tasks'
    })
  }

  return Event
}

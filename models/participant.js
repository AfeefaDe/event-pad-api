'use strict'

module.exports = (sequelize, DataTypes) => {
  var Participant = sequelize.define('Participant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 250]
      }
    },
    email: DataTypes.STRING,
    rsvp: {
      type: DataTypes.STRING,
      allowNull: true,
      default: '2',
      validate: {
        isIn: [['0', '1', '2']]
        // 0: i attend
        // 1: i miss
        // 2: i dont know
      }
    },
    eventId: DataTypes.INTEGER
  })

  Participant.defaultAttributes = ['id', 'name', 'rsvp']

  Participant.associate = models => {
    Participant.belongsToMany(models.Task, {
      through: {
        model: models.TaskAssignee,
        unique: true
      },
      as: 'tasks',
      foreignKey: 'participantId'
    })

    Participant.belongsTo(models.Event, {
      as: 'event'
    })
  }

  Participant.setup = models => {
    Participant.createFromJson = (eventId, json) => {
      return Participant.create({
        name: json.name,
        email: json.email,
        rsvp: json.rsvp,
        eventId
      }).then(participant => {
        return participant.id
      })
    }
  }

  return Participant
}

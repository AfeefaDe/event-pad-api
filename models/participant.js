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
    rsvp: DataTypes.STRING,
    eventId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        models.Participant.belongsTo(models.Event, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Participant
}

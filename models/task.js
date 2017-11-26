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
  }, {
    classMethods: {
      associate: function (models) {
        models.Task.belongsTo(models.Event, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Task
}

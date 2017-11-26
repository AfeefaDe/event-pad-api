'use strict'

module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 250]
      }
    },
    dateStart: DataTypes.DATE,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    uri: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })
  return Event
}

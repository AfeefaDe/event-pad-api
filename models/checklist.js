'use strict'

module.exports = (sequelize, DataTypes) => {
  var Checklist = sequelize.define('Checklist', {
    eventId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 250]
      }
    }
  })

  Checklist.associate = models => {
    Checklist.hasMany(models.Task, {
      as: 'tasks'
    })

    Checklist.belongsTo(models.Event, {
      as: 'event'
    })
  }

  Checklist.defaultAttributes = ['id', 'title']

  Checklist.setup = models => {
    Checklist.getDefaultIncludes = () => {
      return {
        association: 'tasks',
        include: models.Task.getDefaultIncludes()
      }
    }

    Checklist.createFromJson = (eventId, json) => {
      return Checklist.create({
        eventId,
        title: json.title
      }).then(checklist => {
        if (json.tasks && json.tasks.length) {
          return models.Task.bulkCreateFromJson(checklist.id, json.tasks).then(() => {
            return checklist.id
          })
        } else {
          return checklist.id
        }
      })
    }

    Checklist.bulkCreateFromJson = (eventId, listJson) => {
      let ids = []
      let chain = Promise.resolve()
      listJson.forEach((json, index) => {
        chain = chain.then(() => {
          return Checklist.createFromJson(eventId, json).then(id => {
            ids.push(id)
          })
        })
      })
      chain = chain.then(() => {
        return ids
      })
      return chain
    }
  }

  return Checklist
}

'use strict'

var crypto = require('crypto')
var slug = require('slug')

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

    Event.hasMany(models.Checklist, {
      as: 'checklists'
    })
  }

  Event.setup = models => {
    Event.getDefaultIncludes = () => {
      return [
        {
          association: 'participants'
        },
        {
          association: 'checklists',
          include: models.Checklist.getDefaultIncludes()
        }
      ]
    }

    Event.createFromJson = json => {
      const token = crypto.randomBytes(32).toString('base64').replace(/\W/g, '').slice(0, 24)
      const titleSlug = slug(json.title)
      const uri = `${token}-${titleSlug}`

      return Event.create({
        title: json.title,
        dateStart: json.dateStart,
        location: json.location,
        description: json.description,
        uri
      }).then(event => {
        if (json.checklists && json.checklists.length) {
          return models.Checklist.bulkCreateFromJson(event.id, json.checklists).then(() => {
            return event.id
          })
        } else {
          return event.id
        }
      })
    }
  }

  return Event
}

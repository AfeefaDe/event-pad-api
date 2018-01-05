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
    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isIn: [[true, false]]
      }
    }
  })

  Task.defaultAttributes = ['id', 'name', 'checked']

  Task.associate = models => {
    Task.belongsToMany(models.Participant, {
      through: {
        model: models.TaskAssignee,
        unique: true
      },
      as: 'assignees',
      foreignKey: 'taskId'
    })

    Task.belongsTo(models.Checklist, {
      as: 'checklist'
    })
  }

  Task.setup = models => {
    Task.getDefaultIncludes = () => {
      return {
        association: 'assignees',
        through: { // hide pivot table: https://github.com/sequelize/sequelize/issues/3664
          attributes: []
        }
      }
    }

    Task.createFromJson = (checklistId, json) => {
      return Task.create({
        checklistId,
        name: json.name,
        checked: json.checked
      }).then(task => task.id)
    }

    Task.bulkCreateFromJson = (checklistId, listJson) => {
      let ids = []
      let chain = Promise.resolve()
      listJson.forEach((json, index) => {
        chain = chain.then(() => {
          return Task.createFromJson(checklistId, json).then(id => {
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

  return Task
}

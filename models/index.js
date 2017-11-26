'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = path.basename(__filename)
var env = process.env.NODE_ENV || 'development'
var dbConfig = require(path.join(__dirname, '/../config/database.json'))[env]
var db = {}

var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

// define associations throughs
db.Task.belongsToMany(db.Participant, {
  through: {
    model: db.TaskParticipant,
    unique: false
  },
  as: 'workers',
  foreignKey: 'participantId',
  constraints: false
})

db.Participant.belongsToMany(db.Task, {
  through: {
    model: db.TaskParticipant,
    unique: false
  },
  as: 'tasks',
  foreignKey: 'taskId',
  constraints: false
})

module.exports = db

var models = require('../models')

module.exports = {
  createEvent () {
    return models.Event.create({
      title: 'Neues Event'
    })
  }
}

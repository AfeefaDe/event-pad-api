var models = require('../models')
var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
  models.Event.create(req.body).then(function () {
    res.send('201, created')
  })
})

router.get('/:id', function (req, res) {
  models.Event.find({ id: req.params.id }).then(event => {
    res.send(event)
  })
})

module.exports = router

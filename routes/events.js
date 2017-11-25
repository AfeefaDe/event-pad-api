var models = require('../models')
var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
  models.Event.create({
    title: req.body.title
  }).then(event => {
    res.status(201).send(event)
  }).catch(err => {
    console.log('error', err)
  })
})

router.get('/:id', function (req, res) {
  models.Event.findById(req.params.id).then(event => {
    res.send(event)
  })
})

module.exports = router

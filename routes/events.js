var models = require('../models')
var express = require('express')
var router = express.Router()

router.post('/', function (req, res) {
  models.Event.create({
    title: req.body.title
  }).then(event => {
    res.status(201).send(event)
  }).catch(err => {
    res.status(500).send(err)
  })
})

router.get('/:id', function (req, res, next) {
  models.Event.findById(req.params.id).then(event => {
    if (event) {
      res.send(event)
    } else {
      next()
    }
  }).catch(err => {
    res.status(500).send(err)
  })
})

module.exports = router

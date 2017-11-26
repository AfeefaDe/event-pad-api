var models = require('../models')
var express = require('express')
var router = express.Router()
var crypto = require('crypto')
var slug = require('slug')

router.post('/', function (req, res, next) {
  const token = crypto.randomBytes(32).toString('base64').replace(/\W/g, '').slice(0, 24)
  const titleSlug = slug(req.body.title)
  const uri = `${token}-${titleSlug}`

  models.Event.create({
    title: req.body.title,
    location: req.body.location,
    description: req.body.description,
    uri
  }).then(event => {
    res.status(201).send(event)
  }).catch(err => {
    next(err)
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
    next(err)
  })
})

module.exports = router

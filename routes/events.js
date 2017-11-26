var express = require('express')
var router = express.Router()
var eventsController = require('../controllers/events_controller')

router.get('/', eventsController.showByUri)
router.get('/:id', eventsController.show)
router.post('/', eventsController.create)

module.exports = router

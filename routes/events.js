var express = require('express')
var router = express.Router()
var eventsController = require('../controllers/events_controller')

router.get('/:uri', eventsController.show)
router.post('/', eventsController.create)

module.exports = router

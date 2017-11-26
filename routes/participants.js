var express = require('express')
var router = express.Router({ mergeParams: true })
var participantsController = require('../controllers/participants_controller')

router.post('/', participantsController.create)
router.get('/', participantsController.index)
router.get('/:id', participantsController.show)
router.patch('/:id', participantsController.update)
router.delete('/:id', participantsController.delete)

module.exports = router

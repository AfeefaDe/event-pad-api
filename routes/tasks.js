var express = require('express')
var router = express.Router({ mergeParams: true })
var tasksController = require('../controllers/tasks_controller')

router.post('/', tasksController.create)
router.get('/', tasksController.index)
router.get('/:id', tasksController.show)
router.patch('/:id', tasksController.update)
router.delete('/:id', tasksController.delete)

module.exports = router

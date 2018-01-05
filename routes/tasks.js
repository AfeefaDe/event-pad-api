var express = require('express')
var router = express.Router({ mergeParams: true })
var tasksController = require('../controllers/tasks_controller')
var models = require('./../models')

router.post('/', tasksController.create)
router.get('/', tasksController.index)

// init task
router.param('taskId', function (req, res, next, taskId) {
  models.Task.findOne({
    where: {
      id: taskId,
      checklistId: req.checklist.id
    }
  }).then(task => {
    if (task) {
      req.task = task
      next()
    } else {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    }
  }).catch(next)
})

const taskRouter = express.Router()
router.use('/:taskId', taskRouter)

taskRouter.get('/', tasksController.show)
taskRouter.patch('/', tasksController.update)
taskRouter.delete('/', tasksController.delete)

taskRouter.post('/assignees', tasksController.addAssigneeToTask)
taskRouter.delete('/assignees/:assigneeId', tasksController.removeAssigneeFromTask)

module.exports = router

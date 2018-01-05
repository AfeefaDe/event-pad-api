var express = require('express')
var router = express.Router({ mergeParams: true })
var checklistsController = require('../controllers/checklists_controller')
var models = require('./../models')
var tasks = require('./tasks')

router.post('/', checklistsController.create)
router.get('/', checklistsController.index)

// init checklist
router.param('checklistId', function (req, res, next, checklistId) {
  models.Checklist.findOne({
    where: {
      id: checklistId,
      eventId: req.event.id
    }
  }).then(checklist => {
    if (checklist) {
      req.checklist = checklist
      next()
    } else {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    }
  }).catch(next)
})

const checklistRouter = express.Router()
router.use('/:checklistId', checklistRouter)

checklistRouter.get('/', checklistsController.show)
checklistRouter.patch('/', checklistsController.update)
checklistRouter.delete('/', checklistsController.delete)

checklistRouter.use('/tasks', tasks)

module.exports = router

var express = require('express')
var router = express.Router({ mergeParams: true })
var participantsController = require('../controllers/participants_controller')
var models = require('../models')

// init participant
router.param('participantId', function (req, res, next, participantId) {
  models.Participant.findOne({
    where: {
      id: participantId,
      eventId: req.event.id
    }
  }).then(participant => {
    if (participant) {
      req.participant = participant
      next()
    } else {
      var err = new Error('Not Found')
      err.status = 404
      next(err)
    }
  }).catch(next)
})

router.post('/', participantsController.create)
router.get('/', participantsController.index)
router.get('/:participantId', participantsController.show)
router.patch('/:participantId', participantsController.update)
router.delete('/:participantId', participantsController.delete)

module.exports = router

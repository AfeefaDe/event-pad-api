'use strict'

var db = require('../../models')
var testHelper = require('../test_helper')

describe('participant model', function () {
  it('validation fails on undefined name', done => {
    const participant = new db.Participant()
    testHelper.assertPromiseError(participant.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors, ['Participant.name cannot be null'])
    })
  })

  it('validation fails on empty name', done => {
    const participant = new db.Participant({ name: '' })
    testHelper.assertPromiseError(participant.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on name failed')
    })
  })

  it('validation fails on too long name', done => {
    const name = new Array(252).join('a')
    const participant = new db.Participant({ name: name })
    testHelper.assertPromiseError(participant.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation len on name failed')
    })
  })

  it('validation fails on too short name', done => {
    const participant = new db.Participant({ name: 'a' })
    testHelper.assertPromiseError(participant.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation len on name failed')
    })
  })
})

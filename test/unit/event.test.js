'use strict'

var db = require('../../models')
var testHelper = require('../test_helper')

describe('event model', function () {
  it('validation fails on undefined title', done => {
    const event = new db.Event()
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors, ['Event.title cannot be null'])
    })
  })

  it('validation fails on empty title', done => {
    const event = new db.Event({ title: '' })
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on title failed')
    })
  })

  it('validation fails on too long title', done => {
    const title = new Array(252).join('a')
    const event = new db.Event({ title: title })
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation len on title failed')
    })
  })

  it('validation fails on whitespace title', done => {
    const event = new db.Event({ title: '  ' })
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on title failed')
    })
  })
})

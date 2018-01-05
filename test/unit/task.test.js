'use strict'

var models = require('../../models')
var testHelper = require('../test_helper')


describe('task model', () => {
  describe('create tasks', done => {
    let taskCount

    beforeEach(done => {
      models.Task.max('id').then(lastId => {
        taskCount = lastId
        done()
      })
    })

    it('creates new task', done => {
      const json = {
        name: 'new task'
      }

      models.Task.createFromJson(1, json).then(id => {
        models.Task.findById(id).then(task => {
          assert.equal(task.id, taskCount + 1)
          assert.equal(task.title, json.title)
          done()
        })
      })
    })

    it('bulk creates new tasks', done => {
      const json = [
        { name: 'new task' },
        { name: 'new task2' }
      ]
      models.Task.bulkCreateFromJson(1, json).then(ids => {
        assert.deepEqual(ids, [taskCount + 1, taskCount + 2])

        let countChecks = 0
        ids.forEach((id, index) => {
          models.Task.findById(id).then(task => {
            assert.equal(task.id, taskCount + index + 1)
            assert.equal(task.name, json[index].name)

            countChecks++
            if (countChecks === 2) {
              done()
            }
          })
        })
      })
    })
  })

  it('validation fails on undefined name', done => {
    const task = new models.Task()
    testHelper.assertPromiseError(task.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors, ['Task.name cannot be null'])
    })
  })

  it('validation fails on empty name', done => {
    const task = new models.Task({ name: '' })
    testHelper.assertPromiseError(task.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on name failed')
    })
  })

  it('validation fails on too long name', done => {
    const name = new Array(252).join('a')
    const task = new models.Task({ name })
    testHelper.assertPromiseError(task.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation len on name failed')
    })
  })

  it('validation fails on whitespace name', done => {
    const task = new models.Task({ name: '  ' })
    testHelper.assertPromiseError(task.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on name failed')
    })
  })
})

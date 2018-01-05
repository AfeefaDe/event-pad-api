'use strict'

var models = require('../../models')
var testHelper = require('../test_helper')

describe('event model', function () {
  describe('create events', done => {
    let eventCount
    let checklistCount

    beforeEach(done => {
      Promise.all([
        models.Event.count().then(count => {
          eventCount = count
        }),
        models.Checklist.count().then(count => {
          checklistCount = count
        })
      ]).then(() => done())
    })

    it('creates new event', done => {
      const json = {
        title: 'new event'
      }

      models.Event.createFromJson(json).then(id => {
        models.Event.findById(id).then(event => {
          assert.equal(event.id, eventCount + 1)
          assert.equal(event.title, json.title)
          done()
        }).catch(done)
      })
    })

    it('creates new event with checklists', done => {
      const json = {
        title: 'new checklist',
        checklists: [
          { title: 'Checklist 1', tasks: [{ name: 'Task 1' }, { name: 'Task 2' }] },
          { title: 'Checklist 2' }
        ]
      }

      models.Event.createFromJson(json).then(id => {
        models.Event.findById(id).then(event => {
          assert.equal(event.id, eventCount + 1)
          assert.equal(event.title, json.title)

          event.getChecklists().then(checklists => {
            expect(checklists.length).to.equal(2)
            expect(checklists[0].id).to.equal(checklistCount + 1)
            expect(checklists[0].title).to.equal(json.checklists[0].title)
            expect(checklists[1].id).to.equal(checklistCount + 2)
            expect(checklists[1].title).to.equal(json.checklists[1].title)

            checklists[0].getTasks().then(tasks => {
              expect(tasks.length).to.equal(2)
              expect(tasks[0].name).to.equal(json.checklists[0].tasks[0].name)
              expect(tasks[1].name).to.equal(json.checklists[0].tasks[1].name)

              done()
            })
          })
        })
      })
    })
  })

  it('validation fails on undefined title', done => {
    const event = new models.Event()
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors, ['Event.title cannot be null'])
    })
  })

  it('validation fails on empty title', done => {
    const event = new models.Event({ title: '' })
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on title failed')
    })
  })

  it('validation fails on too long title', done => {
    const title = new Array(252).join('a')
    const event = new models.Event({ title: title })
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation len on title failed')
    })
  })

  it('validation fails on whitespace title', done => {
    const event = new models.Event({ title: '  ' })
    testHelper.assertPromiseError(event.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on title failed')
    })
  })
})

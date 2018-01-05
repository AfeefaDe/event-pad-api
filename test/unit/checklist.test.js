'use strict'

var models = require('../../models')
var testHelper = require('../test_helper')

describe('checklist model', () => {
  describe('create checklists', done => {
    let checklistCount
    let taskCount

    beforeEach(done => {
      Promise.all([
        models.Checklist.max('id').then(lastId => {
          checklistCount = lastId || 0
        }),
        models.Task.max('id').then(lastId => {
          taskCount = lastId || 0
        })
      ]).then(() => done())
    })

    it('creates new checklist', done => {
      const json = {
        title: 'new checklist'
      }

      models.Checklist.createFromJson(1, json).then(id => {
        models.Checklist.findById(id).then(checklist => {
          assert.equal(checklist.id, checklistCount + 1)
          assert.equal(checklist.title, json.title)
          done()
        })
      })
    })

    it('creates new checklist with tasks', done => {
      const json = {
        title: 'new checklist',
        tasks: [
          { name: 'Task1' },
          { name: 'Task2' }
        ]
      }

      models.Checklist.createFromJson(1, json).then(id => {
        models.Checklist.findById(id).then(checklist => {
          assert.equal(checklist.id, checklistCount + 1)
          assert.equal(checklist.title, json.title)

          checklist.getTasks().then(tasks => {
            expect(tasks.length).to.equal(2)
            expect(tasks[0].id).to.equal(taskCount + 1)
            expect(tasks[0].name).to.equal(json.tasks[0].name)
            expect(tasks[1].id).to.equal(taskCount + 2)
            expect(tasks[1].name).to.equal(json.tasks[1].name)
            done()
          })
        })
      })
    })

    it('bulk creates new checklists', done => {
      const json = [
        { title: 'new checklist' },
        { title: 'new checklist2' }
      ]
      models.Checklist.bulkCreateFromJson(1, json).then(ids => {
        assert.deepEqual(ids, [checklistCount + 1, checklistCount + 2])

        let countChecks = 0
        ids.forEach((id, index) => {
          models.Checklist.findById(id).then(checklist => {
            assert.equal(checklist.id, checklistCount + index + 1)
            assert.equal(checklist.title, json[index].title)

            countChecks++
            if (countChecks === 2) {
              done()
            }
          })
        })
      })
    })

    it('bulk creates new checklist with tasks', done => {
      const json = [
        {
          title: 'new checklist',
          tasks: [
            { name: 'Task1' },
            { name: 'Task2' }
          ]
        },
        {
          title: 'new checklist2',
          tasks: [
            { name: 'Task21' },
            { name: 'Task22' }
          ]
        }
      ]

      models.Checklist.bulkCreateFromJson(1, json).then(ids => {
        assert.deepEqual(ids, [checklistCount + 1, checklistCount + 2])

        let countChecks = 0
        ids.forEach((id, index) => {
          models.Checklist.findById(id).then(checklist => {
            assert.equal(checklist.id, checklistCount + index + 1)
            assert.equal(checklist.title, json[index].title)

            checklist.getTasks().then(tasks => {
              expect(tasks.length).to.equal(2)
              expect(tasks[0].id).to.equal(taskCount + (2 * index) + 1)
              expect(tasks[0].name).to.equal(json[index].tasks[0].name)
              expect(tasks[1].id).to.equal(taskCount + (2 * index) + 2)
              expect(tasks[1].name).to.equal(json[index].tasks[1].name)

              countChecks++
              if (countChecks === 2) {
                done()
              }
            })
          })
        })
      })
    })
  })

  it('validation fails on undefined title', done => {
    const checklist = new models.Checklist()
    testHelper.assertPromiseError(checklist.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors, ['Checklist.title cannot be null'])
    })
  })

  it('validation fails on empty title', done => {
    const checklist = new models.Checklist({ title: '' })
    testHelper.assertPromiseError(checklist.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on title failed')
    })
  })

  it('validation fails on too long title', done => {
    const title = new Array(252).join('a')
    const checklist = new models.Checklist({ title: title })
    testHelper.assertPromiseError(checklist.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation len on title failed')
    })
  })

  it('validation fails on whitespace title', done => {
    const checklist = new models.Checklist({ title: '  ' })
    testHelper.assertPromiseError(checklist.validate(), done, error => {
      const errors = error.errors.map(error => error.message)
      assert.deepEqual(errors[0], 'Validation notEmpty on title failed')
    })
  })
})

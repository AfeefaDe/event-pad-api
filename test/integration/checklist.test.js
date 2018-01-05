'use strict'

var app = require('../../app')
var request = require('supertest')
var testHelper = require('../test_helper')
var models = require('../../models')

describe('checklist endpoint', function () {
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

  describe('create checklists', function () {
    it('creates checklist', function (done) {
      testHelper.createEvent().then(newEvent => {
        request(app)
          .post(`/events/${newEvent.uri}/checklists`)
          .send({ title: 'Neue Checkliste' })
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(201)
          .then(res => {
            const checklist = res.body
            expect(checklist.id).to.equal(checklistCount + 1)
            expect(checklist.title).to.equal('Neue Checkliste')

            newEvent.getChecklists().then(checklists => {
              expect(checklists.length).to.equal(1)
              expect(checklists[0].id).to.equal(checklistCount + 1)
              expect(checklists[0].title).to.equal('Neue Checkliste')
              done()
            })
          })
      })
    })

    it('creates checklist with tasks', function (done) {
      testHelper.createEvent().then(newEvent => {
        request(app)
          .post(`/events/${newEvent.uri}/checklists`)
          .send({
            title: 'Neue Checkliste',
            tasks: [{ name: 'Neuer Task' }, { name: 'Neuer Task2', checked: true }]
          })
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(201)
          .then(res => {
            const checklist = res.body
            expect(checklist.id).to.equal(checklistCount + 1)
            expect(checklist.title).to.equal('Neue Checkliste')

            newEvent.getChecklists().then(checklists => {
              expect(checklists.length).to.equal(1)
              expect(checklists[0].id).to.equal(checklistCount + 1)
              expect(checklists[0].title).to.equal('Neue Checkliste')

              return checklists[0].getTasks().then(tasks => {
                expect(tasks.length).to.equal(2)
                expect(tasks[0].id).to.equal(taskCount + 1)
                expect(tasks[0].name).to.equal('Neuer Task')
                expect(tasks[1].id).to.equal(taskCount + 2)
                expect(tasks[1].name).to.equal('Neuer Task2')
                expect(tasks[1].checked).to.equal(true)
                done()
              })
            })
          })
      })
    })

    it('creates multiple checklists', function (done) {
      testHelper.createEvent().then(newEvent => {
        request(app)
          .post(`/events/${newEvent.uri}/checklists`)
          .send([{ title: 'Neue Checklist' }, { title: 'Neue Checklist2' }])
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(201)
          .then(res => {
            const checklists = res.body
            expect(checklists[0].id).to.equal(checklistCount + 1)
            expect(checklists[0].title).to.equal('Neue Checklist')
            expect(checklists[1].id).to.equal(checklistCount + 2)
            expect(checklists[1].title).to.equal('Neue Checklist2')

            newEvent.getChecklists().then(checklists => {
              expect(checklists.length).to.equal(2)
              expect(checklists[0].id).to.equal(checklistCount + 1)
              expect(checklists[0].title).to.equal('Neue Checklist')
              expect(checklists[1].id).to.equal(checklistCount + 2)
              expect(checklists[1].title).to.equal('Neue Checklist2')
              done()
            })
          })
      })
    })

    it('creates multiple checklists with tasks', function (done) {
      testHelper.createEvent().then(newEvent => {
        request(app)
          .post(`/events/${newEvent.uri}/checklists`)
          .send([
            {
              title: 'Neue Checklist Again',
              tasks: [{ name: 'Neuer Task' }, { name: 'Neuer Task2' }]
            },
            {
              title: 'Neue Checklist2 Again',
              tasks: [{ name: 'Neuer Task' }, { name: 'Neuer Task2' }]
            }
          ])
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(201)
          .then(res => {
            const checklists = res.body
            expect(checklists[0].id).to.equal(checklistCount + 1)
            expect(checklists[0].title).to.equal('Neue Checklist Again')
            expect(checklists[1].id).to.equal(checklistCount + 2)
            expect(checklists[1].title).to.equal('Neue Checklist2 Again')


            newEvent.getChecklists().then(checklists => {
              expect(checklists.length).to.equal(2)
              expect(checklists[0].id).to.equal(checklistCount + 1)
              expect(checklists[0].title).to.equal('Neue Checklist Again')
              expect(checklists[1].id).to.equal(checklistCount + 2)
              expect(checklists[1].title).to.equal('Neue Checklist2 Again')

              for (let i = 0; i < 2; i++) {
                checklists[i].getTasks().then(tasks => {
                  expect(tasks.length).to.equal(2)
                  expect(tasks[0].id).to.equal(taskCount + (2 * i) + 1)
                  expect(tasks[0].name).to.equal('Neuer Task')
                  expect(tasks[1].id).to.equal(taskCount + (2 * i) + 2)
                  expect(tasks[1].name).to.equal('Neuer Task2')
                  if (i === 1) {
                    done()
                  }
                })
              }
            })
          })
      })
    })
  })

  it('handles validation errors on failing create of checklist', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .post(`/events/${newEvent.uri}/checklists`)
        .send({ title: '' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(422)
        .expect(res => {
          const errors = res.body
          assert.equal(errors.length, '2')
          assert.equal(errors[0].attribute, 'title')
          assert.equal(errors[0].message, 'Validation notEmpty on title failed')
          assert.equal(errors[1].attribute, 'title')
          assert.equal(errors[1].message, 'Validation len on title failed')
        })
        .end(done)
    })
  })

  it('updates checklist', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      request(app)
        .patch(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}`)
        .send({ title: 'new name' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .then(res => {
          const checklist = res.body
          assert.equal(checklist.id, newChecklist.id)
          assert.equal(checklist.title, 'new name')

          models.Checklist.findById(newChecklist.id).then(checklist => {
            assert.equal(checklist.id, newChecklist.id)
            assert.equal(checklist.title, 'new name')
            done()
          })
        })
    })
  })

  it('handles validation errors on failing update of checklist', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      request(app)
        .patch(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}`)
        .send({ title: '' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(422)
        .expect(res => {
          const errors = res.body
          assert.equal(errors.length, '2')
          assert.equal(errors[0].attribute, 'title')
          assert.equal(errors[0].message, 'Validation notEmpty on title failed')
          assert.equal(errors[1].attribute, 'title')
          assert.equal(errors[1].message, 'Validation len on title failed')
        })
        .end(done)
    })
  })

  it('returns 404 on missing checklist on update', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .patch(`/events/${newEvent.uri}/checklists/999`)
        .send({ title: '' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404, done)
    })
  })

  describe('delete checklists', function () {
    after(done => {
      // reset auto increment after deletes
      testHelper.truncateTables([
        models.Checklist, models.Task
      ]).then(() => done())
    })

    it('deletes checklist', function (done) {
      testHelper.createChecklist().then(newChecklist => {
        request(app)
          .delete(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}`)
          .expect(204)
          .then(res => {
            models.Checklist.count().then(count => {
              expect(count).to.equal(checklistCount)
              done()
            })
          })
      })
    })

    it('deletes checklist with tasks', function (done) {
      testHelper.createChecklistWithTasks().then(newChecklist => {
        request(app)
          .delete(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}`)
          // .expect(204)
          .then(res => {
            models.Checklist.count().then(count => {
              expect(count).to.equal(checklistCount)
            }).then(() => {
              models.Task.max('id').then(count => {
                expect(count || 0).to.equal(taskCount)
                done()
              })
            })
          })
      })
    })

    it('returns 404 on missing checklist on delete', function (done) {
      testHelper.createEvent().then(newEvent => {
        request(app)
          .delete(`/events/${newEvent.uri}/checklists/999`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(404, done)
      })
    })
  })

  it('retrieves checklists', function (done) {
    testHelper.createEvent().then(newEvent => {
      Promise.all([
        testHelper.createChecklist(newEvent.id),
        testHelper.createChecklist(newEvent.id)
      ]).then(newChecklists => {
        request(app)
          .get(`/events/${newChecklists[0].event.uri}/checklists`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200)
          .expect(res => {
            const checklists = res.body
            assert.equal(checklists.length, newChecklists.length)
            expect(checklists.length).to.equal(newChecklists.length)

            expect(checklists[0].id).to.equal(newChecklists[0].id)
            expect(checklists[0].title).to.equal(newChecklists[0].title)

            expect(checklists[1].id).to.equal(newChecklists[1].id)
            expect(checklists[1].title).to.equal(newChecklists[1].title)
          })
          .end(done)
      })
    })
  })

  it('retrieves checklists with tasks', function (done) {
    testHelper.createEvent().then(newEvent => {
      Promise.all([
        testHelper.createChecklist(newEvent.id),
        testHelper.createChecklist(newEvent.id)
      ]).then(newChecklists => {
        request(app)
          .get(`/events/${newChecklists[0].event.uri}/checklists`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200)
          .expect(res => {
            const checklists = res.body
            assert.equal(checklists.length, newChecklists.length)
            expect(checklists.length).to.equal(newChecklists.length)

            expect(checklists[0].id).to.equal(newChecklists[0].id)
            expect(checklists[0].title).to.equal(newChecklists[0].title)

            expect(checklists[1].id).to.equal(newChecklists[1].id)
            expect(checklists[1].title).to.equal(newChecklists[1].title)
          })
          .end(done)
      })
    })
  })

  it('returns empty checklist for event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .get(`/events/${newEvent.uri}/checklists`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          expect(res.body).to.deep.equal([])
        })
        .end(done)
    })
  })

  it('retrieves single checklist', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      request(app)
        .get(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .then(res => {
          const checklist = res.body
          expect(checklist.id).to.equal(checklistCount + 1)
          expect(checklist.title).to.equal(newChecklist.title)
          done()
        })
    })
  })

  it('returns 404 on missing checklist', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .get(`/events/${newEvent.uri}/checklists/999`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404, done)
    })
  })
})

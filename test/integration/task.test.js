'use strict'

var app = require('../../app')
var request = require('supertest')
var testHelper = require('../test_helper')
var models = require('../../models')
const Op = models.sequelize.Op

describe('task endpoint', function () {
  let taskCount

  beforeEach(done => {
    Promise.all([
      models.Task.max('id').then(lastId => {
        taskCount = lastId || 0
      })
    ]).then(() => done())
  })

  describe('create tasks', function () {
    it('creates task', function (done) {
      testHelper.createChecklist().then(newChecklist => {
        request(app)
          .post(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks`)
          .send({ name: 'Neuer Task' })
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(201)
          .then(res => {
            const task = res.body
            expect(task.id).to.equal(taskCount + 1)
            expect(task.name).to.equal('Neuer Task')
            expect(task.checked).to.equal(false)

            newChecklist.getTasks().then(tasks => {
              expect(tasks.length).to.equal(1)
              expect(tasks[0].id).to.equal(taskCount + 1)
              expect(tasks[0].name).to.equal('Neuer Task')
              expect(tasks[0].checked).to.equal(false)
              done()
            })
          })
      })
    })

    it('creates multiple tasks', function (done) {
      testHelper.createChecklist().then(newChecklist => {
        request(app)
          .post(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks`)
          .send([{ name: 'Neuer Task' }, { name: 'Neuer Task2', checked: true }])
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(201)
          .then(res => {
            const tasks = res.body
            expect(tasks[0].id).to.equal(taskCount + 1)
            expect(tasks[0].name).to.equal('Neuer Task')
            expect(tasks[1].id).to.equal(taskCount + 2)
            expect(tasks[1].name).to.equal('Neuer Task2')
            expect(tasks[1].checked).to.equal(true)

            newChecklist.getTasks().then(tasks => {
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

  it('handles validation errors on failing create for task of event', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      request(app)
        .post(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks`)
        .send({ name: '' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(422)
        .expect(res => {
          const errors = res.body
          assert.equal(errors.length, '2')
          assert.equal(errors[0].attribute, 'name')
          assert.equal(errors[0].message, 'Validation notEmpty on name failed')
          assert.equal(errors[1].attribute, 'name')
          assert.equal(errors[1].message, 'Validation len on name failed')
        })
        .end(done)
    })
  })

  it('updates task for event', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .patch(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}`)
        .send({ name: 'new name', checked: true })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const task = res.body
          expect(task.id).to.equal(newTask.id)
          expect(task.name).to.equal('new name')
          expect(task.checked).to.equal(true)
        })
        .end(done)
    })
  })

  it('returns 404 on missing task on delete', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      request(app)
        .patch(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks/999`)
        .send({ name: 'new name' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404, done)
    })
  })

  it('handles validation errors on failing update for task of event', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .patch(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}`)
        .send({ name: '' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(422)
        .expect(res => {
          const errors = res.body
          assert.equal(errors.length, '3')
          assert.equal(errors[0].attribute, 'checked')
          assert.equal(errors[0].message, 'Task.checked cannot be null')
          assert.equal(errors[1].attribute, 'name')
          assert.equal(errors[1].message, 'Validation notEmpty on name failed')
          assert.equal(errors[2].attribute, 'name')
          assert.equal(errors[2].message, 'Validation len on name failed')
        })
        .end(done)
    })
  })

  it('retrieves task', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .get(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const task = res.body
          expect(task.id).to.equal(taskCount + 1)
          expect(task.name).to.equal('Neuer Task')
        })
        .end(done)
    })
  })

  it('retrieves all tasks of event', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      Promise.all([
        testHelper.createTask(newChecklist.id),
        testHelper.createTask(newChecklist.id)
      ]).then(newTasks => {
        request(app)
          .get(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200)
          .expect(res => {
            const tasks = res.body
            assert.equal(tasks.length, newTasks.length)
            assert.equal(tasks[0].name, newTasks[0].name)
            assert.isAtLeast(tasks[0].id, newTasks[0].id)
            assert.equal(tasks[1].name, newTasks[1].name)
            assert.isAtLeast(tasks[1].id, newTasks[1].id)
          })
          .end(done)
      })
    })
  })

  it('returns 404 on missing task', function (done) {
    testHelper.createChecklist().then(newChecklist => {
      request(app)
        .get(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks/999`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404, done)
    })
  })

  describe('delete tasks', function () {
    after(done => {
      // reset auto increment after deletes
      testHelper.truncateTables([
        models.Task
      ]).then(() => done())
    })

    it('deletes task', function (done) {
      testHelper.createTask().then(newTask => {
        request(app)
          .delete(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}`)
          .expect(204)
          .then(res => {
            models.Task.count().then(count => {
              expect(count).to.equal(taskCount)
              done()
            })
          })
      })
    })

    it('deletes task and removes assignees', function (done) {
      testHelper.createTask().then(newTask => {
        Promise.all([
          testHelper.createParticipant(newTask.checklist.event.id),
          testHelper.createParticipant(newTask.checklist.event.id)
        ]).then(participants => {
          Promise.all([
            testHelper.createTaskAssignee(newTask.id, participants[0].id),
            testHelper.createTaskAssignee(newTask.id, participants[1].id)
          ]).then(() => {
            request(app)
              .delete(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}`)
              .expect(204)
              .then(res => {
                models.Task.count().then(count => {
                  expect(count).to.equal(taskCount)
                  models.TaskAssignee.findAll({
                    where: {
                      participantId: {
                        [Op.in]: [participants[0].id, participants[1].id]
                      }
                    }
                  }).then(result => {
                    expect(result.length).to.equal(0)
                    done()
                  })
                })
              })
          })
        })
      })
    })

    it('returns 404 on missing task on delete', function (done) {
      testHelper.createChecklist().then(newChecklist => {
        request(app)
          .delete(`/events/${newChecklist.event.uri}/checklists/${newChecklist.id}/tasks/999`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(404, done)
      })
    })
  })

  it('assigns existing participant', function (done) {
    testHelper.createTask().then(newTask => {
      testHelper.createParticipant(newTask.checklist.event.id).then(newParticipant => {
        request(app)
          .post(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}/assignees`)
          .send({ id: newParticipant.id })
          .expect(201)
          .expect(res => {
            return newTask.getAssignees().then(assignees => {
              expect(assignees.length).to.equal(1)
              expect(assignees[0].to_json).to.deep.equal(newParticipant.to_json)
            })
          })
          .end(done)
      })
    })
  })

  it('assignes new participant', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .post(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}/assignees`)
        .send({ name: 'Hannah' })
        .expect(201)
        .expect(res => {
          return newTask.getAssignees().then(assignees => {
            expect(assignees.length).to.equal(1)
            expect(assignees[0].name).to.equal('Hannah')
          })
        })
        .end(done)
    })
  })

  it('removes assignee', function (done) {
    testHelper.createTask().then(newTask => {
      testHelper.createParticipant(newTask.checklist.event.id).then(newParticipant => {
        testHelper.createTaskAssignee(newTask.id, newParticipant.id).then(() => {
          request(app)
            .delete(`/events/${newTask.checklist.event.uri}/checklists/${newTask.checklist.id}/tasks/${newTask.id}/assignees/${newParticipant.id}`)
            .expect(204)
            .then(res => {
              newTask.getAssignees().then(assignees => {
                expect(assignees.length).to.equal(0)
              }).then(() => {
                newParticipant.getTasks().then(tasks => {
                  expect(tasks.length).to.equal(0)
                  done()
                })
              })
            })
        })
      })
    })
  })
})

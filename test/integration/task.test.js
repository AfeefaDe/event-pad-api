'use strict'

var app = require('../../app')
var request = require('supertest')
var testHelper = require('../test_helper')

describe('task endpoint', function () {
  it('creates task for event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .post(`/events/${newEvent.id}/tasks`)
        .send({ name: 'Neuer Task' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201)
        .expect(res => {
          const task = res.body
          assert.equal(task.name, 'Neuer Task')
          assert.isAtLeast(task.id, 1)
        })
        .end(done)
    })
  })

  it('handles validation errors on failing create for task of event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .post(`/events/${newEvent.id}/tasks`)
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
        .patch(`/events/${newTask.eventId}/tasks/${newTask.id}`)
        .send({ name: 'new name' })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const task = res.body
          assert.equal(task.name, 'new name')
          assert.equal(task.id, newTask.id)
          assert.equal(task.eventId, newTask.eventId)
        })
        .end(done)
    })
  })

  it('handles validation errors on failing update for task of event', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .patch(`/events/${newTask.eventId}/tasks/${newTask.id}`)
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

  it('retrieves single task of event', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .get(`/events/${newTask.eventId}/tasks/${newTask.id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const task = res.body
          assert.equal(task.name, newTask.name)
          assert.isAtLeast(task.id, newTask.id)
        })
        .end(done)
    })
  })

  it('deletes task of event', function (done) {
    testHelper.createTask().then(newTask => {
      request(app)
        .delete(`/events/${newTask.eventId}/tasks/${newTask.id}`)
        .expect(204)
        .end(done)
    })
  })

  it('retrieves all tasks of event', function (done) {
    testHelper.createEvent().then(newEvent => {
      Promise.all([
        testHelper.createTask(newEvent.id),
        testHelper.createTask(newEvent.id)
      ]).then(newTasks => {
        request(app)
          .get(`/events/${newTasks[0].eventId}/tasks`)
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

  it('returns 404 on missing event', function (done) {
    request(app)
      .get('/events/999/tasks')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404, done)
  })

  it('returns 404 on missing task for exisiting event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .get('/events/999/tasks')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404, done)
    })
  })
})

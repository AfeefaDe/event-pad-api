'use strict'

var app = require('../../app')
var request = require('supertest')
var testHelper = require('../test_helper')

describe('event endpoint', function () {
  it('creates event', function (done) {
    request(app)
      .post('/events')
      .send({
        title: 'Neues Event'
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .expect(res => {
        const event = res.body
        assert.equal(event.title, 'Neues Event')
        assert.ok(event.uri.match(/-Neues-Event/))
        assert.isAtLeast(event.id, 1)
      })
      .end(done)
  })

  it('gets event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .get(`/events/${newEvent.id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const event = res.body
          assert.equal(event.title, newEvent.title)
          assert.isAtLeast(event.id, newEvent.id)
        })
        .end(done)
    })
  })

  it('returns 404 on missing event', function (done) {
    request(app)
      .get('/events/999')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404, done)
  })
})

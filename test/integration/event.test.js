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
        expect(event.uri).to.match(/\w{24}-Neues-Event/)
        expect(event.id).to.be.at.least(1)
      })
      .end(done)
  })

  it('handles validation errors on failing create of event', function (done) {
    request(app)
      .post('/events')
      .send({
        title: ''
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(422)
      .expect(res => {
        const errors = res.body
        expect(errors.length).to.equal(2)
        expect(errors[0].attribute).to.equal('title')
        expect(errors[0].message).to.equal('Validation notEmpty on title failed')
        expect(errors[1].attribute).to.equal('title')
        expect(errors[1].message).to.equal('Validation len on title failed')
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
          expect(event.title).to.equal(newEvent.title)
          expect(event.id).to.equal(newEvent.id)
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

  it('gets event by uri', function (done) {
    testHelper.createEvent({uri: 'abcde-Mein-Event'}).then(newEvent => {
      request(app)
        .get(`/events?uri=${newEvent.uri}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const event = res.body
          expect(event.title).to.equal(newEvent.title)
          expect(event.id).to.equal(newEvent.id)
        })
        .end(done)
    })
  })

  it('returns 404 for wrong uri', function (done) {
    request(app)
      .get(`/events?uri=1234-Ich-Komme`)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404, done)
  })
})

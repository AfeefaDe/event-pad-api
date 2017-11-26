'use strict'

var app = require('../../app')
var request = require('supertest')
var testHelper = require('../test_helper')

describe('participant endpoint', function () {
  it('creates participant for event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .post(`/events/${newEvent.id}/participants`)
        .send({
          name: 'Neuer Teilnehmer',
          email: 'test@example.com',
          rsvp: '1',
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201)
        .expect(res => {
          const participant = res.body
          assert(participant.name, 'Neuer Teilnehmer')
          assert.isAtLeast(participant.id, 1)
        })
       .end(done)
    })
  })

  it('retrieves participant of event', function (done) {
    testHelper.createParticipant().then(newParticipant => {
      request(app)
        .get(`/events/${newParticipant.eventId}/participants/${newParticipant.id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const participant = res.body
          assert(participant.name, newParticipant.name)
          assert.isAtLeast(participant.id, newParticipant.id)
        })
        .end(done)
    })
  })
})

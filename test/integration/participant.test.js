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
          rsvp: '1'
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(201)
        .expect(res => {
          const participant = res.body
          assert.equal(participant.name, 'Neuer Teilnehmer')
          assert.isAtLeast(participant.id, 1)
        })
        .end(done)
    })
  })

  it('retrieves single participant of event', function (done) {
    testHelper.createParticipant().then(newParticipant => {
      request(app)
        .get(`/events/${newParticipant.eventId}/participants/${newParticipant.id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(res => {
          const participant = res.body
          assert.equal(participant.name, newParticipant.name)
          assert.isAtLeast(participant.id, newParticipant.id)
        })
        .end(done)
    })
  })

  it('deletes participant of event', function (done) {
    testHelper.createParticipant().then(newParticipant => {
      request(app)
        .delete(`/events/${newParticipant.eventId}/participants/${newParticipant.id}`)
        // HTTP status 204 has no content type header
        // .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(204)
        .expect(res => {
          // TODO: Why can we not get an empty response like ''?
          // assert.equal(res.body, '')
        })
        .end(done)
    })
  })

  it('retrieves all participants of event', function (done) {
    testHelper.createEvent().then(newEvent => {
      Promise.all([
        testHelper.createParticipant(newEvent.id),
        testHelper.createParticipant(newEvent.id)
      ]).then(newParticipants => {
        request(app)
          .get(`/events/${newParticipants[0].eventId}/participants`)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(200)
          .expect(res => {
            const participants = res.body
            assert.equal(participants.length, newParticipants.length)
            assert.equal(participants[0].name, newParticipants[0].name)
            assert.isAtLeast(participants[0].id, newParticipants[0].id)
            assert.equal(participants[1].name, newParticipants[1].name)
            assert.isAtLeast(participants[1].id, newParticipants[1].id)
          })
          .end(done)
      })
    })
  })

  it('returns 404 on missing event', function (done) {
    request(app)
      .get('/events/999/participants')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404, done)
  })

  it('returns 404 on missing participant for exisiting event', function (done) {
    testHelper.createEvent().then(newEvent => {
      request(app)
        .get('/events/999/participants')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(404, done)
    })
  })
})

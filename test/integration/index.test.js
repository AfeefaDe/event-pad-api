'use strict'

var app = require('../../app')
var request = require('supertest')

describe('user creation page', function () {
  it('prints hello world', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect('Content-Length', '12')
      .expect(200, 'Hello World!', done)
  })
})

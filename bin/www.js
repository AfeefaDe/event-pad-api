#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app')
var debug = require('debug')('event-api')
var path = require('path')
var config = require(path.join(__dirname, '/../config/config.json'))

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.app_port)
app.set('port', port)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Swagger sutff
 */

var SwaggerExpress = require('swagger-express-mw')

var swaggerConfig = {
  appRoot: path.join(__dirname, '..') // required config
}

SwaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  swaggerExpress.register(app)

  /**
   * Listen on provided port, on all network interfaces.
   */

  app.listen(port)
  debug('Listening on port ' + port)
})

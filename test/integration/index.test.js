'use strict'

var db = require('../../models')

after(() => setTimeout(() => db.close(), 10))

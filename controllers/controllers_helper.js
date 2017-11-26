'use strict'

module.exports = {
  handleError (error, res, next) {
    const errors = this.checkForValidationError(error)
    if (errors.length) {
      res.status(422).send(this.buildResponseError(errors, 422))
    } else {
      next(error)
    }
  },

  checkForValidationError (error) {
    let errors = []
    if (error.name === 'SequelizeValidationError') {
      errors = error.errors.map(e => {
        return { message: e.message, attribute: e.path }
      })
    }
    return errors
  },

  buildResponseError (errors, status) {
    return errors.map(error => {
      error.status = status
      return error
    })
  }
}

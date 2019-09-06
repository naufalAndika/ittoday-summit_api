const BaseError = require('../errors/BaseError')

class NotFound extends BaseError {
  constructor (message) {
    super(message)
    this.message = message
    this.code = 404
  }
}

module.exports = NotFound
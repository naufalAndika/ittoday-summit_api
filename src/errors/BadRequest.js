const BaseError = require('../errors/BaseError')

class BadRequest extends BaseError {
  constructor (message) {
    super(message)
    this.message = message
    this.code = 400
  }
}

module.exports = BadRequest
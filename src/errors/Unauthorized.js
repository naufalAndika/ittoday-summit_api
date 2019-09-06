const BaseError = require('../errors/BaseError')

class Unauthorized extends BaseError {
  constructor (message) {
    super(message)
    this.message
    this.code = 401
  }
}

module.exports = Unauthorized
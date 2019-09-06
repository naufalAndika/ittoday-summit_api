class BaseError extends Error {
  constructor (message) {
    super(message)
  }

  throwError () {
    this.code = this.hasOwnProperty('code') ? this.code : 500
    throw this
  }
}

module.exports = BaseError
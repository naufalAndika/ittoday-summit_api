class Unauthorized extends Error {
  constructor (message) {
    super(message)
    this.message
    this.code = 401
  }
}

module.exports = Unauthorized
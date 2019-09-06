const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Unauthorized = require('../errors/Unauthorized')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decodedToken = jwt.verify(token, 'summit', (error, response) => {
      if (error) {
        throw new Unauthorized('Token invalid')
      }
    })

    const user = await User.findOne({
      _id: decodedToken._id,
      'tokens.token': token
    })

    if (!user) {
      throw new Unauthorized('Please authenticate')
    }

    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(e.code).send(e.message)
  }
}

module.exports = auth
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decodedToken = jwt.verify(token, 'summit')

    const user = await User.findOne({
      _id: decodedToken._id,
      'tokens.token': token
    })

    if (!user) {
      throw new Error('please authenticate')
    }

    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(401).send()
  }
}

module.exports = auth
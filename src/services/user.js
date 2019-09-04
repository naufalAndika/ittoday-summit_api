const User = require('../models/user')

const createUser = async (data) => {
  const userRole = 1
  const user = new User({
    ...data,
    role: userRole
  })

  try {
    await user.save()
    const token = await user.generateToken()
    return {
      user,
      token
    }
  } catch (e) {
    throw e
  }
}

const login = async (email, password) => {
  try {
    const user = await User.findByEmailAndPassword(email, password)
    const token = await user.generateToken()
    return {
      user,
      token
    }
  } catch (e) {
    throw e
  }
}

const logout = async (user, currentToken) => {
  try {
    user.tokens = user.tokens.filter((token) => token.token != currentToken)
    await user.save()
  } catch (e) {
    throw e
  }
}

const logoutAll = async (user) => {
  try {
    user.tokens = []
    await user.save()
  } catch (e) {
    throw e
  }
}

module.exports = {
  createUser,
  login,
  logout,
  logoutAll
}
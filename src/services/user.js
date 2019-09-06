const User = require('../models/user')

const create = async (data) => {
  const user = new User(data)

  try {
    await user.save()
    const token = await user.generateToken()
    return {
      user,
      token
    }
  } catch (e) {
    e.throwError()
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
    e.throwError()
  }
}

const logout = async (user, currentToken) => {
  try {
    user.tokens = user.tokens.filter((token) => token.token != currentToken)
    await user.save()
  } catch (e) {
    e.throwError()
  }
}

const logoutAll = async (user) => {
  try {
    user.tokens = []
    await user.save()
  } catch (e) {
    e.throwError()
  }
}

const activity = async (user) => {
  try {
    let activity = []

    await user.populate('receivedActivity').execPopulate()

    activity = activity.concat(user.receivedActivity)
    return activity
  } catch (e) {
    e.throwError()
  }
}

const addExperience = async (event) => {
  await event.populate('members.member').execPopulate()
  event.members.forEach(async (member) => {
    await member.member.addExperience(event)
  })
}

module.exports = {
  create,
  login,
  logout,
  logoutAll,
  activity,
  addExperience
}
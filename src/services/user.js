const User = require('../models/user')
const NotFound = require('../errors/NotFound')

const findById = async (id) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new NotFound('User not found!')
    }
    return user
  } catch (e) {
    e.throwError()
  }
}

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
    console.log(e)
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
  await event.populate('leader').execPopulate()
  console.log(event.leader)
  event.members.forEach(async (member) => {
    await member.member.addExperience(event)
    console.log(member.member)
  })
  await event.leader.addExperience(event)
}

const detail = async (id) => {
  try {
    const user = await findById(id)
    await user.populate('experiences').execPopulate()
    return user
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

module.exports = {
  create,
  login,
  logout,
  logoutAll,
  activity,
  addExperience,
  detail
}
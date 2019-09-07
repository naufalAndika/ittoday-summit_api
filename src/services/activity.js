const Activity = require('../models/activity')
const userService = require('../services/user')
const NotFound = require('../errors/NotFound')

const findById = async (id) => {
  try {
    const activity = await Activity.findById(id)
    if (!activity) {
      throw new NotFound('Activity not found!')
    }
    return activity
  } catch (e) {
    e.throwError()
  }
}

const create = async (data) => {
  const activity = new Activity(data)
  try {
    await activity.save()
    return activity
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

const findByUser = async (user) => {
  try {
    const activity = await userService.activity(user)
    return activity
  } catch (e) {
    e.throwError()
  }
}

const accept = async (id) => {
  try {
    let activity = await findById(id)
    const actions = activity.action.split(':')
    activity.isDone = true
    await activity.save()
    if (actions[0] === 'event') {
      return {
        event: actions[1],
        user: activity.sender,
        action: actions[0]
      }
    } else if (actions[0] === 'guide') {
      return {
        event: actions[1],
        leader: activity.receiver,
        action: actions[0]
      }
    } else if (actions[0] === 'finish') {
      return {
        event: actions[1],
        member: activity.receiver,
        action: actions[0]
      }
    }
  } catch (e) {
    e.throwError()
  }
}

const decline = async (id) => {
  try {
    let activity = await findById(id)
    activity.isDone = true
    await activity.save()
    return {
      message: 'Declined!'
    }
  } catch (e) {
    e.throwError()
  }
}

module.exports = {
  create,
  accept,
  findByUser,
  decline
}
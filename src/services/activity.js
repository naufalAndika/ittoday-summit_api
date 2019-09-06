const Activity = require('../models/activity')

const createActivity = async (data) => {
  const activity = new Activity(data)
  try {
    await activity.save()
    return activity
  } catch (e) {
    throw e
  }
}

module.exports = {
  createActivity
}
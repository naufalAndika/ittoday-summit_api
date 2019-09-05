const Event = require('../models/event')

const create = async (data) => {
  const event = new Event(data)
  try {
    await event.save()
    return event
  } catch (e) {
    throw e
  }
}

const list = async () => {
  try {
    const events = await Event.find({})
    return events
  } catch (e) {
    throw e
  }
}

module.exports = {
  create,
  list
}
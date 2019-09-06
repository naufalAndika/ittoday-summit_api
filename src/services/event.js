const Event = require('../models/event')
const PendingEventMember = require('../models/pendingEventMember')
const User = require('../models/user')
const mountainService = require('../services/mountain')
const activityService = require('../services/activity.js')
const NotFound = require('../errors/NotFound')
const Unauthorized = require('../errors/Unauthorized')

const create = async (data) => {
  const event = new Event(data)
  console.log(data)
  try {
    await event.save()
    return event
  } catch (e) {
    e.throwError()
  }
}

const findById = async (id) => {
  try {
    const event = await Event.findById(id)

    if (!event) {
      throw new NotFound('Event not found!')
    }

    return event
  } catch (e) {
    e.throwError()
  }
}

const list = async () => {
  try {
    const events = await Event.find({})
    return events
  } catch (e) {
    e.throwError()
  }
}

const userEvent = async (user) => {
  try {
    let events = []

    await user.populate('events').execPopulate()
    await user.populate('leadEvents').execPopulate()
    events = events.concat(user.events).concat(user.leadEvents)

    return events
  } catch (e) {
    e.throwError()
  }
}

const detail = async (id) => {
  try {
    const event = await Event.findById(id)

    if (!event) {
      throw new NotFound('Event not found!')
    }

    await event.populate('mountain').execPopulate()
    await event.populate('leader').execPopulate()
    await User.populate(event.members, 'member')

    return event
  } catch (e) {
    e.throwError()
  }
}

const findByMountainId = async (id) => {
  try {
    const mountain = await mountainService.findById(id)
    await mountain.populate('events').execPopulate()

    if (!mountain) {
      throw new NotFound('Mountain not found!')
    }

    const events = mountain.events
    await Event.populate(events, 'leader')
    await Event.populate(events, 'mountain')
    await User.populate(event.members, 'member')

    return events
  } catch (e) {
    e.throwError()
  }
}

const removeMember = async (event, member) => {
  try {
    await event.removeMember(member)
    return event
  } catch (e) {
    e.throwError()
  }
}

const join = async (event, user) => {
  try {
    await pending({
      confirmedByUser: true,
      event,
      user
    })

    await activityService.createActivity({
      sender: user,
      receiver: event.leader,
      event,
      content: user.name + ' want to join ' + event.title
    })

    await activityService.createActivity({
      receiver: user,
      event,
      content: 'You requested to join ' + event.title
    })

    return {
      message: 'Request Sent!'
    }
  } catch (e) {
    e.throwError()
  }
}

const pending = async (data) => {
  const pendingMember = new PendingEventMember(data)
  try {
    await pendingMember.save()
    return pendingMember
  } catch (e) {
    e.throwError()
  }
}

const pendingMembersList = async (event, leader) => {
  if (event.isLeader(leader)) {
    try {
      const pendingMembers = await PendingEventMember.find({
        event
      })
      return pendingMembers
    } catch (e) {
      e.throwError()
    }
  }
}

const acceptJoin = async (id, user) => {
  try {
    const pendingMember = await PendingEventMember.findById(id)
    await pendingMember.populate('user').execPopulate()
    await pendingMember.populate('event').execPopulate()

    if (pendingMember.confirmedByLeader) {
      if (pendingMember.user === user) {
        const event = await pendingMember.accept()
        return event
      }
      throw new NotFound('Not found!')
    }

    if (pendingMember.event.isLeader(user)) {
      const event = await pendingMember.accept()
      return event
    }
    throw new Unauthorized('Unauthorized!')
  } catch (e) {
    throw e
  }
}

module.exports = {
  create,
  list,
  userEvent,
  detail,
  findByMountainId,
  removeMember,
  findById,
  join,
  pendingMembersList,
  acceptJoin
}
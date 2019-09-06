const Event = require('../models/event')
const PendingEventMember = require('../models/pendingEventMember')
const mountainService = require('../services/mountain')
const activityService = require('../services/activity.js')

const create = async (data) => {
  const event = new Event(data)
  try {
    await event.save()
    return event
  } catch (e) {
    throw e
  }
}

const findById = async (id) => {
  try {
    const event = await Event.findById(id)
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

const userEvent = async (user) => {
  try {
    let events = []
    
    await user.populate('events').execPopulate()
    await user.populate('leadEvents').execPopulate()
    events = events.concat(user.events).concat(user.leadEvents)
    
    return events
  } catch (e) {
    throw e
  }
}

const detail = async (id) => {
  try {
    const event = await Event.findById(id)
    await event.populate('mountain').execPopulate()
    await event.populate('leader').execPopulate()
    // await Event.populate(event, 'members')
    
    return event
  } catch (e) {
    throw e
  }
}

const findByMountainId = async (id) => {
  try {
    const mountain = await mountainService.findById(id)
    await mountain.populate('events').execPopulate()
    
    const events = mountain.events
    await Event.populate(events, 'leader')
    await Event.populate(events, 'mountain')
    // populate member
    
    return events
  } catch (e) {
    throw e
  }
}

const removeMember = async (event, member) => {
  try {
    await event.removeMember(member)
    return event
  } catch (e) {
    throw e
  }
}

const join = async (event, user) => {
  try {
    let data = await pending({
      confirmedByUser: true,
      event,
      user
    })
    
    data = await activityService.createActivity({
      sender: user,
      receiver: event.leader,
      event,
      content: user.name + ' want to join ' + event.title
    })

    data = await activityService.createActivity({
      receiver: user,
      event,
      content: 'You requested to join ' + event.title
    })

    return {
      message: 'Request Sent!'
    }
  } catch (e) {
    throw e
  }
}

const pending = async (data) => {
  const pendingMember = new PendingEventMember(data)
  try {
    await pendingMember.save()
    return pendingMember
  } catch (e) {
    throw e
  }
}

const pendingMembersList = async (event, leader) => {
  if (isLeader(event, leader)) {
    try {
      const pendingMembers = await PendingEventMember.find({
        event
      })
      return pendingMembers
    } catch (e) {
      throw e
    }
  }
}

const isLeader = (event, user) => {
  return event.leader.toString() === user._id.toString()
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
      // throw 404
    }

    if (isLeader(pendingMember.event, user)) {
      const event = await pendingMember.accept()
      return event
    }
    // throw 401 bukan leader
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
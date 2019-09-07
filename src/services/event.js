const Event = require('../models/event')
const PendingEventMember = require('../models/pendingEventMember')
const User = require('../models/user')
const mountainService = require('../services/mountain')
const activityService = require('../services/activity.js')
const userService = require('../services/user')
const NotFound = require('../errors/NotFound')
const promiseTimeout = require('../utils/index').promiseTimeout

const create = async (data) => {
  const event = new Event(data)
  try {
    await event.save()
    const now = Date.now()
    promiseTimeout(event.finishAt - now, finish(event._id))
    return event
  } catch (e) {
    console.log(e)
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
    await Event.populate(events, 'leader')

    return events
  } catch (e) {
    e.throwError()
  }
}

const findByUser = async (user) => {
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
    const event = await findById(id)

    if (!event) {
      throw new NotFound('Event not found!')
    }

    await event.populate('mountain').execPopulate()
    await event.populate('leader').execPopulate()
    await User.populate(event.members, 'member')

    return event
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

const findByMountainId = async (id) => {
  try {
    const events = await mountainService.events(id)
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

    await activityService.create({
      sender: user,
      receiver: event.leader,
      event,
      action: 'event:' + event._id,
      content: user.name + ' want to join ' + event.title
    })

    await activityService.create({
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
    const event = await findById(id)
    await event.join(user)

    return event
  } catch (e) {
    throw e
  }
}

const changeLeader = async (id, leader) => {
  try {
    const event = await findById(id)
    await event.changeLead(leader)
    return event
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

const finish = async (id) => {
  try {
    const event = await findById(id)
    await event.populate('members.member').execPopulate()
    console.log(event.members)
    event.members.forEach(async (member) => {
      await activityService.create({
        content: 'Finish your event!',
        action: 'finish:' + event._id,
        receiver: member.member
      })
    })
    await activityService.create({
      content: 'Finish your event!',
      action: 'finish:' + event._id,
      receiver: event.leader
    })
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

const confirmFinish = async (id, member) => {
  try {
    const event = await findById(id)
    await event.finish(member)

    if (event.finishAll) {
      userService.addExperience(event)
    }
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

const finishNow = async (id) => {
  try {
    const event = await findById(id)
    event.finishAt = Date.now()
    await finish(id)
    
    return {
      message: 'Go confirm it!'
    }
  } catch (e) {
    e.throwError()
  }
}

module.exports = {
  create,
  list,
  findByUser,
  detail,
  findByMountainId,
  removeMember,
  findById,
  join,
  pendingMembersList,
  acceptJoin,
  changeLeader,
  confirmFinish,
  finishNow
}
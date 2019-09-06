const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  startAt: {
    type: Date,
    required: true
  },
  finishAt: {
    type: Date,
    required: true
  },
  maximumMembers: {
    type: Number,
    required: true
  },
  content: {
    type: String
  },
  brochureImgPath: {
    type: String
  },
  type: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    default: 0
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  members: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  mountain: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Mountain'
  }
}, {
  timestamps: true
})

eventSchema.virtual('events', {
  ref: 'Event',
  localField: 'members',
  foreignField: '_id'
})

eventSchema.methods.join = async function (user) {
  const event = this
  
  event.members = event.members.concat({
    member: user
  })
  await event.save()
  return event
}

eventSchema.methods.removeMember = async function (user) {
  const event = this

  event.members = event.members.filter((member) => {
    return member.member != user._id.toString()
  })
  await event.save()
  return event
}

eventSchema.methods.isLeader = function (user) {
  const event = this
  return event.leader.toString() === user._id.toString()
}

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
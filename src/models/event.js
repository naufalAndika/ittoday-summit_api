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

eventSchema.methods.joinEvent = async function (user) {
  const event = this
  
  event.members = event.members.concat({
    member: user
  })
  await event.save()
  return event
}

eventSchema.methods.leaveEvent = async function (user) {
  const event = this

  event.members = event.members.filter((member) => {
    return member.member != user._id.toString()
  })
  await event.save()
  return event
}

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
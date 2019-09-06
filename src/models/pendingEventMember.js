const mongoose = require('mongoose')

const pendingEventMemberSchema = new mongoose.Schema({
  confirmedByUser: {
    type: Boolean,
    default: false
  },
  confirmedByLeader: {
    type: Boolean,
    default: false
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

pendingEventMemberSchema.methods.accept = async function () {
  const pendingMember = this
  
  await pendingMember.populate('event').execPopulate()
  await pendingMember.populate('user').execPopulate()
  
  await pendingMember.event.join(pendingMember.user)
  const event = pendingMember.event
  await pendingMember.remove()
  return event
}

const PendingEventMember = mongoose.model('PendingEventMember', pendingEventMemberSchema)

module.exports = PendingEventMember
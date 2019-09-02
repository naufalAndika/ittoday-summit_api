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
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

const PendingEventMember = mongoose.model('PendingEventMember', pendingEventMemberSchema)

module.exports = PendingEventMember
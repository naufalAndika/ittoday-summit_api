const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  content: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDone: {
    type: Boolean,
    default: false
  },
  action: {
    type: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity
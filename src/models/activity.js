const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  content: {
    type: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity
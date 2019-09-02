const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  }
}, {
  timestamps: true
})

const History = mongoose.model('History', historySchema)

module.exports = History
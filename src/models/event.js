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
  numberOfMembers: {
    type: Number,
    default: 0
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
  mountain: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Mountain'
  }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
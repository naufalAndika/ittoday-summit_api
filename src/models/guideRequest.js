const mongoose = require('mongoose')

const guideRequestSchema = new mongoose.Schema({
  startAt: {
    type: Date,
    required: true
  },
  finishAt: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mountain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mountain',
    required: true
  }
}, {
  timestamps: true
})

const GuideRequest = mongoose.model('GuideRequest', guideRequestSchema)

module.exports = GuideRequest
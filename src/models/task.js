const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdFor: {
    tyoe: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
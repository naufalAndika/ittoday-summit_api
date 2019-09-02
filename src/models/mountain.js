const mongoose = require('mongoose')

const mountainSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  coverImgPath: {
    type: String
  },
  height: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  content: {
    type: String
  }
}, {
  timestamps: true
})

mountainSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'mountain'
})

mountainSchema.statics.findByName = async (name) => {
  const mountain = await Mountain.findOne({ name })
  return mountain
}

const Mountain = mongoose.model('Mountain', mountainSchema)

module.exports = Mountain
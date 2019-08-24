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
})

const Mountain = mongoose.model('Mountain', mountainSchema)

module.exports = Mountain
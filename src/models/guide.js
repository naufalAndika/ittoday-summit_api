const mongoose = require('mongoose')
const validator = require('validator')

const guideSchema = new mongoose.Schema({
  identityNumber: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isNumeric(value)) {
        throw new Error('Identity Number is Invalid!')
      }
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  mountains: [{
    mountain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mountain'
    }
  }]
}, {
  timestamps: true
})

const Guide = mongoose.model('Guide', guideSchema)

module.exports = Guide
const mongoose = require('mongoose')
const validator = require('validator')
const BadRequest = require('../errors/BadRequest')

const guideSchema = new mongoose.Schema({
  identityNumber: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isNumeric(value)) {
        throw new BadRequest('Invalid identity number!')
      }
    }
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mountains: [{
    mountain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mountain'
    },
    price: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
})

guideSchema.methods.addMountains = async function (mountains) {
  const guide = this
  
  mountains.forEach((mountain) => {
    guide.mountains = guide.mountains.concat({ mountain })
  })

  await guide.save()
}

const Guide = mongoose.model('Guide', guideSchema)

module.exports = Guide
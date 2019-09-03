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
    ref: 'User',
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

guideSchema.methods.addMountains = async function (mountains) {
  const guide = this
  
  mountains.forEach((mountain) => {
    guide.mountains = guide.mountains.concat({ mountain })
  })

  await guide.save()
}

const Guide = mongoose.model('Guide', guideSchema)

module.exports = Guide
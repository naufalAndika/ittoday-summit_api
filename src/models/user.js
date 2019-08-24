const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is Invalid!')
      }
    }
  },
  identityNumber: {
    type: String,
    unique: true,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  phoneNumber: {
    type: String,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone Number is Invalid!')
      }
    }
  },
  address: {
    type: String
  },
  role: {
    type: Number
  },
  experiences: [{
    role: {
      type: String
    },
    mountain_name: {
      type: String
    },
    year: {
      type: Number
    }
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = User
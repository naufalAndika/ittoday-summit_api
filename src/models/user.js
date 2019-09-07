const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Unauthorized = require('../errors/Unauthorized')
const BadRequest = require('../errors/BadRequest')

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
        throw new BadRequest('Invalid email!')
      }
    }
  },
  password: {
    type: String,
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
        throw new BadRequest('Invalid phone number!')
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
    mountain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mountain'
    },
    date: {
      type: Date
    }
  }],
  tokens: [{
    token: {
      type: String
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'members.member'
})

userSchema.virtual('leadEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'leader'
})

userSchema.virtual('receivedActivity', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'receiver'
})

userSchema.virtual('sentActivity', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'sender'
})

userSchema.methods.generateToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'summit')
  user.tokens = user.tokens.concat({ token })
  
  await user.save()
  return token
}

userSchema.statics.findByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Unauthorized('Email or password doenst match!')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Unauthorized('Email or password doenst match!')
  }

  return user
}

userSchema.methods.addExperience = async function (event) {
  const user = this

  let exp = {
    role: 1,
    mountain: event.mountain,
    date: event.finishAt
  }
  if (user._id.toString() === event.leader.toString()) {
    exp.role = 2
  }
  user.experiences = user.experiences.concat(exp)
  await user.save()
}

userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  
  return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User
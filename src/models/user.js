const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
  password: {
    type: String,
    required: true
  },
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
  }],
  tokens: [{
    token: {
      type: String
    }
  }]
})

userSchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'members.member'
})

userSchema.methods.generateToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'summit', {
    expiresIn: '6 Hours'
  })
  user.tokens = user.tokens.concat({ token })
  
  await user.save()
  return token
}

userSchema.statics.findByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Email or Password Doesnt Match!')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Email or Password Doesnt Match!')
  }

  return user
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
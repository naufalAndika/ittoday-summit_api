const express = require('express')
const Guide = require('../models/guide')
const User = require('../models/user')
const router = new express.Router()

router.post('/guide', async (req, res) => {
  const guideField = {
    identityNumber: req.body.identityNumber,
    mountains: req.body.mountains
  }
  delete req.body.identityNumber
  delete req.body.mountains
  
  const guideRole = 2
  const user = new User({
    ...req.body,
    role: guideRole
  })

  try {
    await user.save()
    const token = await user.generateToken()

    const guide = new Guide({
      ...guideField,
      user: user._id
    })

    await guide.save()
    await guide.populate('user').execPopulate()

    res.status(201).send({
      guide,
      token
    })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/guides', async (req, res) => {
  try {
    const guides = await User.find({})
    guides.forEach((guide) => {
      guide.populate('user').execPopulate()
    })

    res.send(guides)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
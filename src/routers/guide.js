const express = require('express')
const Guide = require('../models/guide')
const User = require('../models/user')
const router = new express.Router()

router.post('/guide', async (req, res) => {
  const guideRole = 2
  const user = new User({
    ...req.body,
    role: guideRole
  })

  try {
    await user.save()
    const token = await user.generateToken()

    const guide = new Guide({
      identityNumber: req.body.identityNumber,
      user: user._id
    })
    await guide.addMountains(req.body.mountains)
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
    const guides = await Guide.find({})
    guides.forEach((guide) => {
      guide.populate('user').execPopulate()
    })

    res.send(guides)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
const express = require('express')
const router = new express.Router()
const Guide = require('../models/guide')
const User = require('../models/user')
const guideService = require('../services/guide')

router.post('/guide', async (req, res) => {
  try {
    const guideRole = 2
    const userData = {
      ...req.body,
      role: guideRole
    }
    const guideData = {
      identityNumber: req.body.identityNumber,
      mountains: req.body.mountains
    }
    const response = await guideService.create(userData, guideData)
    res.status(201).send(response)

  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/guides', async (req, res) => {
  try {
    const guides = await guideService.list()
    res.send(guides)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
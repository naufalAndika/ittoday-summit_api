const express = require('express')
const router = new express.Router()
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
    res.status(e.code).send(e.message)
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
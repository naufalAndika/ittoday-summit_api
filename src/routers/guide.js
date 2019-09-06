const express = require('express')
const router = new express.Router()
const guideService = require('../services/guide')
const auth = require('../middleware/auth')

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
    res.status(e.code).send(e.message)
  }
})

router.get('/guides/mountain/:id', async (req, res) => {
  try {
    const guides = await guideService.findByMountain(req.params.id)
    res.send(guides)
  } catch (e) {
    res.status(e.code).send(e.message)
  }
})

router.post('/guide/request/:id', auth, async (req, res) => {
  try {
    const response = await guideService.request(req.params.id, req.user, req.body.event)
    res.send(response)
  } catch (e) {
    res.status(e.code).send(e.message)
  }
})

module.exports = router
const express = require('express')
const router = new express.Router()
const Mountain = require('../models/mountain')
const mountainService = require('../services/mountain')

router.post('/mountain', async (req, res) => {
  try {
    const mountain = await mountainService.create(req.body)
    res.status(201).send(mountain)
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/mountain/:id', async (req, res) => {
  try {
    const mountain = await mountainService.findById(req.params.id)

    if (!mountain) {
      res.status(404).send()
    }
    
    res.send(mountain)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/mountain', async (req, res) => {
  try {
    const mountain = await mountainService.findByName(req.query.q)
    res.send(mountain)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/mountains', async (req, res) => {
  try {
    const mountains = await mountainService.list()
    res.send(mountains)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
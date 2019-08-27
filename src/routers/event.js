const express = require('express')
const Event = require('../models/event')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/event', auth, async (req, res) => {
  const event = new Event(req.body)
  event.leader = req.user
  
  try {
    await event.save()
    res.status(201).send(event)
  } catch (e) {
    res.status(400)
  }
})

router.post('/event/leader/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      res.status(404).send()
    }

    event.leader = req.body.leader
    await event.save()
    res.send(event)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({})
    res.send(events)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/event/me', auth, async (req, res) => {
  try {
    await req.user.populate('events').execPopulate()
    res.send(req.user.events)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/event/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      res.status(404).send()
    }

    res.send(event)
  } catch (e) {
    res.status(500).send()
  }
})


router.post('/event/join/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id)

    if (!event) {
      res.status(404).send({
        error: 'Unable to Find Event!'
      })
    }

    event = await event.joinEvent(req.user)
    res.send(event)
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/event/leave/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id)
    
    if (!event) {
      res.status(404).send({
        error: 'Unable to Find Event!'
      })
    }

    event = await event.leaveEvent(req.user)
    res.send(event)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
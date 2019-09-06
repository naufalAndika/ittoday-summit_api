const express = require('express')
const router = new express.Router()
const Event = require('../models/event')
const auth = require('../middleware/auth')
const eventService = require('../services/event')


router.post('/event', auth, async (req, res) => {
  try {
    req.body.leader = req.user
    const event = await eventService.create(req.body)
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
    const events = await eventService.list()
    res.send(events)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/event/me', auth, async (req, res) => {
  try {
    const events = await eventService.userEvent(req.user)
    res.send(events)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/event/:id', async (req, res) => {
  try {
    const event = await eventService.detail(req.params.id)
    if (!event) {
      res.status(404).send()
    }

    res.send(event)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/event/mountain/:id', async (req, res) => {
  try {
    const events = await eventService.findByMountainId(req.params.id)
    res.send(events)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/event/join/:id', auth, async (req, res) => {
  try {
    const event = await eventService.findById(req.params.id)
    const response = await eventService.join(event, req.user)
    res.send(response)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/event/leave/:id', auth, async (req, res) => {
  try {
    let event = await eventService.findById(req.params.id)
    event = await eventService.removeMember(event, req.user)
    res.send(event)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/event/members/pending/:id', auth, async (req, res) => {
  try {
    const event = await eventService.findById(req.params.id)
    const pendingMembers = await eventService.pendingMembersList(event, req.user)
    res.send(pendingMembers)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/event/accept/:id', auth, async (req, res) => {
  try {
    const event = await eventService.acceptJoin(req.params.id, req.user)
    res.send(event)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router